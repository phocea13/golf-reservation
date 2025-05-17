import { Page } from "puppeteer";
import schedule from "node-schedule";

export class ReservationService {
    constructor(private page: Page) { }

    async clickTimeOfDay(timeOfDay: string = 'morning') {
        const mbSelector = `a.btn.btn-primary[data-value="${timeOfDay}"]:not(.disabled)`
        const morningButton = await this.page.$(mbSelector);
        // check that morningButton is not null
        if (morningButton === null) {
            console.log(`${timeOfDay} button is not available, clicking on the next date then come back later`);
        } else {
            console.log('Clicking on the morning button');
            // log the text content of the morning button
            const morningText = await morningButton?.evaluate((el) => el.textContent);
            // log the morning button text
            console.log('Time of day button text:', morningText);
            await morningButton.click();
            //wait for next UI change
            await this.page.waitForSelector('div.times-inner.time-tiles.js-times', { visible: true });
            // wait for response to this request to be receivde: https://foreupsoftware.com/index.php/api/booking/times?time=morning&date=05-21-2025&holes=all&players=4&booking_class=929&schedule_id=1470&schedule_ids%5B%5D=1470&schedule_ids%5B%5D=1490&specials_only=0&api_key=no_limits
            await this.page.waitForResponse((response) => {
                return response.url().includes('https://foreupsoftware.com/index.php/api/booking/times') && response.status() === 200;
            });
        }
    }



    async clickNumberOfPlayers(numberOfPlayers: number = 4) {
        //log the number of players
        console.log('Number of players:', numberOfPlayers);
        
        // create constants for the number of players buttons selector
        const numberOfPlayersSelector = `a.btn.btn-primary[data-value="${numberOfPlayers}"]:not(.disabled)`;
        await this.page.waitForSelector(numberOfPlayersSelector, { visible: true });
        const numberOfPlayersButton = await this.page.$(numberOfPlayersSelector);
        // check that numberOfPlayersButton is not null

        if (numberOfPlayersButton === null) {
            console.log('Number of players button is not available, clicking on the next date then come back later');
        } else {
            console.log('Clicking on the number of players button');
            // log the text content of the numberOfPlayers button
            const numberOfPlayersText = await numberOfPlayersButton?.evaluate((el) => el.textContent);
            // log the number of players selected
            console.log('Number of players selected:', numberOfPlayersText);
            await numberOfPlayersButton.click();
            //wait for that same button to have class "active"
            // await this.page.waitForSelector('a.btn.btn-primary[data-value="4"].active', { visible: true });
            await this.page.waitForResponse((response) => {
                return response.url().includes('https://foreupsoftware.com/index.php/api/booking/times') && response.status() === 200;
            });
        }
    }

    async clickTimeSlot(): Promise<boolean> {
        // Wait for the time slots to be visible
        await new Promise(res => setTimeout(res, 50));
        await this.page.waitForSelector('div.times-inner.time-tiles.js-times', { visible: true });
        
        // create a variable named timeSlots with an array comprised of all the children of <div class="times-inner  time-tiles  js-times">
        const timeSlots = await this.page.$$('div.times-inner.time-tiles.js-times > div');

        // log the number of time slots found
        console.log('Number of time slots found:', timeSlots.length);
        // if timeSlots is empty or null, return false
        if (timeSlots?.length === 0) {
            console.log('No time slots found');
            return false;
        }
        // Log the time slots to the console

        // Loop through the time slots and click on the one that matches the slotId
        for (const timeSlot of timeSlots) {
            // Get the text content of from the <div> element's text inside the timeSlot <div class="booking-start-time-label">

            const timeSlotText = await timeSlot.evaluate((el) => {
                const label = el.querySelector('.booking-start-time-label');
                return label ? label.textContent : null;
            }, timeSlot);

            // Log the time slot text to the console
            console.log('Time Slot Text:', timeSlotText);

            // if timeSlotText is null, return false
            // if (timeSlotText === null) {
            //     console.log('Time slot text is null, try again with another filter');
            //     return false;
            // }
            // Check if the text content matches the slotId
            if (timeSlotText?.trim().startsWith("4:") || timeSlotText?.trim().startsWith("5:")) {
                // Click on the time slot
                await timeSlot.click();
                // wait for response to POST request https://foreupsoftware.com/index.php/api/booking/pending_reservation
                await this.page.waitForResponse((response) => {
                    return response.url().includes('https://foreupsoftware.com/index.php/api/booking/pending_reservation') && response.status() === 200;
                });
                return true;
            }
        }
        return false
    }
    async reserveTimeSlot(slotId: string, numberOfPlayers: number = 4): Promise<void> {
        try {
            // Click on the "BOOK NOW" button
            await this.page.click('button.btn.btn-primary.col-md-4.col-xs-12.col-md-offset-4');
            // find table on page with table selector with class "table-condensed"
            // const table = await this.page.$('table.table-condensed');
            // wait for <div> with class "datepicker-days" to be visible
            await this.page.waitForSelector('div.datepicker-days', { visible: true });

            this.page.click("::-p-xpath(//table/tbody/tr/td[contains(@class, 'active day')]/parent::tr/following-sibling::tr/td[contains(@class, 'day') and not(contains(@class, 'disabled'))][last()])")
            // // Wait for the time slots to be visible
            // await this.page.waitForSelector('div.times-inner.time-tiles.js-times', { visible: true });
            await this.page.waitForResponse((response) => {
                return response.url().includes('https://foreupsoftware.com/index.php/api/booking/times') && response.status() === 200;
            });
            // Click on the number of players button
            // await this.clickNumberOfPlayers();

            await this.clickTimeOfDay("morning");

            await this.page.waitForSelector('div.times-inner.time-tiles.js-times', { visible: true });
            const timeH = "19"
            const timeM = "00"
            // Schedule a task to run at certain time,  asychronously. Select time that starts with 4:
            console.log(`Schedule reservation today at ${timeH}:${timeM}`);

            const job = schedule.scheduleJob (`${timeM} ${timeH} * * *`, async () => {
                var nothingReserved = true;
                var numberOfPlayers = 4;
                console.log(`Trying to find a time slot for ${numberOfPlayers} players`);
                await this.clickNumberOfPlayers(numberOfPlayers);
                while (nothingReserved && (numberOfPlayers > 1)) {
                    // if click time slot returns false, try again with one less player
                    if (await this.clickTimeSlot() === false) {
                        console.log('No time slot found, trying again');
                        numberOfPlayers--;
                        // wait for 50ms
                        await new Promise(res => setTimeout(res, 50));
                        await this.clickNumberOfPlayers(numberOfPlayers);   
                    } else {
                        //log message "Reservation successful, make manual reservation"
                        console.log('Reservation successful, make manual reservation');
                        nothingReserved = false;
                    }
                }
            });

        } catch (error) {
            console.error('Error reserving time slot:', error);
        }
    }
}