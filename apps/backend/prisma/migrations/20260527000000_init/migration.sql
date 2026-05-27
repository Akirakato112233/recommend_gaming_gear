CREATE TYPE "GearCategory" AS ENUM ('MOUSE', 'KEYBOARD', 'HEADSET', 'MONITOR', 'CONTROLLER');

CREATE TABLE "Gear" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "category" "GearCategory" NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Gear_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Gear" ("id", "name", "brand", "category", "priceCents", "score", "description", "createdAt", "updatedAt")
VALUES
  ('gear_mouse_viper_v3', 'Viper V3 Pro', 'Razer', 'MOUSE', 15999, 96, 'Lightweight wireless mouse tuned for competitive FPS players.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('gear_keyboard_wooting_60he', '60HE+', 'Wooting', 'KEYBOARD', 17499, 94, 'Rapid trigger analog keyboard for low-latency movement control.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('gear_headset_cloud_alpha', 'Cloud Alpha Wireless', 'HyperX', 'HEADSET', 12999, 90, 'Comfortable wireless headset with long battery life and clean game audio.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('gear_monitor_aw2524hf', 'AW2524HF', 'Alienware', 'MONITOR', 49999, 92, 'High-refresh esports monitor for fast tracking and low motion blur.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
