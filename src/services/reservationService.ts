import { Page } from "puppeteer";

export class ReservationService {
    constructor(private page: Page) {}

    async reserveTimeSlot(slotId: string): Promise<void> {
        try {
            // Click on the "BOOK NOW" button
            await this.page.click('button.btn.btn-primary.col-md-4.col-xs-12.col-md-offset-4');
            // find table on page with table selector with class "table-condensed"
            // const table = await this.page.$('table.table-condensed');
            // wait for <div> with class "datepicker-days" to be visible
            await this.page.waitForSelector('div.datepicker-days', { visible: true });
            // Select the parent <tr> following the <td> with class "active day"
            
            // Table element is <tbody><tr><td class="old disabled day">27</td><td class="old disabled day">28</td><td class="old disabled day">29</td><td class="old disabled day">30</td><td class="disabled day">1</td><td class="disabled day">2</td><td class="disabled day">3</td></tr><tr><td class="disabled day">4</td><td class="disabled day">5</td><td class="disabled day">6</td><td class="disabled day">7</td><td class="disabled day">8</td><td class="disabled day">9</td><td class="disabled day">10</td></tr><tr><td class="disabled day">11</td><td class="day">12</td><td class="day">13</td><td class="day">14</td><td class="day">15</td><td class="day">16</td><td class="day">17</td></tr><tr><td class="day">18</td><td class="active day">19</td><td class="disabled day">20</td><td class="disabled day">21</td><td class="disabled day">22</td><td class="disabled day">23</td><td class="disabled day">24</td></tr><tr><td class="disabled day">25</td><td class="disabled day">26</td><td class="disabled day">27</td><td class="disabled day">28</td><td class="disabled day">29</td><td class="disabled day">30</td><td class="disabled day">31</td></tr><tr><td class="new disabled day">1</td><td class="new disabled day">2</td><td class="new disabled day">3</td><td class="new disabled day">4</td><td class="new disabled day">5</td><td class="new disabled day">6</td><td class="new disabled day">7</td></tr></tbody>
            // const rows = await this.page.$("::-p-xpath(//table/tbody/tr/td[contains(@class, 'active day')]/following-sibling::td[1])");
            // const rows = await this.page.$("::-p-xpath(//table/tbody/tr/td[contains(@class, 'active day')]/following-sibling::td[1])");
    

            // if (!rows) {
            //     throw new Error('No rows found for the active day');
            // }
            // log the rows to the console in string format
            // console.log('Rows:', rows);
            //Click on the last <td> with class "day" that is not disabled

            const timeSlots = await this.page.$("::-p-xpath(//table/tbody/tr/td[contains(@class, 'active day')]/parent::tr/following-sibling::tr/td[contains(@class, 'day') and not(contains(@class, 'disabled'))][last()])");
            // const timeSlots = await rows.$("::-p-xpath(//table/tbody/tr/td[contains(@class, 'active day')]/following-sibling::td[contains(@class, 'day') and not(contains(@class, 'disabled'))][1])");
            if (!timeSlots) {
                throw new Error('No available time slots found');
            }
            // Click on the time slot
            await timeSlots.click();
            // Wait for the time slot to be selected
            await this.page.waitForNavigation()

            // Confirm the reservation (if applicable)
            // await this.page.click('#confirm-reservation');
        } catch (error) {
            console.error('Error reserving time slot:', error);
        }
    }
}