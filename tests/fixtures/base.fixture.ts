import { test as base, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';


export const test = base.extend<{browserLabel:string}>({
  browserLabel: [async ({}, use, testInfo) => {
    await allure.label('Browser', testInfo.project.name);
    await use();
  }, { auto: true }]
});

export { expect };