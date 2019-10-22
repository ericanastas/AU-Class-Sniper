const puppeteer = require('puppeteer');
var fs = require('fs');


const credFileName = "creds.json";
const classeFileName = "classes.json";
const classRootUrl = "https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID="
const adskLoginUrl = "https://accounts.autodesk.com/logon#username";

//Selectors
const addClassSelector = "#sessionSchedule > ul > li > a.imageAdd";
const fullSelector = "#sessionSchedule > ul > li > a.imageAddDisabled";
const addWaitingListSelector = "#sessionSchedule > ul > li > a.imageAddWaiting";
const conflictSelector = "#sessionSchedule > ul > li > a.conflict";
const classTitleHeaderSelector = "#leftCol > div.detailHeader >h1.detail";



async function readJSONFile(path) {

    return new Promise((resolve, reject) => {


        fs.readFile(path, (err, data) => {

            if (err) { reject(err); }
            else {
                resolve(JSON.parse(data));
            }
        })
    });
}


//Login to autodesk acount
async function adskLogin(page) {


    var creds = await readJSONFile(credFileName);
    console.log("Logging in");
    await page.goto(adskLoginUrl);


    await page.type("#userName", creds.userName);
    await page.click("#verify_user_btn");

    await page.waitFor("#password", { visible: true });
    await page.type("#password", creds.password);
    await page.click("#btnSubmit");
    await page.waitForNavigation();
}


(async function main() {


    //Read classes
    var classSessionIds = await readJSONFile(classeFileName);

    //Start Puppeteer browser
    const browser = await puppeteer.launch({
        defaultViewport: null,
        headless: false, // launch headful mode
        args: [`--window-size=1280,1024`] // new option
        //slowMo: 250, // slow down puppeteer script so that it's easier to follow visually
    });
    const page = await browser.newPage();

    //Login
    await adskLogin(page);

    //loop over class session dis
    for (var i = 0; i < classSessionIds.length; i++) {
        let sessionId = classSessionIds[i];

        var classUrl = classRootUrl + sessionId;

        //Open class page
        await page.goto(classUrl);

        //read and log title and url
        const title = await page.$eval(classTitleHeaderSelector, el => el.innerText);
        console.log(title);
        console.log("\tURL: ", classUrl);


        //Check status
        var canAdd = (await page.$(addClassSelector) !== null);
        var canAddWaitlist = (await page.$(addWaitingListSelector) !== null);
        var isFull = (await page.$(fullSelector) !== null);

        //print status
        if (canAdd) console.log("\tClass: Open");
        else console.log("\tClass: Full");

        if (canAddWaitlist) console.log("\tWaitlist: Open");
        else console.log("\tWaitlist: Full");

        var conflicts = (await page.$(conflictSelector) !== null);
        if ((canAdd | canAddWaitlist) & conflicts) Console.log("\tConflicts: yes");


        //Seperator line
        console.log();

    }

    await browser.close();

})();
