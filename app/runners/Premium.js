import utils from "../utils.js";

export default {
    collectResources: async (page, repetition) => {
        // await this.page.evaluate(() => {
        //     let towns = document.querySelectorAll(
        //         "#townsoverview_table_wrapper > ul#table_scroll_content > li"
        //     );
        //     let townsFull = [];

        //     [].forEach.call(towns, (town) => {
        //         let t = town.childNodes[2];
        //         let wood = t.querySelector("div:nth-child(0) > div.wood").text;
        //         let stone = t.querySelector(
        //             "div:nth-child(1) > div.stone"
        //         ).text;
        //         let iron = t.querySelector("div:nth-child(2) > div.iron").text;
        //         let storage = t.querySelector(
        //             "div:nth-child(4) > div > span.storage"
        //         ).text;

        //         if (iron === storage || stone === storage || wood === storage) {
        //             townsFull.push(town);
        //         }
        //         console.log(storage);
        //     });
        // });

        await page.waitForSelector("#quickbar_dropdown1", { timeout: 0 });
        await page.click("#quickbar_dropdown1 > div");

        await page.waitForTimeout(utils.random(600, 1000));
        await page.waitForSelector(".select_all", { timeout: 0 });
        await page.click(".select_all");
        await page.waitForTimeout(utils.random(600, 1000));
        await page.click("#fto_claim_button");
        await page.waitForTimeout(utils.random(600, 1000));
    },
};
