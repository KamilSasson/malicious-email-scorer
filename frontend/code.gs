const BACKEND_URL = "https://upwind-bootcamp-backend.onrender.com/api/v1/analyze-email";

function onGmailMessageOpen(e) {
  return buildAddOn(e);
}

function buildAddOn(e) {
  try {
    const accessToken = e.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    const messageId = e.gmail.messageId;
    const message = GmailApp.getMessageById(messageId);

    const subject = message.getSubject();

    const rawSender = message.getFrom();
    const senderMatch = rawSender.match(/<(.+?)>/);
    const sender = senderMatch ? senderMatch[1] : rawSender;

    const body = message.getPlainBody();

    const payload = {
      sender: sender,
      subject: subject,
      body: body,
      links: [],
      attachments: []
    };

    const response = UrlFetchApp.fetch(BACKEND_URL, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (statusCode < 200 || statusCode >= 300) {
      return buildErrorCard(
        "Backend request failed",
        "Status code: " + statusCode + "<br><br>" + responseText
      );
    }

    const result = JSON.parse(responseText);
    return buildResultCard(result);

  } catch (error) {
    return buildErrorCard("Runtime error", error.toString());
  }
}

function buildResultCard(result) {
  const verdict = normalizeVerdict(result.verdict);
  const score = result.score !== undefined ? result.score : "N/A";

  const reasons = result.reasons && result.reasons.length
    ? result.reasons
    : ["No specific reasons returned"];

  const recommendation =
    result.recommendation ||
    "Review this email carefully before interacting with links or attachments.";

  const verdictColor = getVerdictColor(verdict);

  const card = CardService.newCardBuilder();

  const summarySection = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph().setText(
        '<font color="' + verdictColor + '">' +
          '<b><font size="+3">' + verdict + '</font></b>' +
        '</font>' +
        '<br><br>' +
        '<hr>' +
        '<br>' +
        '<b><font size="+1">Risk Score</font></b>' +
        '<br>' +
        score + '/100'
      )
    );

  const reasonsText = reasons
    .map(function(reason) {
      return "• " + reason;
    })
    .join("<br>");

  const reasonsSection = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText(
          '<b><font size="+1">Threat Signals</font></b>' +
          '<br><br>' +
          reasonsText
        )
    );

  const recommendationSection = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText(
          '<b><font size="+1">Recommendation</font></b>' +
          '<br><br>' +
          recommendation
        )
    );

  card.addSection(summarySection);
  card.addSection(reasonsSection);
  card.addSection(recommendationSection);

  return [card.build()];
}

function buildErrorCard(title, message) {
  const card = CardService.newCardBuilder()
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newTextParagraph()
            .setText(
              '<b>' + title + '</b>' +
              '<br><br>' +
              message
            )
        )
    );

  return [card.build()];
}

function normalizeVerdict(verdict) {
  if (!verdict) {
    return "UNKNOWN";
  }

  const normalized = verdict.toString().toUpperCase();

  if (normalized === "SAFE") {
    return "SAFE";
  }

  if (normalized === "SUSPICIOUS") {
    return "SUSPICIOUS";
  }

  if (normalized === "MALICIOUS" || normalized === "PHISHING") {
    return "MALICIOUS";
  }

  return normalized;
}

function getVerdictColor(verdict) {
  if (verdict === "SAFE") {
    return "#1B873F";
  }

  if (verdict === "SUSPICIOUS") {
    return "#D4A017";
  }

  if (verdict === "MALICIOUS") {
    return "#C62828";
  }

  return "#666666";
}