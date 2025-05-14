import { Page } from "puppeteer";

export class NavigationService {
    private page: any;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async goBack(): Promise<void> {
        await this.page.goBack();
    }
}