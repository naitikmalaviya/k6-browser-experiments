# K6 Browser Experiments

A collection of scripts for testing web pages with k6 and its browser module.

## Setup

1. Copy the environment example file to create your own environment file:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file to set your target URL:
   ```
   TARGET_URL=https://yourwebsite.com
   ```

## Running tests

Run the page load test with:

```bash
npm run test
```

Or provide the URL directly:

```bash
k6 run -e TARGET_URL=https://example.com page-load-test.js
```

## Project Structure

- `page-load-test.js`: Main test script for page load testing
- `.env`: Local environment variables (not checked into git)
- `screenshots/`: Directory where screenshots are saved during tests
