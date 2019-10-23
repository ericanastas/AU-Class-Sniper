const puppeteer = require('puppeteer');
var fs = require('fs');
var colors = require('colors');


const credFileName = "creds.json";

const classRootUrl = "https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID="


//Selectors
const addClassSelector = "#sessionSchedule > ul > li > a.imageAdd";
const fullSelector = "#sessionSchedule > ul > li > a.imageAddDisabled";
const addWaitingListSelector = "#sessionSchedule > ul > li > a.imageAddWaiting";
const conflictSelector = "#sessionSchedule > ul > li > a.conflict";
const scheduledClassSeletor = "#sessionSchedule > ul > li > a.sessionScheduling.imageRemove";
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


    const adskLoginUrl = "https://accounts.autodesk.com/logon";
    const creds = await readJSONFile(credFileName);


    console.log("Opening:" + adskLoginUrl);
    const response = await page.goto(adskLoginUrl);

    console.log("Entering username: " + creds.userName);
    await page.waitForSelector("#userName", { visible: true });
    await page.type("#userName", creds.userName);



    //Setup request interception
    var redirectedToADFS = false;

    //page.setRequestInterception(true);

    var adfsDetectionHandler = (req) => {
        console.log(req._url);
        //req.continue();

        //set redirectedToADFS here
    }


    await page.on('request', adfsDetectionHandler);


    //click next button
    await page.click("#verify_user_btn");





    if (redirectedToADFS) {
        console.log("ADFS Login detected");
    }
    else {
        console.log("Entering autodesk password");

        const passwordSelctor = "#password";

        //default autodesk login

        await page.waitForSelector(passwordSelctor, { visible: true });
        await page.type(passwordSelctor, creds.password);
        await page.click("#btnSubmit");
    }

    console.log("Waiting for Autodesk profile page");
    await page.waitForSelector("#profile_picture_div"); //wait for the autodesk profile page

    //
    await page.removeListener('request', adfsDetectionHandler);


}


async function getBookMarkedClassIds(page) {

    const bookMarksUrl = "https://autodeskuniversity.smarteventscloud.com/connect/interests.ww"
    await page.goto(bookMarksUrl);
    await page.waitForNavigation();
    const s1 = "div.sessionRow >div.detailColumn > a.openInPopup"
    await page.waitForSelector("#sessionsTab", { visible: true });
    await page.waitForSelector(s1, { visible: true });



    const classIds = await page.$$eval(s1, anchors => {

        var vals = anchors.map(a => {

            var href = a.getAttribute("href");
            var startIndex = 12 + href.lastIndexOf("?");
            var classIdStr = href.substring(startIndex);
            var classId = Number.parseInt(classIdStr);
            return classId;
        });

        return vals;
    });

    return classIds;
}


(async function main() {




    try {

        //Start Puppeteer browser
        console.log("Starting Puppeteer Chrome Browser");
        const browser = await puppeteer.launch({
            defaultViewport: null,
            headless: false, // launch headful mode
            args: [`--window-size=1280,1024`] // new option
            //slowMo: 250, // slow down puppeteer script so that it's easier to follow visually
        });
        const page = await browser.newPage();




        //Login
        console.log("Logging into Autodesk");
        await adskLogin(page);

        //Read Bookmarked Classes
        console.log("Reading bookmarked classes");
        var classSessionIds = await getBookMarkedClassIds(page);
        console.log(classSessionIds.length + " bookmarked classes found");

        //loop over class session
        for (var i = 0; i < classSessionIds.length; i++) {
            let sessionId = classSessionIds[i];

            var classUrl = classRootUrl + sessionId;

            //Open class page
            await page.goto(classUrl);

            //read and log title and url
            const title = await page.$eval(classTitleHeaderSelector, el => el.innerText);

            //Check status
            await page.waitForSelector("#sessionSchedule", { visible: true });
            var isScheduled = (await page.$(scheduledClassSeletor) !== null);
            var canAdd = (await page.$(addClassSelector) !== null);
            var canAddWaitlist = (await page.$(addWaitingListSelector) !== null);
            //var isFull = (await page.$(fullSelector) !== null);

            if (!isScheduled) {
                //Seperator line
                console.log();

                //print status
                console.log(title);
                console.log("\tURL: ", classUrl.cyan);

                if (canAdd) console.log("\tClass: Open".green);
                else {
                    console.log("\tClass: Full".red);
                    if (canAddWaitlist) console.log("\tWaitlist: Open".yellow);
                    else console.log("\tWaitlist: Full".red);
                }

                var conflicts = (await page.$(conflictSelector) !== null);
                if ((canAdd | canAddWaitlist) & conflicts) console.log("\tConflicts: Yes".red);


            }



        }

        await browser.close();

    }
    catch (err) {
        console.log("Exception.Name: " + err.name.red);
        console.log("Exception.Message: " + err.message.red);
        console.log("Exception Details: " + err);
    }

})();
