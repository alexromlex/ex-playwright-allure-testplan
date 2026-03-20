import { test, expect } from '../fixtures/contact.page.fixture';
import * as allure from "allure-js-commons";
import { makeFullUrl } from '../helpers/url_helper';
import { getTestConfig } from '../config/test.config';

test.describe('test_get_partners', () => {
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
    const loginUrl = makeFullUrl(config.testUrl, 'get_partners');
    
    test('test_get_partners_success', async ({ request, authHeader }) => {
        await allure.epic("API");
        await allure.label("id", "14");
        await allure.story("User can get partners");
        await allure.tags("release_01", "positive")
        await allure.severity(allure.Severity.NORMAL);
        
        const reqOptions = {...options, headers: {...options.headers, ...authHeader}};
        const responseJSON = await test.step('Send request to get a partners', async () => {
             const resp = await request.get(loginUrl, reqOptions);
            expect(resp.status(), 'Expected 200 OK').toBe(200);
            return await resp.json();
        });
        await test.step('Check partners in response', async () => {
            expect(responseJSON).toHaveProperty('data');
            expect(Array.isArray(responseJSON.data)).toBe(true);
            expect(responseJSON.data.length).toBeGreaterThan(0);
        });
        console.log(`Got ${responseJSON.data.length} partners`);
    });

    test('test_get_partners_unauthorized', async ({ request }) => {
        await allure.epic("API");
        await allure.label("id", "15");
        await allure.story("User can get partners");
        await allure.tags("release_01", "negative")
        await allure.layer("integration");
        await allure.severity(allure.Severity.NORMAL);
        
        await test.step('Send request to get a partners without auth', async () => {
             const resp = await request.get(loginUrl, options);
            expect(resp.status(), 'Expected 401 Unauthorized').toBe(401);
        });
        await test.step('Send request to get a partners with fake token', async () => {
             const fakeAuthHeader = { 'Authorization': 'Token fake_token' };
             const reqOptions = {...options, headers: {...options.headers, ...fakeAuthHeader}};
             const resp = await request.get(loginUrl, reqOptions);
            expect(resp.status(), 'Expected 401 Unauthorized').toBe(401);
        });
    });
})