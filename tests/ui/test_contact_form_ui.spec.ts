import {expect, test} from '../fixtures/contact.page.fixture';
import * as allure from "allure-js-commons";
import {required_inputs} from "../test_data/send_message_data"

test.describe('test_ui_form_test', () => {
    required_inputs.forEach((field) => {
        test(`UI form test: ${field.type} ${field.name}`, async ({pageContact}) => {
            await allure.epic("User");
            await allure.label("id", "1");
            await allure.story("User can send message");
            await allure.tags("release_03", "ui", "positive")
            await allure.severity(allure.Severity.NORMAL);
            const foundedField = pageContact._getField(field.name);
            expect(foundedField, `Find field ${field.name}`).toBeTruthy();
            if ("props" in field) await pageContact._checkFieldProprs(foundedField, field.props!);
        });
    })
})