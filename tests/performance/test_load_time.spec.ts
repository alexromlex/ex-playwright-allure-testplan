import { test, expect } from '../fixtures/base.fixture';
import { valid_urls_data } from '../test_data/urls_data';
import { makeFullUrl } from '../helpers/url_helper';
import { getTestConfig } from '../config/test.config';
import * as allure from "allure-js-commons";

test.describe('test_response_time', () => {
    const config = getTestConfig();
    valid_urls_data.forEach((urlData) => {
        const fullUrl = makeFullUrl(config.testUrl, urlData.page);
        test(`Checking url: ${fullUrl}`, async ({page}) => {
            await allure.epic("Site");
            await allure.label("id", "23");
            await allure.story("Page loading performance");
            await allure.tags("positive");
            await allure.severity(allure.Severity.MINOR);
            await allure.description('Verify lang property exists on page')
            const startTime = performance.now();
            await test.step('Navigate to page', async()=>{
                await page.goto(fullUrl);
                }); 
            await test.step("Get page body", async()=>{
                await expect(page.locator('body')).toBeVisible();
            });
            const loadTime = (performance.now() - startTime) / 1000;
            console.log('Page load time: ', loadTime.toFixed(2));
            await test.step('Check load time', async()=>{
                await expect(loadTime, `Expected < 10 sec, got: ${loadTime.toFixed(2)} sec`).toBeLessThan(10);
            })
        });
    })
})
    