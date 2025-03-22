import { browser } from 'k6/browser';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  scenarios: {
    browser: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '50s', target: 20 },  // Ramp up to 50 VUs over 20 seconds
        { duration: '1m', target: 0 },   // Ramp down to 0 VUs over 60 seconds
      ],
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    'browser_web_vital_lcp': ['p(90)<5000'],
    'browser_web_vital_inp': ['p(90)<100'],
    'browser_web_vital_cls': ['p(90)<0.25'],
    'http_req_duration': ['p(90)<3000'],
  },
};

export default async function() {
  let context, page;

  
  try {
    // Create a new browser context and page
    context = await browser.newContext(
      {
        viewport: { width: 1920, height: 1080 }
      }
    );
    page = await context.newPage();

    // Note: When running k6, you can set this via:
    // k6 run -e TARGET_URL=https://yoursite.com page-load-test.js
    const targetUrl = __ENV.TARGET_URL || "https://example.com"; // Default URL as fallback
    
    // Add timeout to ensure the page load doesn't hang
    const response = await page.goto(targetUrl, { 
      waitUntil: 'networkidle',
      timeout: 300000
    });
    
    // Check if the page loaded successfully
    check(response, {
      'status is 200': (r) => r.status() === 200,
    });

    try {
      await page.screenshot({ path: `screenshots/screenshot_${Date.now()}.png` });
    } catch (e) {
      console.error(`Screenshot error: ${e.message}`);
    }

    // Simple interaction to ensure page is responsive
    await page.evaluate(() => {
      window.scrollTo(0, 100);
    });

    sleep(1);
    
  } catch (error) {
    console.error(`Test execution error: ${error.message}`);
  } finally {
    if (page) {
      await page.close();
    }
    if (context) {
      await context.close();
    }
  }
}
