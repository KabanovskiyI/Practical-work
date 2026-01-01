require("dotenv").config();

async function askGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    apiKey;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}

module.exports = { askGemini };
