import { launch, Browser } from 'puppeteer';

export async function launchBrowser(): Promise<Browser> {
    const browser = await launch({ headless: false });
    return browser;
}

export async function closeBrowser(browser: Browser): Promise<void> {
    await browser.close();
}