const LIMITS = {
  SUBJECT_MAX_LENGTH: 300,
  BODY_MAX_LENGTH: 20000,
  LINK_MAX_LENGTH: 2048,
  ATTACHMENT_MAX_LENGTH: 255
};

const VERDICTS = {
  SAFE: "Safe",
  SUSPICIOUS: "Suspicious",
  PHISHING: "Phishing"
};

const SCORING = {
  senderFreeDomain: 20,
  senderSuspiciousDomainPattern: 20,
  subjectUrgencyKeyword: 20,
  bodyCredentialKeyword: 25,
  bodyMoneyKeyword: 15,
  bodySensitiveInfoKeyword: 25,
  linkUsesIpHost: 25,
  linkShortener: 15,
  linkNonHttps: 10,
  linkSuspiciousTld: 15,
  attachmentRiskyExtension: 20,
  excessivePunctuation: 10,
  suspiciousSignalsForEscalation: 2
};

const THRESHOLDS = {
  suspicious: 35,
  phishing: 65
};

const MESSAGES = {
  senderRequired: "sender is required",
  senderInvalidEmail: "sender must be a valid email",
  subjectRequired: "subject is required",
  subjectTooLong: `subject must be at most ${LIMITS.SUBJECT_MAX_LENGTH} characters`,
  bodyRequired: "body is required",
  bodyTooLong: `body must be at most ${LIMITS.BODY_MAX_LENGTH} characters`,
  linksMustBeArray: "links must be an array",
  linkTooLong: `each link must be at most ${LIMITS.LINK_MAX_LENGTH} characters`,
  attachmentsMustBeArray: "attachments must be an array",
  attachmentTooLong: `each attachment must be at most ${LIMITS.ATTACHMENT_MAX_LENGTH} characters`,
  recommendationSafe: "No immediate action needed.",
  recommendationSuspicious: "Verify sender identity before clicking links or opening attachments.",
  recommendationPhishing:
    "Do not click any links or open attachments. Report this message to security immediately.",
  reasonFreeDomain: "Sender domain is a common free-email provider.",
  reasonSenderDomainAnomaly: "Sender domain has suspicious patterns (punycode, many digits, or unusual separators).",
  reasonUrgentLanguage: "Subject contains urgency language often used in phishing attempts.",
  reasonCredentialRequest: "Message body contains credential-related wording.",
  reasonPaymentRequest: "Message body contains payment-related wording.",
  reasonSensitiveInfoRequest: "Message requests sensitive personal information.",
  reasonIpLink: "At least one link uses an IP address instead of a domain.",
  reasonShortenerLink: "At least one link uses a URL shortener.",
  reasonNonHttpsLink: "At least one link is not using HTTPS.",
  reasonSuspiciousLinkTld: "At least one link points to a high-risk top-level domain.",
  reasonRiskyAttachment: "At least one attachment has a high-risk extension.",
  reasonExcessivePunctuation: "Message uses excessive punctuation, a common social-engineering signal."
};

module.exports = {
  LIMITS,
  VERDICTS,
  SCORING,
  THRESHOLDS,
  MESSAGES
};
