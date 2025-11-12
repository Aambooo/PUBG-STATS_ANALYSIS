-- CreateTable
CREATE TABLE "player_match_cache" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "shard" TEXT NOT NULL DEFAULT 'steam',
    "matchId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_match_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "player_match_cache_playerName_shard_createdAt_idx" ON "player_match_cache"("playerName", "shard", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "player_match_cache_playerName_shard_matchId_key" ON "player_match_cache"("playerName", "shard", "matchId");
