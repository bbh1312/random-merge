
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateCharacter } from "./generators/characterGenerator";
import { canUsePremium, incrementPremiumUsage, getMaxDailyPremium, getPremiumUsage } from "./services/premiumUsageStore";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Random Character API is running");
});

app.post("/generate-character", async (req, res) => {
  const { parts, premium, deviceId } = req.body;

  if (!Array.isArray(parts) || parts.length === 0) {
    return res.status(400).json({ error: "parts must be a non-empty array" });
  }

  const isPremium = premium === true;

  if (isPremium) {
    if (!deviceId || typeof deviceId !== "string") {
      return res.status(400).json({ error: "deviceId is required for premium requests" });
    }

    if (!canUsePremium(deviceId)) {
      return res.status(429).json({
        error: "DAILY_PREMIUM_LIMIT_EXCEEDED",
        message: "오늘 프리미엄 뽑기 횟수를 모두 사용했어요.",
        maxDaily: getMaxDailyPremium(),
        used: getPremiumUsage(deviceId),
      });
    }
  }

  try {
    const character = await generateCharacter(parts, { premium: isPremium });

    if (isPremium && deviceId) {
      incrementPremiumUsage(deviceId);
    }

    return res.json({
      ...character,
      premium: isPremium,
    });
  } catch (err) {
    console.error("Error in /generate-character:", err);
    return res.status(500).json({ error: "Failed to generate character" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
