const { AnalyzeEmailResponse } = require("../dto/AnalyzeEmailResponse");
const { MESSAGES, VERDICTS, SCORING, THRESHOLDS } = require("../config/constants");

const FREE_EMAIL_DOMAINS = new Set(["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"]);
const URL_SHORTENER_DOMAINS = new Set(["bit.ly", "tinyurl.com", "t.co", "rb.gy"]);
const SUSPICIOUS_LINK_TLDS = [".zip", ".top", ".click", ".country", ".gq", ".work"];
const URGENT_KEYWORDS = ["urgent", "immediately", "asap", "final notice", "verify now"];
const CREDENTIAL_KEYWORDS = ["password", "credential", "login", "2fa", "verification code"];
const PAYMENT_KEYWORDS = ["bank transfer", "wire", "invoice", "payment", "gift card"];
const SENSITIVE_INFO_KEYWORDS = ["ssn", "social security", "passport", "credit card", "cvv"];
const RISKY_ATTACHMENT_EXTENSIONS = [".exe", ".js", ".vbs", ".scr", ".bat", ".cmd", ".zip"];

function senderDomain(sender) {
  const atIndex = sender.indexOf("@");
  return atIndex > -1 ? sender.slice(atIndex + 1).toLowerCase() : "";
}

function includesAnyKeyword(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

function hostnameOf(link) {
  try {
    return new URL(link).hostname.toLowerCase();
  } catch (_error) {
    return "";
  }
}

function isIpHost(hostname) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

function isSuspiciousSenderDomain(domain) {
  if (!domain) {
    return false;
  }
  const digitCount = (domain.match(/\d/g) || []).length;
  const hyphenCount = (domain.match(/-/g) || []).length;
  return domain.startsWith("xn--") || digitCount >= 4 || hyphenCount >= 3;
}

function isSuspiciousTld(hostname) {
  return SUSPICIOUS_LINK_TLDS.some((tld) => hostname.endsWith(tld));
}

function hasExcessivePunctuation(text) {
  return /[!?]{3,}/.test(text) || /([!?]\s*){5,}/.test(text);
}

class AnalyzeEmailService {
  analyze(request) {
    let score = 0;
    const reasons = [];
    let suspiciousSignals = 0;

    const domain = senderDomain(request.sender);
    if (FREE_EMAIL_DOMAINS.has(domain)) {
      score += SCORING.senderFreeDomain;
      reasons.push(MESSAGES.reasonFreeDomain);
      suspiciousSignals += 1;
    }

    if (isSuspiciousSenderDomain(domain)) {
      score += SCORING.senderSuspiciousDomainPattern;
      reasons.push(MESSAGES.reasonSenderDomainAnomaly);
      suspiciousSignals += 1;
    }

    if (includesAnyKeyword(request.subject, URGENT_KEYWORDS)) {
      score += SCORING.subjectUrgencyKeyword;
      reasons.push(MESSAGES.reasonUrgentLanguage);
      suspiciousSignals += 1;
    }

    if (includesAnyKeyword(request.body, CREDENTIAL_KEYWORDS)) {
      score += SCORING.bodyCredentialKeyword;
      reasons.push(MESSAGES.reasonCredentialRequest);
      suspiciousSignals += 1;
    }

    if (includesAnyKeyword(request.body, PAYMENT_KEYWORDS)) {
      score += SCORING.bodyMoneyKeyword;
      reasons.push(MESSAGES.reasonPaymentRequest);
      suspiciousSignals += 1;
    }

    if (includesAnyKeyword(request.body, SENSITIVE_INFO_KEYWORDS)) {
      score += SCORING.bodySensitiveInfoKeyword;
      reasons.push(MESSAGES.reasonSensitiveInfoRequest);
      suspiciousSignals += 1;
    }

    const hasIpLink = request.links.some((link) => isIpHost(hostnameOf(link)));
    if (hasIpLink) {
      score += SCORING.linkUsesIpHost;
      reasons.push(MESSAGES.reasonIpLink);
      suspiciousSignals += 1;
    }

    const hasShortenerLink = request.links.some((link) => {
      const host = hostnameOf(link);
      return URL_SHORTENER_DOMAINS.has(host);
    });
    if (hasShortenerLink) {
      score += SCORING.linkShortener;
      reasons.push(MESSAGES.reasonShortenerLink);
      suspiciousSignals += 1;
    }

    const hasNonHttpsLink = request.links.some((link) => {
      try {
        return new URL(link).protocol !== "https:";
      } catch (_error) {
        return false;
      }
    });
    if (hasNonHttpsLink) {
      score += SCORING.linkNonHttps;
      reasons.push(MESSAGES.reasonNonHttpsLink);
      suspiciousSignals += 1;
    }

    const hasSuspiciousLinkTld = request.links.some((link) => isSuspiciousTld(hostnameOf(link)));
    if (hasSuspiciousLinkTld) {
      score += SCORING.linkSuspiciousTld;
      reasons.push(MESSAGES.reasonSuspiciousLinkTld);
      suspiciousSignals += 1;
    }

    const hasRiskyAttachment = request.attachments.some((name) => {
      const lower = name.toLowerCase();
      return RISKY_ATTACHMENT_EXTENSIONS.some((ext) => lower.endsWith(ext));
    });
    if (hasRiskyAttachment) {
      score += SCORING.attachmentRiskyExtension;
      reasons.push(MESSAGES.reasonRiskyAttachment);
      suspiciousSignals += 1;
    }

    if (hasExcessivePunctuation(request.subject) || hasExcessivePunctuation(request.body)) {
      score += SCORING.excessivePunctuation;
      reasons.push(MESSAGES.reasonExcessivePunctuation);
      suspiciousSignals += 1;
    }

    if (suspiciousSignals >= SCORING.suspiciousSignalsForEscalation) {
      score += 10;
    }

    score = Math.min(score, 100);

    let verdict = VERDICTS.SAFE;
    let recommendation = MESSAGES.recommendationSafe;
    if (score >= THRESHOLDS.phishing) {
      verdict = VERDICTS.PHISHING;
      recommendation = MESSAGES.recommendationPhishing;
    } else if (score >= THRESHOLDS.suspicious) {
      verdict = VERDICTS.SUSPICIOUS;
      recommendation = MESSAGES.recommendationSuspicious;
    }

    if (reasons.length === 0) {
      reasons.push("No high-risk phishing signals were detected by current rules.");
    }

    return new AnalyzeEmailResponse({
      score,
      verdict,
      reasons,
      recommendation
    });
  }
}

module.exports = { AnalyzeEmailService };
