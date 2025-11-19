
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateCharacter } from "./generators/characterGenerator";
import { canUsePremium, incrementPremiumUsage, getMaxDailyPremium, getPremiumUsage } from "./services/premiumUsageStore";
import { addToCollection, getCollection, getCollectionCount } from "./services/collectionStore";
import { claimSlots, getBaseSlots, getExtraSlots, getMaxSlots } from "./services/slotStore";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Random Character API is running");
});

app.get("/collection/slots", (req, res) => {
  const deviceId = req.query.deviceId;
  if (!deviceId || typeof deviceId !== "string") {
    return res.status(400).json({ error: "deviceId is required" });
  }
  const used = getCollectionCount(deviceId);
  return res.json({
    baseSlots: getBaseSlots(),
    extraSlots: getExtraSlots(deviceId),
    maxSlots: getMaxSlots(deviceId),
    used,
  });
});

app.post("/ad/claim-collection-slots", (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId || typeof deviceId !== "string") {
    return res.status(400).json({ error: "deviceId is required" });
  }
  const claim = claimSlots(deviceId);
  const used = getCollectionCount(deviceId);
  return res.json({
    baseSlots: getBaseSlots(),
    extraSlots: claim.extraSlots,
    maxSlots: claim.maxSlots,
    used,
  });
});

app.post("/collection", (req, res) => {
  const { deviceId, character, parts } = req.body;
  if (!deviceId || typeof deviceId !== "string") {
    return res.status(400).json({ error: "deviceId is required" });
  }
  if (!character || typeof character !== "object") {
    return res.status(400).json({ error: "character is required" });
  }
  if (!Array.isArray(parts) || parts.length === 0) {
    return res.status(400).json({ error: "parts must be a non-empty array" });
  }

  const used = getCollectionCount(deviceId);
  const maxSlots = getMaxSlots(deviceId);
  if (used >= maxSlots) {
    return res.status(403).json({
      error: "COLLECTION_FULL",
      message: "도감 슬롯이 가득 찼어요. 광고 시청으로 확장할 수 있어요.",
      maxSlots,
      used,
    });
  }

  try {
    const result = addToCollection(deviceId, {
      name: character.name,
      description: character.description,
      imageUrl: character.imageUrl,
      premium: character.premium,
      soundUrl: character.soundUrl,
      parts,
    });
    return res.json({
      item: result.item,
      slots: {
        baseSlots: getBaseSlots(),
        extraSlots: getExtraSlots(deviceId),
        maxSlots: result.maxSlots,
        used: result.used,
      },
    });
  } catch (err) {
    if ((err as Error).message === "COLLECTION_FULL") {
      return res.status(403).json({
        error: "COLLECTION_FULL",
        message: "도감 슬롯이 가득 찼어요. 광고 시청으로 확장할 수 있어요.",
        maxSlots,
        used,
      });
    }
    console.error("Error adding to collection:", err);
    return res.status(500).json({ error: "Failed to save collection item" });
  }
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
