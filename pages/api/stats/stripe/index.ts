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

    res.status(200).json(groupMetricsByMonth(stripeStats));
  } catch (error: any) {
    console.error("Error fetching repository info:", error.message);
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

function groupMetricsByMonth(stats: Stat[]): GroupedStats {
  return stats.reduce((result: GroupedStats, stat: Stat) => {
    const year = stat.time.getFullYear();
    const month = stat.time.getMonth() + 1;

    const key = `${year}-${month}`;

    if (!result[key]) {
      result[key] = {
        earlyAdopters: stat.earlyAdopters,
      };
    } else {
      result[key].earlyAdopters = Math.max(
        result[key].earlyAdopters,
        stat.earlyAdopters
      );
    }

    return result;
  }, {});
}

interface StripeStat {
  time: Date;
  earlyAdopters: number;
}
