import dotenv from "dotenv";

dotenv.config();
dotenv.config();

async function listAvailableModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    const models = data.models ?? [];
    console.log("Available models:\n");
    models.forEach((m: any) => console.log(`🧠 ${m.name}`));
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listAvailableModels();
