
import axios from "axios";

const askai = async (message) => {
  if (!Array.isArray(message) || message.length === 0) {
    throw new Error("message must be a non-empty array");
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  try {
    const { data } = await axios.post(
      "https://openrouter.ai/api/v1/responses",
      {
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        input: message,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const outputText =
      data.output_text ||
      data.output
        ?.flatMap((item) => item.content ?? [])
        .filter((content) => content.type === "output_text")
        .map((content) => content.text)
        .join("");

    if (!outputText) {
      throw new Error("OpenRouter returned an empty response");
    }

    return outputText;
  } catch (error) {
    console.error(
      "OpenRouter API Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.error?.message ||
      error.message ||
      "AI request failed"
    );
  }
};

export default askai;
