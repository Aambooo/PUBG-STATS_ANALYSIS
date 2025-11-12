-- CreateTable
CREATE TABLE "player_cache_meta" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "shard" TEXT NOT NULL DEFAULT 'steam',
    "lastFetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_cache_meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_cache_meta_playerName_shard_key" ON "player_cache_meta"("playerName", "shard");
