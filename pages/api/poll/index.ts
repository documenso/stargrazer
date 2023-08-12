import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(
      "https://api.github.com/repos/documenso/documenso"
    );

    const { stargazers_count, forks_count, open_issues_count, open_issues } =
      response.data;

    await prisma.gitHubStats.create({
      data: {
        time: new Date(),
        stars: stargazers_count,
        forks: forks_count,
        openIssues: open_issues,
      },
    });

    res
      .status(200)
      .json(`Polled: {stars: ${stargazers_count}, forks: ${forks_count}}`);
  } catch (error: any) {
    console.error("Error fetching repository info:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
