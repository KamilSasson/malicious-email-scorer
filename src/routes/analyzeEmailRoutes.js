const crypto = require("node:crypto");
const { AnalyzeEmailController } = require("../controllers/AnalyzeEmailController");
const logger = require("../utils/logger");

const analyzeEmailController = new AnalyzeEmailController();

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req, onSuccess, onError) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      onSuccess(body ? JSON.parse(body) : {});
    } catch (parseError) {
      onError(parseError);
    }
  });
}

function handleAnalyzeEmailRoute(req, res) {
  if (req.method !== "POST" || req.url !== "/api/v1/analyze-email") {
    return false;
  }

  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  const startedAt = Date.now();
  logger.info("Analyze email request started", {
    requestId,
    method: req.method,
    url: req.url
  });

  res.on("finish", () => {
    logger.info("Analyze email request completed", {
      requestId,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt
    });
  });

  readJsonBody(
    req,
    (payload) => {
      const result = analyzeEmailController.handle(payload);
      if (result.statusCode >= 400) {
        logger.warn("Analyze email validation failed", {
          requestId,
          errorsCount: Array.isArray(result.body.errors) ? result.body.errors.length : 0
        });
      } else {
        logger.info("Analyze email completed", {
          requestId,
          verdict: result.body.verdict,
          score: result.body.score,
          reasonsCount: Array.isArray(result.body.reasons) ? result.body.reasons.length : 0
        });
      }
      sendJson(res, result.statusCode, result.body);
    },
    (parseError) => {
      logger.warn("Analyze email invalid JSON payload", {
        requestId,
        error: parseError.message
      });
      sendJson(res, 400, { errors: ["request body must be valid JSON"] });
    }
  );

  return true;
}

module.exports = { handleAnalyzeEmailRoute };
