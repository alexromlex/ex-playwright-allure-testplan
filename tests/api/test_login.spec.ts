import { test, expect } from '../fixtures/base.fixture';
import * as allure from "allure-js-commons";
import { makeFullUrl } from '../helpers/url_helper';
import { getTestConfig } from '../config/test.config';
import { getInvalidLoginData, getValidLoginData } from '../test_data/login_data';

test.describe('test_login', () => {
    const config = getTestConfig();
    const options = {
        method: "POST",
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
    const loginUrl = makeFullUrl(config.testUrl, 'login');
    
    test('test_login_success', async ({ request }) => {
        await allure.epic("API");
        await allure.label("id", "16");
        await allure.story("User can login");
        await allure.tags("release_01", "positive")
        await allure.severity(allure.Severity.NORMAL);

        const reqOptions = {...options, form: getValidLoginData()};
        const response = await request.fetch(loginUrl, reqOptions);
        const responseBody = await response.text();
                
        try {
            expect(response.status(), 'Check for status 200').toBe(200);
        } catch (error) {
            await test.info().attach('response_body', {body: responseBody, contentType: 'text/plain'});
            throw error;
        }
        
        const responseData = JSON.parse(responseBody);
        expect(responseData.token, 'Check for token').toBeTruthy();
    });

    getInvalidLoginData().forEach((data, index) => {
        test(`test_login_invalid_credentials_${index}`, async ({ request }) => {
            await allure.epic("API");
            await allure.label("id", "17");
            await allure.tags("release_01", "negative")
            await allure.severity(allure.Severity.NORMAL);
            const reqOptions = {...options, form: data};

            const response = await request.fetch(loginUrl, reqOptions);
            expect(response.status(), 'Check for status code 401').toBe(401);
        });
    });
})