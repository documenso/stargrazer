import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma/prisma";

export default async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const stats = await prisma.gitHubStats.findFirstOrThrow();

    return res.status(200).send("API healthy :)");
  } catch (error: any) {
    console.error("Error fetching repository info:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
