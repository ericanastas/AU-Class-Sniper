# AU Class Sniper

Tool for getting the AU classes you want

1. Install [NodeJS](https://nodejs.org/en/)
2. Run `npm install` to install dependencies (puppeteer).
3. Edit `creds.json` with your actual Autodesk credentials.
4. Run `node app.js`
5. The current status of the classes you have bookmarked, but have not scheduled, will be displayed in the console.

# Example Outpt

```
PS C:\Git\AUClassSniper> node app.js
Starting Puppeteer Chrome Browser
Logging into Autodesk
Reading bookmarked classes..
49 bookmarks found!
CS323554 - Assemble + Navisworks: The Ultimate Preconstruction Solution 
        URL:  https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID=331889
        Class: Open
        Waitlist: Full
        Conflicts: Yes

FDC322692 - Forge Configurator for Construction Manufacturing Assemblies
        URL:  https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID=322692
        Class: Open
        Waitlist: Full
        Conflicts: No

FDC328324 - The Future of Data: Forge Data Platform
        URL:  https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID=328324
        Class: Open
        Waitlist: Full
        Conflicts: Yes

SD322461 - Advanced Data Visualization Using the Forge Viewer
        URL:  https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID=322461
        Class: Full
        Waitlist: Open
        Conflicts: Yes

FDC324008 - BIM 360 VR Collaboration for AEC/Construction with InsiteVR, Unity and Forge
        URL:  https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID=324008
        Class: Open
        Waitlist: Full
        Conflicts: Yes

AS319384 - The Business Value of Computational and Generative Design for Executives
        URL:  https://autodeskuniversity.smarteventscloud.com/connect/sessionDetail.ww?SESSION_ID=319384
        Class: Full
        Waitlist: Open
        Conflicts: Yes
```