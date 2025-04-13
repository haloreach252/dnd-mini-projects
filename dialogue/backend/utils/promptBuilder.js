// utils/promptBuilder.js

function buildPrompt({ prompt, npcRole, personality, sceneContext, expectedLength = 2 }) {
  return `You are acting as an NPC in a fantasy roleplaying game.

- Role: ${npcRole}
- Personality: ${personality}
- Context: ${sceneContext || "No specific scene context"}
- Dialogue Request: ${prompt}

Write ${expectedLength} short lines of immersive dialogue that reflect the NPC's role and personality.
Each line should be suitable for real-time in-game use.

After generating the lines, return a list of metadata tags describing the tone, intent, or emotional content (e.g., [suspicious], [warning], [friendly], etc.)

After generating the lines, return ONLY valid JSON in this format:
{ "lines": [...], "tags": [...] }
`;
}

module.exports = { buildPrompt };
