import { login } from "./scenarios/login.js";
import { createPost } from "./scenarios/createPost.js";
import { createStory } from "./scenarios/createStory.js";
import { scrollFeed } from "./scenarios/scrollFeed.js";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
  vus: 100,
  duration: "1m",
};

const csvFile = open("./data/accounts.csv");
const emails = csvFile
  .split("\n")
  .slice(1)
  .map((e) => e.trim())
  .filter(Boolean);

export default function () {
  const email = emails[__VU % emails.length]; // rotate emails
  const token = login(email);

  const r = Math.random();

  if (r < 0.5) {
    scrollFeed(token);
  } else if (r < 0.8) {
    createPost(token);
  } else {
    createStory(token);
  }

  sleep(1);
}

export function handleSummary(data) {
  // Get the BASE_URL used during the test
  const baseUrl = __ENV.BASE_URL || 'https://api-dev.alemx.com';

  // Determine environment based on BASE_URL
  let environment = 'PRODUCTION';
  const urlLower = baseUrl.toLowerCase();
  if (urlLower.includes('dev')) {
    environment = 'DEV';
  } else if (urlLower.includes('stage') || urlLower.includes('staging')) {
    environment = 'STAGING';
  }

  // Format date as "September 3, 2025 09:39:14"
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const formattedDate = now.toLocaleDateString('en-US', options);

  // Create a custom HTML report with BASE_URL information
  const customHtmlReport = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>K6 Stress Test Report - ${formattedDate}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .config { background: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .config h3 { margin-top: 0; color: #2c5aa0; }
        .env-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .env-dev { background: #d4edda; color: #155724; }
        .env-staging { background: #fff3cd; color: #856404; }
        .env-production { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="header">
        <h1>K6 Stress Test Report</h1>
        <p><strong>Generated:</strong> ${formattedDate}</p>
    </div>

    <div class="config">
        <h3>Test Configuration</h3>
        <p><strong>Base URL:</strong> ${baseUrl}</p>
        <p><strong>Environment:</strong> <span class="env-badge env-${environment.toLowerCase()}">${environment}</span></p>
    </div>

    ${htmlReport(data).replace('<html>', '').replace('</html>', '').replace('<head>', '').replace('</head>', '').replace('<body>', '').replace('</body>', '')}
</body>
</html>`;

  return {
    "summary.html": customHtmlReport,
  };
}