# AU Class Sniper

Tool for getting the AU classes you want

1. Install [NodeJS](https://nodejs.org/en/)
2. Run `npm install` to install dependencies (puppeteer).
3. Edit `creds.json` with your actual Autodesk credentials.
4. Edit `classes.json` with the session IDs of the class you are interested in. 

    For example the session in in the following URL Is 999999: `https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID=999999`
    
5. Run `node app.js`
6. The current status of the classes will be displayed. 