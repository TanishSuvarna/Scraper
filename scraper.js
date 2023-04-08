import puppeteer from 'puppeteer';
import fs from 'fs';
import { createPublicKey } from 'crypto';
 (async()=>{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://leetcode.com/contest/")
    // const x = Array.from(document.querySelectorAll("#__next > div > div > div > div > div.flex.w-full.flex-col.px-4.z-base-3 > .flex.w-full > div > div > div > .flex .h-full .flex-1 > div:nth-child(1) >div >div >a")).map(a => a.href)
    // await page.screenshot({path:"leetcode.png" , fullPage:true})
    // const links = await page.$$eval("#__next > div > div > div > div > div.flex.w-full.flex-col.px-4.z-base-3 > .flex.w-full > div > div > div > .flex .h-full .flex-1 > div:nth-child(1) >div >div >a" , (imgs )=> {
    //     return imgs;
    // })
    const links = await page.evaluate(() =>{
        return Array.from(document.querySelectorAll("#__next > div > div > div > div > div.flex.w-full.flex-col.px-4.z-base-3 > .flex.w-full > div > div > div > .flex .h-full .flex-1 > div:nth-child(1) >div >div >a")).map(a => a.href)
    })
    for(let link of links){
        let newUrl =link + `/ranking/` ,prevUrl = link + `/ranking/` ,ranks,names;
        await page.goto(link + `/ranking/`);
        let temp = false;
        while(!temp){
            // await page.goto(link + `/ranking/${i}`);
            // newUrl = await page.evaluate(() => document.location.href);   
            // console.log(newUrl)
            ranks = await page.evaluate(()=>{
                return Array.from(document.querySelectorAll("#contest-app > div > div > div.ranking-table-container__mOYm > div.table-responsive > table > tbody > tr > td:first-child"))
                .map(a => a.innerText || a.innerHTML || a.textContent);
            })
             names = await page.evaluate(() =>{
                return  Array.from(document.querySelectorAll("#contest-app > div > div > div.ranking-table-container__mOYm > div.table-responsive > table > tbody > tr > td:nth-child(2) a.ranking-username"))
                .map(a => a.innerText || a.innerHTML || a.textContent);
            })
            if(!ranks.length || !names.length){
                const check = await page.evaluate(()=>{
                    if(document.querySelector(".placeholder-text")) return true;
                    return false;
                });
                if(check) temp = true;
                continue;
            };
            for(let i = 0 ; i < names.length; i++){
                ranks[i] = ranks[i] + "  " + names[i];
                fs.appendFileSync(`ranks/${names[i]}.txt` , ranks[i] + '\r\n');
            }
            while(!temp && prevUrl===newUrl){
                await page.click("#contest-app > div > div > nav > ul > li.next-btn > span").then(async() => {
                newUrl = await page.evaluate(() => {
                    if(document.querySelector("#contest-app > div > div > nav > ul > li.next-btn.disabled")){
                        return -1;
                    }
                    return document.location.href;
                })
            }).catch(err => console.log(err));
            if(newUrl === -1){
                temp = true;
                break;
            } 
        }  
            prevUrl = newUrl;
            console.log(newUrl)   
            // i++;
        } 
    }  console.log("Am Out")
        await browser.close();
}
)()
//document.querySelector("#contest-app > div > div > nav > ul > li.next-btn > span").click()
//Array.from(document.querySelectorAll("#contest-app > div > div > div.ranking-table-container__mOYm > div.table-responsive > table > tbody > tr > td:first-child"))
//Array.from(document.querySelectorAll("#contest-app > div > div > div.ranking-table-container__mOYm > div.table-responsive > table > tbody > tr > td:nth-child(2) a.ranking-username"))