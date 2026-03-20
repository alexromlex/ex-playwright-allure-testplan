import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import * as os from "node:os";

dotenv.config();

export default defineConfig({
    testDir: './tests',
    timeout: parseInt(process.env.PAGE_LOAD_TIMEOUT || '30000'),
    fullyParallel: true,
    workers: '50%',
    // workers: 1,
    
    use: {
        ignoreHTTPSErrors: true,
        viewport: {
            width: parseInt(process.env.BROWSER_WIDTH || '1920'),
            height: parseInt(process.env.BROWSER_HEIGHT || '1080')
        },
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        video: 'off',
    },
    
    projects: [
        {
            name: 'chrome',
            use: { 
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: [
                        '--no-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-gpu',
                        '--disable-extensions',
                        '--disable-setuid-sandbox',
                        '--ignore-certificate-errors'
                    ]
                }
            },
        },
        {
            name: 'firefox',
            use: { 
              ...devices['Desktop Firefox']
            },
          },
    ],
    
    reporter: [
        ['json', {  outputFile: 'test-results.json' }],
        ["allure-playwright", {
            resultsDir: "allure-results",
            detail: false,
            suiteTitle: false,
            links: {},
            categories:[],
            globalLabels: [],
            environmentInfo: {
                os_platform: os.platform(),
                os_release: os.release(),
                node_version: process.version,
            }
            },
        ],
    ],
});