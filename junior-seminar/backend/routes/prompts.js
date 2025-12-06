const express = require("express");
const router = express.Router();
const { generatePrompt } = require("../utils/geminiClient");
const redisClient = require("../utils/redisClient");
const cacheKey = "reflection-prompts"
const indexKey = "current-index"
const cacheExpiryTime = 86400;
function generateCacheKey(title, authors, description) {
    const raw = `${title}|${authors?.join(",")}|${description ?? ""}`;
    return "reflection-prompts-" + Buffer.from(raw).toString("base64");
}
async function getCachedPrompts(title, authors, description) {
    const cacheKey = generateCacheKey(title, authors, description);
    const indexKey = `${cacheKey}-index`;

    const promptsJSON = await redisClient.get(cacheKey);
    const index = await redisClient.get(indexKey);
    const prompts = promptsJSON ? JSON.parse(promptsJSON) : [];
    return { prompts, index: index ? parseInt(index) : 0, cacheKey, indexKey };
}

async function setCachedPrompts(cacheKey, indexKey, prompts) {
    await redisClient.set(cacheKey, JSON.stringify(prompts), { EX: cacheExpiryTime });
    await redisClient.set(indexKey, 0, { EX: cacheExpiryTime });
}

async function incrementPromptIndex(indexKey) {
    const index = await redisClient.incr(indexKey);
    return index;
}
router.post("/generate-prompt", async (req, res) => {
    try {
        const { title, authors, description } = req.body;
        let { prompts, index, cacheKey, indexKey } = await getCachedPrompts(title, authors, description);

        if (!prompts.length || index >= prompts.length) {
            const newPrompts = await generatePrompt({ title, authors, description });
            await setCachedPrompts(cacheKey, indexKey, newPrompts);
            prompts = newPrompts;
            index = 0;
        }

        const currPrompt = prompts[index] || prompts[0];
        await incrementPromptIndex(indexKey);

        res.json({ prompt: currPrompt });
    } catch (err) {
        res.status(500).json({ error: "Failed to generate prompt." });
    }
});

module.exports = router;
