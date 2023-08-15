import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const stats: Stat[] = await prisma.gitHubStats.findMany({
      orderBy: { time: "desc" },
    });

    res.status(200).json(groupMetricsByMonth(stats.reverse()));
  } catch (error: any) {
    console.error("Error fetching repository info:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

interface Stat {
  id: number;
  time: Date;
  stars: number;
  forks: number;
  mergedPRs: number;
  openIssues: number;
}

interface GroupedStats {
  [key: string]: {
    stars: number;
    forks: number;
    mergedPRs: number;
    openIssues: number;
  };
}

function groupMetricsByMonth(stats: Stat[]): GroupedStats {
  return stats.reduce((result: GroupedStats, stat: Stat) => {
    const year = stat.time.getFullYear();
    const month = stat.time.getMonth() + 1;

    const key = `${year}-${month}`;

    if (!result[key]) {
      result[key] = {
        stars: stat.stars,
        forks: stat.forks,
        mergedPRs: stat.mergedPRs,
        openIssues: stat.openIssues,
      };
    } else {
      result[key].stars = Math.max(result[key].stars, stat.stars);
      result[key].forks = Math.max(result[key].forks, stat.forks);
      result[key].mergedPRs = Math.max(result[key].mergedPRs, stat.mergedPRs);
      result[key].openIssues = Math.max(
        result[key].openIssues,
        stat.openIssues
      );
    }

    return result;
  }, {});
}
