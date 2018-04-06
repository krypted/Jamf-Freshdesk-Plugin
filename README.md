# FreshDesk - Jamf|PRO

## Description

FreshDesk market place app to get the Computer / Mobile Device details from Jamf|PRO.

Agents need to provide the Jamf|PRO domain(URL, Example: https://tryitout.jamfcloud.com), User name & Password while installing the app. Please note Multiple Jamf accounts can be configured during installation.

Once installed, The application can be accessed by clicking the Jamf|PRO icon in Ticket Side bar (Right side of the ticket details page).

![Freshdesk Tickets](page.png)

Agents can get the details from Jamf|PRO by providing the serial number. Following are the sample screenshots.

![Freshdesk Tickets](image1.png) ![Freshdesk Tickets](image2.png)

![Freshdesk Tickets](image3.png) ![Freshdesk Tickets](image4.png)

Note: Loading Icon will be displayed while search is in progress... 

![Freshdesk Tickets](image5.png)

### Folder structure explained

    .
    ├── README.md                  This file. Provides description about the app.
    ├── app                        Contains the files that are required for the front end component of the app
    │   ├── app.js                 JS to render the dynamic portions of the app
    │   ├── jamf_logo.svg          Sidebar icon SVG file. Should have a resolution of 64x64px.
    │   ├── jamf_logo.png          The Freshdesk logo that is displayed in the app
    │   ├── style.css              Style sheet for the app
    │   ├── template.html          Contains the HTML required for the app’s UI
    ├── config                     Contains the installation parameters and OAuth configuration
    │   ├── iparams.json           Contains the parameters that will be collected during installation
    │   └── iparam_test_data.json  Contains sample Iparam values that will used during testing
    └── manifest.json              Contains app meta data and configuration information
