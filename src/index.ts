import { launchBrowser, closeBrowser } from './utils/browserUtils';
import AuthService from './services/authService';
import { NavigationService } from './services/navigationService';
import { ReservationService } from './services/reservationService';
import puppeteer, { Page } from 'puppeteer';

async function main() {
    const browser = await launchBrowser();
    if (!browser) {
        console.error('Browser instance is undefined!');
        return;
    }
    // instantiate a page object then pass it to the navigation service
    const page: Page = await browser.newPage();
    await page.setViewport({
        width: 1000,
        height: 800,
        deviceScaleFactor: 1,
    });
    const authService = new AuthService(page);
    const navigationService = new NavigationService(page);
    const reservationService = new ReservationService(page);

    try {

        const navigationService = new NavigationService(page);
        await navigationService.navigateTo('https://foreupsoftware.com/index.php/booking/19348/1470#/teetimes');
        const authService = new AuthService(page);
        await authService.authenticate('Rick@KentGroup.org', 'HawkstEr106GLF!'); // Replace with actual credentials
        await navigationService.navigateTo('https://foreupsoftware.com/index.php/booking/19348/1470#/teetimes');
        // instantiate the reservation service with the page object
        const reservationService = new ReservationService(page);
        await reservationService.reserveTimeSlot('desired-time-slot'); // Replace with actual time slot
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        //await closeBrowser(browser);
    }
}

main();