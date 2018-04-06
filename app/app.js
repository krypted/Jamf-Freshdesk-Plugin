let baseURL, userName, passWord;
let computerURL, mobileDeviceURL, computerViewURL, mobileDeviceViewURL;
let fdClient;

let options = {
    headers: {
        "accept": "application/json",
        "Authorization": ""
    }
};

let jamfAccounts = {
    currentAccount: 0,
    accounts: [],
    load: function (d) {
        let acct_count = 1;
        for (let i = 0; i < Object.keys(d).length; i = i + 3) {
            let acct = new jamfAccount(d["url_" + acct_count], d["username_" + acct_count], d["password_" + acct_count]);
            this.accounts.push(acct);
            acct_count++;
        }
    },
    show: function () {
        for (let i = 0; i < this.accounts.length; i++) {
            console.log(this.accounts[i]);
        }
    },
    isNextAccountExists: function () {
        if (this.currentAccount + 1 < this.accounts.length) {
            this.currentAccount++;
            return true;
        } else {
            return false;
        }
    }
};

function jamfAccount(url, username, password) {
    this.url = url;
    this.username = username;
    this.password = password;

    this.computerURL = this.url + "/JSSResource/computers/serialnumber/";
    this.mobileDeviceURL = this.url + "/JSSResource/mobiledevices/serialnumber/";
    this.computerViewURL = this.url + "/computers.html?id=";
    this.mobileDeviceViewURL = this.url + "/mobileDevices.html?id=";

    this.Authorization = "Basic " + btoa(this.username + ":" + this.password);
}

$(document).ready(function () {
    app.initialized()
        .then(function (_client) {
            fdClient = _client;
            $("#getJamfDetails").click(getJamfDetails);
            $("#computerDetails").hide();
            $("#mobileDetails").hide();
            $("#noDataDiv").hide();

            fdClient.instance.resize({ height: "400px" });

            fdClient.iparams.get().then(
                function (data) {
                    jamfAccounts.load(data);
                },
                function (error) {
                    console.log(error);
                }
            );

        });
});

function getJamfDetails() {
    if ($("#jamfSearchIcon").attr("src") == "icons8-clock.svg") { return; }
    $("#jamfSearchIcon").attr("src", "icons8-clock.svg");
    if (jamfAccounts.accounts.length <= 0) { showError(); }
    else {
        jamfAccounts.currentAccount = 0;
        getComputerDetails();
    }
}

function getComputerDetails() {

    let currentAccount = jamfAccounts.accounts[jamfAccounts.currentAccount];
    baseURL = currentAccount.url;
    userName = currentAccount.username;
    passWord = currentAccount.password;
    computerURL = currentAccount.computerURL;
    mobileDeviceURL = currentAccount.mobileDeviceURL;
    computerViewURL = currentAccount.computerViewURL;
    mobileDeviceViewURL = currentAccount.mobileDeviceViewURL;
    options.headers.Authorization = currentAccount.Authorization;

    fdClient.request.get(computerURL + $("#serialNumberInp").val(), options)
        .then(
            function (data) {
                if (data.status === 200) {
                    let jamfResp = JSON.parse(data.response);
                    showComputerDetails(jamfResp.computer);
                }
            },
            function (error) {
                if (error.status !== 504) { getMobileDeviceDetails(); }
            }
        );
}

function getMobileDeviceDetails() {
    fdClient.request.get(mobileDeviceURL + $("#serialNumberInp").val(), options)
        .then(
            function (data) {
                if (data.status === 200) {
                    let jamfResp = JSON.parse(data.response);
                    showMobileDeviceDetails(jamfResp.mobile_device);
                }
            },
            function (error) {
                if (error.status !== 504) {
                    if (jamfAccounts.isNextAccountExists()) {
                        getComputerDetails();
                    }
                    else {
                        showError();
                    }
                } else {
                    showError();
                }
            }
        );
}

function showMobileDeviceDetails(mobileDevice) {
    $("#noDataDiv").hide();
    $("#computerDetails").hide();
    $('#mAssignedUser').text(mobileDevice.location.email_address);
    $("#mDeviceName").text(mobileDevice.general.device_name);
    $("#mSerialNumber").text(mobileDevice.general.serial_number);
    $("#mLastCheckedIn").text(mobileDevice.general.last_contact_time);
    $("#mLastUser").text(mobileDevice.location.realname);

    let last_contact_time = mobileDevice.general.last_contact_time_epoch;
    let uptime = 0;
    if (last_contact_time !== undefined) {
        uptime = Math.abs(new Date(mobileDevice.general.last_contact_time_epoch * 1000) - new Date(mobileDevice.general.initial_entry_date_epoch * 1000)) / 36e5;
    }

    $("#mUptime").text(uptime + " hours");
    $("#mViewDeviceURL").attr("href", mobileDeviceViewURL + mobileDevice.general.id);
    $("#mobileDetails").show();
    $("#jamfSearchIcon").attr("src", "icons8-search.svg");
}

function showComputerDetails(computer) {
    $("#noDataDiv").hide();
    $("#mobileDetails").hide();
    $('#cAssignedUser').text(computer.location.email_address);
    $("#cComputerName").text(computer.general.name);
    $("#cSerialNumber").text(computer.general.serial_number);
    $("#cLastCheckedIn").text(computer.general.last_contact_time);
    $("#cLastUser").text(computer.location.realname);

    let uptime = 0;
    if (computer.general.last_contact_time_epoch !== 0) {
        uptime = Math.abs(new Date(computer.general.last_contact_time_epoch * 1000) - new Date(computer.general.initial_entry_date_epoch * 1000)) / 36e5;
    }

    $("#cUptime").text(uptime + " Hours");
    $("#cViewDeviceURL").attr("href", computerViewURL + computer.general.id);
    $("#computerDetails").show();
    $("#jamfSearchIcon").attr("src", "icons8-search.svg");
}

function showError() {
    $("#computerDetails").hide();
    $("#mobileDetails").hide();
    $("#noDataDiv").show();
    $("#jamfSearchIcon").attr("src", "icons8-search.svg");
}