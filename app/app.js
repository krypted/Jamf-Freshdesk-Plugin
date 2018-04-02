let baseURL, userName, passWord, fdClient;

let computerURL = "/JSSResource/computers/serialnumber/";
let mobileDeviceURL = "/JSSResource/mobiledevices/serialnumber/";
let computerViewURL = "/computers.html?id=";
let mobileDeviceViewURL = "/mobileDevices.html?id=";

let options = {
    headers: {
        "accept": "application/json",
        "Authorization": ""
    }
};

$(document).ready(function () {
    app.initialized()
        .then(function (_client) {
            fdClient = _client;
            $("#getJamfDetails").click(getComputerDetails);
            $("#computerDetails").hide();
            $("#mobileDetails").hide();
            $("#noDataDiv").hide();

            fdClient.instance.resize({ height: "400px" });

            fdClient.iparams.get().then(
                function (data) {
                    baseURL = data.url;
                    userName = data.username;
                    passWord = data.password;

                    computerURL = baseURL + computerURL;
                    mobileDeviceURL = baseURL + mobileDeviceURL;
                    computerViewURL = baseURL + computerViewURL;
                    mobileDeviceViewURL = baseURL + mobileDeviceViewURL;

                    options.headers.Authorization = "Basic " + btoa(userName + ":" + passWord);
                },
                function (error) {
                    console.log(error);
                }
            );

        });
});

function getComputerDetails() {
    fdClient.request.get(computerURL + $("#serialNumberInp").val(), options)
        .then(
            function (data) {
                console.log("data ==>");
                console.log(data);
                if (data.status === 200) {
                    let jamfResp = JSON.parse(data.response);
                    console.log(jamfResp.computer);
                    showComputerDetails(jamfResp.computer);
                }
            },
            function (error) {
                console.log("error ==>");
                console.log(error);
                if (error.status !== 504) { getMobileDeviceDetails(); }

            }
        );
}

function getMobileDeviceDetails() {
    fdClient.request.get(mobileDeviceURL + $("#serialNumberInp").val(), options)
        .then(
            function (data) {
                console.log("data ==>");
                console.log(data);
                if (data.status === 200) {
                    let jamfResp = JSON.parse(data.response);
                    console.log(jamfResp.mobile_device);
                    showMobileDeviceDetails(jamfResp.mobile_device);
                }
            },
            function (error) {
                console.log("error ==>");
                console.log(error);
                $("#computerDetails").hide();
                $("#mobileDetails").hide();
                $("#noDataDiv").show();
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
}