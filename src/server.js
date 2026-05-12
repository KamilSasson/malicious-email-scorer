const http = require("node:http");
const { handleAnalyzeEmailRoute } = require("./routes/analyzeEmailRoutes");
const logger = require("./utils/logger");

const PORT = Number(process.env.PORT || 8080);

const server = http.createServer((req, res) => {
  const handled = handleAnalyzeEmailRoute(req, res);
  if (!handled) {
    logger.warn("Route not found", { method: req.method, url: req.url });
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  logger.info("MaliciousEmailScorer started", { port: PORT, url: `http://localhost:${PORT}` });
});
