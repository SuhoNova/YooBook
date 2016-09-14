///<reference path="fbsdk.d.ts" />
/**
 * facebook
 */
var _userTokens;
var _fb_id = "323270821354701";
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
        testAPI();
    }
    else if (response.status === 'not_authorized') {
        document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    }
    else {
        document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    }
}
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}
window.fbAsyncInit = function () {
    FB.init({
        appId: _fb_id,
        cookie: true,
        // the session
        xfbml: true,
        version: 'v2.7' // use graph api version 2.5
    });
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', "GET", function (response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML = 'Hello, ' + response.name + '!';
    });
}
// api-key
var _api_key = "RGAPI-72059D01-A819-4032-965D-656FFF263D28";
// username
var _username;
// region
var _region = "oce";
// searchbtn
var searchbtn = document.getElementById('searchbtn');
var _user;
var summoner = (function () {
    function summoner(_id, _name, _profileIconId, _summonerLevel, _revisionDate) {
        this._id = _id;
        this._name = _name;
        this._profileIconId = _profileIconId;
        this._summonerLevel = _summonerLevel;
        this._revisionDate = _revisionDate;
        this.id = _id;
        this.name = _name;
        this.profileIconId = _profileIconId;
        this.summonerLevel = _summonerLevel;
        this.revisionDate = _revisionDate;
    }
    return summoner;
}());
searchbtn.addEventListener('click', function () {
    _username = document.getElementById('username').value;
    if (validateName(_username)) {
        getUserData(_username);
    }
    else {
        document.getElementById("user-result").innerHTML = _username + " username is invalid, please enter again.";
        alert("Invalid!");
    }
});
function validateName(name) {
    return (/^[0-9a-zA-Z\\p{L} _\\.]+$/.test(name));
}
function getUserData(name) {
    $.ajax({
        url: "https://" + _region + ".api.pvp.net/api/lol/" + _region + "/v1.4/summoner/by-name/" + name + "?api_key=" + _api_key,
        type: "GET",
        data: JSON
    })
        .done(function (summonerData) {
        if (summonerData.length != 0) {
            userData(summonerData, name);
        }
        else {
            document.getElementById("user-result").innerHTML = "Summoner " + name + " username was not found. Please check your username and region.";
        }
    })
        .fail(function (error) {
        alert("Error getting Summoner's data!");
        console.log(error.getAllResponseHeaders());
    });
}
function userData(d, n) {
    _user = new summoner(d[n].id, d[n].name, d[n].profileIconId, d[n].summonerLevel, d[n].revisionDate);
    console.log(_user);
    layoutUserData();
}
function layoutUserData() {
    document.getElementById("user-result").innerHTML = "Hello, " + _user.name + "<br>Your level is " + _user.summonerLevel;
}
/**
 * UI change
 */
/**
 * {
  "ajaajak": {
    "id": 331279,
    "name": "ajaajak",
    "profileIconId": 28,
    "summonerLevel": 30,
    "revisionDate": 1472831014000
  }
}
 */ 
