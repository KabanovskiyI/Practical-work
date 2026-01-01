function cleanGeminiResponse(response) {
  let cleaned = response.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

module.exports = { cleanGeminiResponse };
