import { HfInference } from "@huggingface/inference";
import items from "../data/items.js";

export const recommendController = async (req, res) => {
  try {
    const {
      age = "not specified",
      color = "not specified",
      height = "not specified",
      style = "not specified",
      occasion = "not specified",
    } = req.body;

    const HF_API_KEY = process.env.HF_API_KEY;

    if (!HF_API_KEY) {
      return res.status(400).json({ error: "HF_API_KEY not set" });
    }

    const hf = new HfInference(HF_API_KEY);

    const prompt = `
You are a shopping recommendation AI.

User details:
Age: ${age}
Skin tone: ${color}
Height: ${height}
Style: ${style}
Occasion: ${occasion}

From the product list below, select ONLY ONE best item.
Reply strictly in this format:
Item Name: <name>
Reason: <short reason>

Products:
${JSON.stringify(items.slice(0, 10))}
`;

    const response = await hf.textGeneration({
      model: "HuggingFaceH4/zephyr-7b-beta",
      inputs: prompt,
      max_new_tokens: 120,
    });

    const text = response.generated_text?.trim();
    if (!text) throw new Error("Empty AI response");

    return res.json({ recommendation: text, fallback: false });

  } catch (error) {
    const randomItem = items[Math.floor(Math.random() * items.length)];

    return res.status(200).json({
      recommendation: `Item Name: ${randomItem.name}\n Selected based on your preferences`,
      fallback: true,
    });
  }
};
