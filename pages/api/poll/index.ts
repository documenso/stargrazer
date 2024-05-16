import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2023-08-16",
});

export default async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const generalStats = await axios.get("https://api.github.com/repos/documenso/documenso");

    const earlyAdopters = await getCountOfActiveSubscriptions();
    const mergedPRs = await axios.get(
      "https://api.github.com/search/issues?q=repo:documenso/documenso/+is:pr+merged:>=2010-01-01&page=0&per_page=1"
    );

    const { stargazers_count, forks_count, open_issues_count, open_issues } = generalStats.data;
    const { total_count } = mergedPRs.data;

    await prisma.gitHubStats.create({
      data: {
        time: new Date(),
        stars: stargazers_count,
        forks: forks_count,
        openIssues: open_issues,
        mergedPRs: total_count,
      },
    });

    await prisma.stripeStats.create({
      data: {
        time: new Date(),
        earlyAdopters: earlyAdopters,
      },
    });

    res
      .status(200)
      .json(
        `Polled: {stars: ${stargazers_count},forks: ${forks_count}},openIssues ${open_issues}},mergedPRs: ${total_count}},earlyAdopters: ${earlyAdopters}}`
      );
  } catch (error: any) {
    console.error("Error fetching repository info:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const earlyAdopterProductIds = process.env.EARLY_ADOPTER_PRODUCTS || "";

async function getCountOfActiveSubscriptions() {
  try {
    let activeSubscriptionsCount = 0;
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const subscriptions: Stripe.Response<Stripe.ApiList<Stripe.Subscription>> = await stripe.subscriptions.list({
        status: "active",
        limit: 100,
        starting_after: startingAfter,
      });

      subscriptions.data.forEach((subscription) => {
        const hasActiveProduct = subscription.items.data.some((item) => {
          const productId = typeof item.price.product === "string" ? item.price.product : item.price.product.id;
          return earlyAdopterProductIds.includes(productId);
        });

        if (hasActiveProduct) {
          activeSubscriptionsCount++;
        }
      });

      hasMore = subscriptions.has_more;
      if (hasMore) {
        startingAfter = subscriptions.data[subscriptions.data.length - 1].id;
      }
    }

    return activeSubscriptionsCount;
  } catch (error) {
    console.error("Error counting active subscriptions:", error);
  }
}
