import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const generalStats = await axios.get(
      "https://api.github.com/repos/documenso/documenso"
    );

    const { stargazers_count, forks_count, open_issues_count, open_issues } =
      generalStats.data;

    const mergedPRs = await axios.get(
      "https://api.github.com/search/issues?q=repo:documenso/documenso/+is:pr+merged:>=2010-01-01&page=0&per_page=1"
    );

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

    res
      .status(200)
      .json(`Polled: {stars: ${stargazers_count}, forks: ${forks_count}}, openIssues: ${open_issues}}, mergedPRs: ${total_count}}`);
  } catch (error: any) {
    console.error("Error fetching repository info:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
