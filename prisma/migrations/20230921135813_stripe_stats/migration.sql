-- CreateTable
CREATE TABLE "StripeStats" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "earlyAdopters" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StripeStats_pkey" PRIMARY KEY ("id")
);
