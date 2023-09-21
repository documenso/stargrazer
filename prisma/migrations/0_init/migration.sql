-- CreateTable
CREATE TABLE "GitHubStats" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "openIssues" INTEGER NOT NULL DEFAULT 0,
    "mergedPRs" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GitHubStats_pkey" PRIMARY KEY ("id")
);

