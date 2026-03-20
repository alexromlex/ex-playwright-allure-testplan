export interface TestConfig {
    testUrl: string;
    browserWidth: number;
    browserHeight: number;
    headless: boolean;
}

export function getTestConfig(): TestConfig {
    return {
        testUrl: process.env.TEST_URL || 'https://www.romlex.hu',
        browserWidth: parseInt(process.env.BROWSER_WIDTH || '1920'),
        browserHeight: parseInt(process.env.BROWSER_HEIGHT || '1080'),
        headless: process.env.HEADLESS !== 'false',
    };
}