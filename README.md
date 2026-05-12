# Malicious Email Scorer

## Overview

Malicious Email Scorer is a Gmail Add-on that analyzes opened emails and presents a maliciousness score with a clear and explainable verdict.

The system analyzes email content, links, sender information, and attachments to identify suspicious indicators and provide recommendations to the user.

The project includes:

- A Gmail Add-on frontend built with Google Apps Script
- A Node.js backend for email analysis and scoring

This project was developed as part of the Upwind Security Bootcamp assignment.

## Features

- Analyze opened Gmail messages
- Calculate a maliciousness risk score
- Display a clear security verdict
- Analyze email content, links, sender information, and attachments
- Show threat signals and reasoning
- Provide recommendations to the user
- Frontend and backend communication through API requests

## Architecture

The system is built from two main components:

1. **Gmail Add-on Frontend**
  The user interacts with the Gmail Add-on inside Gmail.  
   When an email is opened, the add-on collects relevant email data and sends it to the backend for analysis.
2. **Node.js Backend**
  The backend receives the email data, analyzes it using rule-based logic, calculates a maliciousness score, and returns a verdict, threat signals, and recommendations.

Basic flow:

```text

User opens an email in Gmail

        ↓

Gmail Add-on collects email data

        ↓

Add-on sends request to backend

        ↓

Backend analyzes the email

        ↓

Backend returns score, verdict, signals, and recommendations

        ↓

Gmail Add-on displays the result to the user

```

## Threat Signals

The system analyzes different indicators that may increase the maliciousness score of an email, including:

- Suspicious or shortened links
- Urgent or threatening language
- Requests for passwords or sensitive information
- Suspicious sender domains
- Attachments that may be risky
- Messages that imitate trusted services or companies

Each signal increases the overall risk score and contributes to the final verdict displayed to the user.

## Tech Stack

### Frontend

- Google Apps Script
- Gmail Add-on APIs
- JavaScript

### Backend

- Node.js
- Express.js

### Deployment

- Render (backend hosting)

## Project Structure

### backend/

Node.js backend service responsible for email analysis and maliciousness scoring.

#### src/

- `server.js` — Main backend server entry point
- `routes/` — Defines API endpoints and request routing
- `controllers/` — Handles incoming requests and response logic
- `services/` — Contains the main email analysis and scoring logic
- `utils/` — Shared helper functions and utility logic
- `dto/` — Data transfer objects and request/response structures
- `config/` — Backend configuration and environment settings

### frontend/

Gmail Add-on frontend built with Google Apps Script.

- `code.gs` — Main add-on logic and Gmail integration
- `appsscript.json` — Google Apps Script configuration

## ## Setup & Run

### Backend

1. Navigate to the backend directory:

```bash

cd backend

```

1. Install dependencies:

```bash

npm install

```

1. Start the backend server:

```bash

npm start

```

The backend is hosted using Render.

### Frontend

1. Open Google Apps Script
2. Create a new Gmail Add-on project
3. Copy the contents of `frontend/code.gs`
4. Copy the contents of `frontend/appsscript.json`
5. Configure the backend API URL inside `code.gs`:

```javascript

const BACKEND_URL = "[https://upwind-bootcamp-backend.onrender.com/api/v1/analyze-email](https://upwind-bootcamp-backend.onrender.com/api/v1/analyze-email)";

```

1. Deploy the add-on and connect it to a Gmail account

## Future Improvements

- Add AI/ML-based email analysis
- Improve detection accuracy with additional threat signals
- Add real-time URL reputation checks
- Support advanced attachment scanning
- Improve verdict explanations and recommendations
- Store analysis results and historical data in a database

## ## Demo Video

Watch the full product walkthrough here:

[https://www.loom.com/share/74023f8a985e416db0b4c15203d1d80c](https://www.loom.com/share/74023f8a985e416db0b4c15203d1d80c)