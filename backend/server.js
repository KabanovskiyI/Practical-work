const http = require("http");
const { handleGetRequest } = require("./routes");

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    return handleGetRequest(req, res);
  } else {
    res.writeHead(405, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }
});

server.listen(3000, () => {
  console.log("Run server on http://localhost:3000");
});