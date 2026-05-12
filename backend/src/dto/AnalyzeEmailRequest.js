const { LIMITS, MESSAGES } = require("../config/constants");

class AnalyzeEmailRequest {
  constructor({ sender, subject, body, links = [], attachments = [] }) {
    this.sender = sender;
    this.subject = subject;
    this.body = body;
    this.links = links;
    this.attachments = attachments;
  }

  static isValidEmail(value) {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  static from(payload) {
    const source = payload && typeof payload === "object" ? payload : {};
    return new AnalyzeEmailRequest({
      sender: source.sender,
      subject: source.subject,
      body: source.body,
      links: source.links ?? [],
      attachments: source.attachments ?? []
    });
  }

  validate() {
    const errors = [];

    if (typeof this.sender !== "string" || this.sender.trim() === "") {
      errors.push(MESSAGES.senderRequired);
    } else if (!AnalyzeEmailRequest.isValidEmail(this.sender)) {
      errors.push(MESSAGES.senderInvalidEmail);
    }

    if (typeof this.subject !== "string" || this.subject.trim() === "") {
      errors.push(MESSAGES.subjectRequired);
    } else if (this.subject.length > LIMITS.SUBJECT_MAX_LENGTH) {
      errors.push(MESSAGES.subjectTooLong);
    }

    if (typeof this.body !== "string" || this.body.trim() === "") {
      errors.push(MESSAGES.bodyRequired);
    } else if (this.body.length > LIMITS.BODY_MAX_LENGTH) {
      errors.push(MESSAGES.bodyTooLong);
    }

    if (!Array.isArray(this.links)) {
      errors.push(MESSAGES.linksMustBeArray);
    } else if (
      this.links.some((link) => typeof link !== "string" || link.length > LIMITS.LINK_MAX_LENGTH)
    ) {
      errors.push(MESSAGES.linkTooLong);
    }

    if (!Array.isArray(this.attachments)) {
      errors.push(MESSAGES.attachmentsMustBeArray);
    } else if (
      this.attachments.some(
        (attachment) =>
          typeof attachment !== "string" || attachment.length > LIMITS.ATTACHMENT_MAX_LENGTH
      )
    ) {
      errors.push(MESSAGES.attachmentTooLong);
    }

    return errors;
  }
}

module.exports = { AnalyzeEmailRequest };
