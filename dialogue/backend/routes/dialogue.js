// routes/dialogue.js
const Router = require('@koa/router');
const axios = require('axios');
const { buildPrompt } = require('../utils/promptBuilder');
const { z } = require('zod');

const router = new Router();

const DialogueRequestSchema = z.object({
  prompt: z.string().min(1),
  npcRole: z.string().min(1),
  personality: z.string().min(1),
  sceneContext: z.string().optional(),
  expectedLength: z.number().min(1).max(3).optional(),
  lineStyle: z.enum(["short", "normal", "long"]).optional(),
  model: z.enum([
    "openrouter/optimus-alpha",
    "deepseek/deepseek-chat-v3-0324:free",
    "deepseek/deepseek-r1:free"
  ])
});

function extractFirstJsonBlock(raw) {
  // Remove markdown fences like ```json ... ```
  const cleaned = raw
    .replace(/```(?:json)?/, '') // remove opening ```json
    .replace(/```/, '') // remove closing ```
    .trim();

  // Now try parsing the cleaned string
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse cleaned response:");
    console.error(cleaned);
    throw new Error("Model returned invalid JSON.");
  }
}

router.post('/generate', async (ctx) => {
  try {
    const parsed = DialogueRequestSchema.parse(ctx.request.body);
    const formattedPrompt = buildPrompt(parsed);

    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: parsed.model || 'deepseek/deepseek-chat-v3-0324:free',
        messages: [{ role: 'user', content: formattedPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const completion = res.data.choices?.[0]?.message?.content;

    // Naive parsing - assumes the model returns strict JSON format
    
    try {
        const parsedResponse = extractFirstJsonBlock(completion);
        ctx.body = parsedResponse;
    } catch (parseError) {
        console.error("Raw completion:", completion);
        throw new Error("Failed to parse model output as JSON.");
    }
  } catch (err) {
    console.error(err);
    ctx.status = 400;
    ctx.body = { error: err.message || 'Failed to generate dialogue' };
  }
});

module.exports = router;
