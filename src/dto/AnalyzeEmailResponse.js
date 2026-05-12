class AnalyzeEmailResponse {
  constructor({ score, verdict, reasons, recommendation }) {
    this.score = score;
    this.verdict = verdict;
    this.reasons = reasons;
    this.recommendation = recommendation;
  }

  static safe() {
    return new AnalyzeEmailResponse({
      score: 0,
      verdict: "Safe",
      reasons: ["No suspicious phishing signals were detected."],
      recommendation: "No immediate action needed."
    });
  }

  toJSON() {
    return {
      score: this.score,
      verdict: this.verdict,
      reasons: this.reasons,
      recommendation: this.recommendation
    };
  }
}

module.exports = { AnalyzeEmailResponse };
