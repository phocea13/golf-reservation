import { Page } from "puppeteer";

class AuthService {
    constructor(private page: Page) {}

    async authenticate(username: string, password: string): Promise<void> {
        await this.page.type('#login_email', username);
        await this.page.type('#login_password', password);
        await this.page.click('[name="login_button"]');
        await this.page.waitForNavigation();
    }

    async logout(): Promise<void> {
        await this.page.goto('https://example.com/logout');
        await this.page.waitForNavigation();
    }
}

export default AuthService;