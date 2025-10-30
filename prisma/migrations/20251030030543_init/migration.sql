-- CreateTable
CREATE TABLE "pubg_api" (
    "id" SERIAL NOT NULL,
    "api_key" TEXT NOT NULL,
    "data_source" TEXT NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pubg_api_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "player_id" TEXT NOT NULL,
    "player_name" TEXT NOT NULL,
    "team_name" TEXT,
    "region" TEXT NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "teams" (
    "team_id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "formation_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "matches" (
    "match_id" TEXT NOT NULL,
    "match_date" TIMESTAMP(3) NOT NULL,
    "game_mode" TEXT NOT NULL,
    "map_name" TEXT NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "player_stats" (
    "stat_id" SERIAL NOT NULL,
    "player_id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "damage" INTEGER NOT NULL,
    "rank_points" INTEGER NOT NULL,

    CONSTRAINT "player_stats_pkey" PRIMARY KEY ("stat_id")
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "request_id" SERIAL NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "banners" (
    "banner_id" SERIAL NOT NULL,
    "banner_title" TEXT NOT NULL,
    "banner_image" TEXT NOT NULL,
    "redirect_url" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("banner_id")
);

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;
