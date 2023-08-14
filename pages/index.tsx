import Head from "next/head";
import { prisma } from "../prisma/prisma";
import { Inter } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export default function IndexPage(props: {
  stats: {
    id: number;
    time: Date;
    stars: number;
    forks: number;
    mergedPRs: number;
    openIssues: number;
  }[];
}) {
  return (
    <>
      <Head>
        <title>Stargazer - Last Polls</title>
      </Head>
      <h1 className={inter.className}>Last Polls</h1>
      {props?.stats.map((stat) => (
        <div className={inter.className} key={JSON.stringify(stat.time)}>
          <b>{new Date(stat.time).toDateString()}</b> - {stat.stars} Stars,{" "}
          {stat.forks} Forks, {stat.openIssues} Open Issues, Merged PRs:{" "}
          {stat.mergedPRs}
        </div>
      ))}
    </>
  );
}

export async function getServerSideProps(context: any) {
  const stats = await prisma.gitHubStats.findMany({
    orderBy: { time: "desc" },
    take: 10,
  });
  return {
    props: {
      stats: JSON.parse(JSON.stringify(stats)),
    },
  };
}
