// utils/promptBuilder.js

function buildPrompt({ prompt, npcRole, personality, sceneContext, expectedLength = 2, lineStyle = 'normal' }) {
  let lengthInstruction = '';

  switch (lineStyle) {
    case 'short':
      lengthInstruction = 'Each line should be concise and punchy—around 5 to 10 words.';
      break;
    case 'long':
      lengthInstruction = 'Each line should be elaborate and descriptive—up to 2 or 3 sentences.';
      break;
    case 'normal':
    default:
      lengthInstruction = 'Each line should be immersive, about 1 sentence long.';
  }

  return `You are acting as an NPC in a fantasy roleplaying game.

- Role: ${npcRole}
- Personality: ${personality}
- Context: ${sceneContext || "No specific scene context"}
- Dialogue Request: ${prompt}

Write ${expectedLength} lines of immersive dialogue that reflect the NPC's role and personality.
${lengthInstruction}

Respond ONLY with raw JSON, no markdown formatting or extra text. Return exactly this format:
{ "lines": [...], "tags": [...] }
`;
}

module.exports = { buildPrompt };
