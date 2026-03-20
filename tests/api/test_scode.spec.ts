import { test, expect } from '../fixtures/contact.page.fixture';
import * as allure from "allure-js-commons";
import { makeFullUrl } from '../helpers/url_helper';
import { getTestConfig } from '../config/test.config';

test.describe('test_scode', () => {
    const config = getTestConfig();
    const options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        },
        timeout: 5000,
        maxRedirects: 3,
        ignoreHTTPSErrors: true,
    };
    const scodeUrl = makeFullUrl(config.testUrl, 'get_scode');
    const scodeImageUrl = `${config.testUrl}/function/scode.php`;
    
    test('test_scode_image', {
        tag: ['@release_01', '@positive'],
    }, async ({ request, authHeader }) => {
        await allure.epic("API");
        await allure.label("id", "18");
        await allure.story("User can get scode");
        await allure.layer("integration");
        await allure.severity(allure.Severity.CRITICAL);
        const reqOptions = {...options};
        let sessionID: string | undefined;

        await test.step('Request scode image', async () => {
            const imageResponse = await request.get(scodeImageUrl);
            expect(imageResponse).not.toBeNull();
            const setCookieHeader = imageResponse.headersArray()
                .find(h => h.name.toLowerCase() === 'set-cookie')?.value;
            sessionID = setCookieHeader?.split('PHPSESSID=')[1]?.split(';')[0];
            expect(sessionID, 'Check session ID is present').toBeTruthy();
            const contentType = imageResponse!.headers()['content-type'] || '';
            expect(contentType, 'Check content type is image/png').toContain('image/png');
            const imageBuffer = await imageResponse!.body();
            await test.info().attach('captcha-image', {
                body: imageBuffer,
                contentType
            });
        });

        await test.step('Request scode', async () => {
            const requestHeaders = {
                ...reqOptions.headers,
                ...authHeader,
                Cookie: `PHPSESSID=${sessionID || ''}`
            };
            const response = await request.get(scodeUrl, {...reqOptions, headers: requestHeaders});
            expect(response.status()).toBe(200);
            const responseData = await response.json();
            expect(responseData, 'Check response has data').toHaveProperty('data');
            expect(responseData.data, 'Check scode is present').toBeTruthy();
            await test.info().attach('scode', {
                body: `Scode: ${responseData.data}`,
                contentType: 'text/plain'
            });
        });
    });
});