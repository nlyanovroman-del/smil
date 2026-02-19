import scales from "../data/scales";

function buildSystemPrompt(scaleId, archetype, customCharacter) {
  // keep your existing logic unchanged
}

export async function sendMessage(scaleId, messages, archetype, customCharacter) {
  const systemPrompt = buildSystemPrompt(scaleId, archetype, customCharacter);

  const response = await fetch("http://localhost:5174/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.text || "I have nothing to say right now.";
}

export async function getOpeningMessage(scaleId, archetype, customCharacter) {
  return sendMessage(
    scaleId,
    [{ role: "user", content: "Introduce yourself..." }],
    archetype,
    customCharacter
  );
}
