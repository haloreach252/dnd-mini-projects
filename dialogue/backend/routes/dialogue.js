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
  expectedLength: z.number().min(1).max(3).optional()
});

function extractFirstJsonBlock(text) {
  // Remove markdown-style code block wrappers like ```json ... ```
  const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1');

  const match = cleaned.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error("No valid JSON found in model response");

  return JSON.parse(match[0]);
}


router.post('/generate', async (ctx) => {
  try {
    const parsed = DialogueRequestSchema.parse(ctx.request.body);
    const formattedPrompt = buildPrompt(parsed);

    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat-v3-0324:free',
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
