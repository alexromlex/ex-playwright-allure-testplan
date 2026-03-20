import { Page, Locator, expect, test } from '@playwright/test';
import {required_inputs} from "../test_data/send_message_data"
export class PageContact{
    
    readonly page: Page;
    readonly _form: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly telefonInput: Locator;
    readonly honnanSelect: Locator;
    readonly capthaInput: Locator;
    readonly sendButton: Locator;

    constructor(readonly page: Page){
        this.page = page
        this._form = page.locator('form#arajanlat');
        this.nameInput = this._getField("name");
        this.emailInput = this._getField("email");
        this.telefonInput = this._getField("telefon");
        this.honnanSelect = this._getField("honnan");
        this.capthaInput = this._getField("captcha");
        this.sendButton = this._form.locator("xpath=.//input[@id='sendbutton']");
    }

    _getField(fieldName: string){
        const fieldData = required_inputs.find(el=>el.name === fieldName);
        if(!fieldData) test.fail();
        const condition = Object.entries(fieldData!.find_by)
        .map(([attr, value]) => `contains(@${attr}, '${value}')`)
        .join(' and ');
        return this._form.locator(`xpath=.//*[${condition}]`)
    }
        
    async _checkFieldProprs(field: Locator, props: Record<string, string | number | boolean>){
        const errors: string[] = [];
        for (const [prop, expected_val] of Object.entries(props)) {
            await test.step(`Checking ${prop} == ${expected_val}`, async () => {
                try {
                    const actual_val = await field.getAttribute(prop);
                    if (typeof expected_val === "boolean") {
                        // required, readonly, disabled
                        if (expected_val) {
                            expect.soft(actual_val).not.toBeNull();
                        } else {
                            expect.soft(actual_val).toBeNull();
                        }
                    } else if (typeof expected_val === "number") {
                        // maxlength, minlength
                        expect.soft(actual_val).not.toBeNull();
                        expect.soft(parseInt(actual_val!)).toBe(expected_val);
                    }
                    else{
                        // type, placeholder, pattern
                        expect.soft(actual_val).toBe(expected_val);
                    }
                } catch (e) {
                    errors.push(`Checking '${prop}': ${String(e)}`);
                }
            });
        }
        if (errors.length > 0) {
            const error_msg = errors.join("\n");
            console.log(`Field property check failed:\n${error_msg}`);
            test.fail(true, `ERRORS: ${error_msg}`);
        }
    }
}   