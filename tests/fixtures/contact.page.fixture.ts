import { test as base, expect } from './base.fixture';
import { PageContact } from '../pages/page_contact';
import {getTestConfig} from "../config/test.config";
import { makeFullUrl } from '../helpers/url_helper';
import { getValidLoginData } from '../test_data/login_data';


export const test = base.extend<{pageContact: PageContact; authHeader: Record<string, string>}>({
  pageContact: async ({ page }, use) => {
    const config = getTestConfig();
    await page.goto(makeFullUrl(config.testUrl, 'contact'));
    const pageContact = new PageContact(page);
    await use(pageContact);
  },
  authHeader: async ({ request }, use) => {
    const config = getTestConfig();
    const options: any = {
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        timeout: 5000,
        maxRedirects: 3,
        ignoreHTTPSErrors: true,
        form: getValidLoginData()
    };
    const token: string = await test.step('Authorise for get token', async () => {
        const response = await request.post(makeFullUrl(config.testUrl, 'login'), options);
        if (response.status() !== 200) {
            throw new Error(`Login failed with code: ${response.status()}`);
        }
        const responseData = await response.json();
        if (!responseData.token) {
            throw new Error(`Token not found! Response:${JSON.stringify(responseData)}`);
        }
        return responseData.token;
    });
    await use({'Authorization': `Token ${token}`})
  }
});

export { expect } from '@playwright/test';