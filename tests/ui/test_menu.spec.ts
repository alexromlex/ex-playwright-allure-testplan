import { test, expect } from '../fixtures/base.fixture';
import { getTestConfig } from '../config/test.config';
import * as allure from "allure-js-commons";

test.describe('test_menu', ()=>{
    const config = getTestConfig();
    test('Test menu in header', async({page})=>{
        await allure.epic("Site");
        await allure.story("User can navigate");
        await allure.label("id", "9");
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tags("release_01", "regression", "positive")
        await page.goto(config.testUrl);
        const menuLinks = await page.locator('.nav-bar-header .nav-item a').all();
        for (const link of menuLinks){
            const expectedLinkText = await link.innerText();
            const expectedUrl = await link.getAttribute('href');
            if (config.testUrl + '/' != expectedLinkText){
                await test.step(`Checking: ${expectedLinkText} -> ${expectedUrl}`, async()=> {
                    await link.click();
                    expect(page.locator('body'), 'Body is visible').toBeVisible();
                    const currentUrl = page.url();
                    expect(expectedUrl, 'Check expected url').toBe(currentUrl);
                    expect(expectedLinkText, 'Check menu class is .now')
                    .toBe(await page.locator('.nav-bar-header .nav-item a.now').innerText())
                });
            }
        }
   })
})