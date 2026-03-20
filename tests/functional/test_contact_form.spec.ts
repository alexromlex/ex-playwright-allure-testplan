import { test, expect } from '../fixtures/contact.page.fixture';
import * as allure from "allure-js-commons";
import { makeFullUrl } from '../helpers/url_helper';
import { getTestConfig } from '../config/test.config';
import { maximum_values, minimal_values, out_maximum_values, out_minimal_values, random_invalid, random_values } from '../test_data/send_message_data';

test.describe('test_contact_form', () => {
    const config = getTestConfig();
    
    async function _get_scode(authHeader: Record<string, string>, request: any): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const options: any = {
                    method: "GET",
                    headers: {
                        ...authHeader,
                        'Cache-Control': 'no-cache',
                        'Accept': '*/*',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive'
                    },
                    timeout: 5000,
                    maxRedirects: 3,
                    ignoreHTTPSErrors: true
                };
                const response = await request.fetch(makeFullUrl(config.testUrl, 'get_scode'), options);
                if (response.status() !== 200) {
                    return reject(new Error(`Failed to get scode: ${response.status()}`));
                }
                const responseData = await response.json();
                
                const scode = responseData.data;
                console.log("SCODE: ", scode);
                if (scode === undefined || scode === null || scode === '') {
                    return reject(new Error(`Scode not found: ${JSON.stringify(responseData)}`));
                }
                resolve(scode);
            } catch (error) {
                reject(error);
            }
        });
    };

    [
        {"name": "Minimum values", "data": minimal_values},
        {"name": "Random valid values", "data": random_values},
        {"name": "Maximum values", "data": maximum_values}
    ].forEach(fieldData => {
        test(`test_contact_form happy_path ${fieldData.name}`, async ({pageContact, authHeader}) => {
            await allure.epic("User");
            await allure.label("id", "4");
            await allure.story("User can send message");
            await allure.tags("release_03", "positive")
            await allure.layer("integration");
            await allure.severity(allure.Severity.NORMAL);
            const scode = await _get_scode(authHeader, pageContact.page.request);
            // fieldData.data.push({name: "captha", type:"input", value: scode});
            await test.step('Fill form with valid data', async ()=>{
                expect(await pageContact.nameInput.inputValue()).toBe('');
                await pageContact.nameInput.fill(fieldData.data.find(el=>el.name === "name")!.value);
                
                expect(await pageContact.emailInput.inputValue()).toBe('');
                await pageContact.emailInput.fill(fieldData.data.find(el=>el.name === "email")!.value);
                
                expect(await pageContact.telefonInput.inputValue()).toBe('');
                await pageContact.telefonInput.fill(fieldData.data.find(el=>el.name === "telefon")!.value);
                
                await pageContact.honnanSelect.selectOption({index: fieldData.data.find(el=>el.name === "honnan")!.value});
                
                expect(await pageContact.capthaInput.inputValue()).toBe('');
                await pageContact.capthaInput.fill(String(scode));
            })
            await test.step('Submit form', async ()=>{

                pageContact.page.on('dialog', async dialog => {
                    console.log('Message:', dialog.message());
                    

                    expect(dialog.type()).toBe('alert');
                    
                    setTimeout(async () => {
                        await dialog.accept();
                        console.log('Alert closed');
                    }, 3000);
                });

                await pageContact.sendButton.click();

                await pageContact.page.waitForTimeout(4000);
                const successMessage = pageContact.page.locator("#send_email_success");
                await expect(successMessage).toBeVisible({timeout: 5000});
            })
        });
    });

    test('test_contact_form send empty', async ({pageContact}) => {
        await allure.epic("User");
        await allure.label("id", "7");
        await allure.tags("release_03", "negative")
        await allure.layer("integration");
        await allure.severity(allure.Severity.NORMAL);
    
        await pageContact.sendButton.click();
        const dialog = await pageContact.page.waitForEvent('dialog');
        expect(dialog.type()).toBe('alert');
        const alertMessage = await dialog.message()
        console.log('alertMessage: ', alertMessage);
        expect(alertMessage).toBeTruthy();
        await dialog.accept();
        expect(pageContact.page.locator("#send_email_success")).not.toBeAttached({timeout: 3000});
    });

    [   
        {"d_name": "Out of minimum values", "data": out_minimal_values},
        {"d_name": "Random invalid values", "data": random_invalid},
        {"d_name": "Out of maximum values", "data": out_maximum_values},
    ].forEach(fieldData => {
        test(`test_contact_form ${fieldData.d_name}`, async({pageContact})=>{
            await allure.epic("User");
            await allure.label("id", "8");
            await allure.tags("release_03", "negative");
            await allure.layer("integration");
            await allure.severity(allure.Severity.NORMAL);

            await test.step('Fill form with invalid data', async ()=>{
                await pageContact.nameInput.fill(fieldData.data.find(el=>el.name === "name")!.value);
                await pageContact.emailInput.fill(fieldData.data.find(el=>el.name === "email")!.value);
                await pageContact.telefonInput.fill(fieldData.data.find(el=>el.name === "telefon")!.value);
                //await pageContact.honnanSelect.selectOption({index: fieldData.data.find(el=>el.name === "honnan")!.value});
                await pageContact.capthaInput.fill('');
            })

            await pageContact.sendButton.click();
            
            await test.step('Check alert message', async ()=>{
                const dialog = await pageContact.page.waitForEvent('dialog');
                expect(dialog.type()).toBe('alert');
                const alertMessage = await dialog.message()
                console.log('alertMessage: ', alertMessage);
                expect(alertMessage).toBeTruthy();
                await dialog.accept();
            });

            await test.step('Check that success message is not visible', async ()=>{
                expect(pageContact.page.locator("#send_email_success")).not.toBeAttached({timeout: 3000});
            });

            await Promise.all([
                pageContact.emailInput, 
                pageContact.telefonInput, 
                pageContact.honnanSelect, 
                pageContact.capthaInput
            ].map(async(field)=>{
                const fieldName = await field.getAttribute('name');
                 await test.step(`Check validation errors ${fieldName}`, async ()=>{
                    await expect.soft(field).toHaveClass(/invalid-field/);
                });
            }))
            
        })
    })

})