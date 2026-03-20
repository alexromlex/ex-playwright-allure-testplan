import { test, expect } from '../fixtures/base.fixture';
import { valid_urls_data } from '../test_data/urls_data';
import { makeFullUrl } from '../helpers/url_helper';
import { getTestConfig } from '../config/test.config';
import * as allure from "allure-js-commons";

test.describe('TestUrlAvailable', () => {
    // allure.allureId("13");
    const config = getTestConfig();
    valid_urls_data.forEach((urls)=>{
        test(`Checking ${urls.page} (${urls.url})`, async ({ request }) => {
            await allure.epic("API");
            await allure.label("id", "13");
            await allure.tags("smoke", "regression", "positive");
            await allure.severity(allure.Severity.BLOCKER);
            const fullUrl = makeFullUrl(config.testUrl, urls.page);
            for (const method of urls.method) {
                await test.step(`Page: ${urls.page} method: ${method}`, async () => {                    
                    try {
                        const options: any = {
                            method: method,
                            timeout: 5000,
                            maxRedirects: 3,
                            ignoreHTTPSErrors: true
                        };
                        const response = await request.fetch(fullUrl, options);
                        const status = response.status();
                        console.log(`status_code: ${status}`);
                        const allowedStatuses = [200, 201, 202, 204, 401, 405];
                        expect(allowedStatuses, `Response status code: ${status}`).toContain(status);
                    } catch (error: any) {
                        test.fail(true, `ERROR ${fullUrl}: ${error.message}`);
                    }
                });
            }
        });
    });
});