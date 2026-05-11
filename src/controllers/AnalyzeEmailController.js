const { AnalyzeEmailRequest } = require("../dto/AnalyzeEmailRequest");
const { AnalyzeEmailService } = require("../services/AnalyzeEmailService");

class AnalyzeEmailController {
  constructor(service = new AnalyzeEmailService()) {
    this.service = service;
  }

  handle(payload) {
    const request = AnalyzeEmailRequest.from(payload);
    const errors = request.validate();

    if (errors.length > 0) {
      return {
        statusCode: 400,
        body: { errors }
      };
    }

    return {
      statusCode: 200,
      body: this.service.analyze(request).toJSON()
    };
  }
}

module.exports = { AnalyzeEmailController };
