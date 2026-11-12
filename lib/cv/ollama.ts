import { z } from "zod";

const OllamaResponseSchema = z.object({
  message: z.object({
    content: z.string(),
  }),
});

export async function askOllama(system: string, prompt: string) {
  const baseUrl = (
    process.env.OLLAMA_BASE_URL?.trim() || "http://127.0.0.1:11434"
  ).replace(/\/+$/, "");
  const model = process.env.OLLAMA_MODEL?.trim() || "llama3.2";

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      format: "json",
      options: { temperature: 0.1 },
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
    signal: AbortSignal.timeout(120_000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Ollama respondió con estado HTTP ${response.status}.`);
  }

  const payload = OllamaResponseSchema.parse(await response.json());
  return payload.message.content;
}
