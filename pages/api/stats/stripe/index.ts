import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../prisma/prisma";

export default async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const stripeStats: Stat[] = await prisma.stripeStats.findMany({
      orderBy: { time: "desc" },
    });

    res.status(200).json(getNewestStatsPerMonth(stripeStats));
  } catch (error: any) {
    console.error("Error fetching info:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

interface Stat {
  id: number;
  time: Date;
  earlyAdopters: number;
}

interface GroupedStats {
  [key: string]: {
    earlyAdopters: number;
  };
}

function getNewestStatsPerMonth(stats: Stat[]): GroupedStats {
  const groupedStats: { [key: string]: Stat } = {};

  stats.forEach((stat) => {
    const year = stat.time.getFullYear();
    const month = stat.time.getMonth() + 1;
    const key = `${year}-${month}`;

    if (!(key in groupedStats) || stat.time > groupedStats[key].time) {
      groupedStats[key] = stat;
    }

    delete groupedStats[key]["id"];
    delete groupedStats[key]["time"];
  });

  return groupedStats;
}

interface StripeStat {
  time: Date;
  earlyAdopters: number;
}
