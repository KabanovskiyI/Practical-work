const { askGemini } = require("./api/gemini");
const { cleanGeminiResponse } = require("./utils/cleanResponse");

async function handleGetRequest(req, res) {
  try {
    // Разрешаем запросы с любого источника (можно заменить на конкретный origin)
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Обработка preflight-запроса OPTIONS
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    const url = new URL(req.url, "http://localhost:3000");
    const task = url.searchParams.get("task");
    const warmUp = [...url.searchParams].length === 0;
    let geminiResponse = "";

    if (!task && !warmUp) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "No parameters" }));
    }

    if(task){
        geminiResponse = await askGemini(
            `Оціни задачу по часу та поверни відповідь СТРОГО у форматі JSON, тільки одне число:
            {"time":"minutes"}
            Задача: ${task}`
        );
    }
    if(warmUp){
        geminiResponse = await askGemini(
            `Придумай просту розминку для невеликої розминки під час роботи,
            одним реченням на 1-2 хвилини,
            поверни відповідь СТРОГО у форматі JSON в наданому форматі:
            {"warmup":"warm-up"}`
        );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cleanGeminiResponse(geminiResponse)));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

module.exports = { handleGetRequest };
