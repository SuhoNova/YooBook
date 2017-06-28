///<reference path="fbsdk.d.ts" />
///<reference path="sweetalert.d.ts" />
// api-key for riot api
var _api_key = "API_KEY_RIOT";
// api-ky for facebook
var _fb_id = "API_KEY_FB";
// username of user
var _username;
// region default is oce for now, may give option for other regions later on
var _region = "oce";
var searchbtn = document.getElementById('searchbtn');
// user data on LoL
var _user;
var _userLeague;
var _userEntry;
/**
 * When search button is pressed
 */
searchbtn.addEventListener('click', function () {
    _username = document.getElementById('username').value;
    // when using LoL api, use lowercase
    _username = _username.toLowerCase();
    if (validateName(_username)) {
        // if valid username call Riot API to get user data if available
        getUserData(_username);
        console.log(_user);
    }
    else {
        swal("Invalid username: " + _username, "Please try again.");
    }
});
// valid LoL username given in Riot API documentation
function validateName(name) {
    return (/^[0-9a-z\\p{L} _\\.]+$/.test(name));
}
// ranked summoner's output layout
function layoutUserData() {
    document.getElementById("name").innerHTML = "Summoner: " + _user.name;
    document.getElementById("userLevel").innerHTML = "Level: " + _user.summonerLevel;
    document.getElementById("icon").src = "http://ddragon.leagueoflegends.com/cdn/6.18.1/img/profileicon/" + _user.profileIconId + ".png";
    document.getElementById("rankLeague").innerHTML = _userLeague.tier + " " + _userLeague._division;
    document.getElementById("LP").innerHTML = _userLeague._leaguePoints + "LP";
    document.getElementById("rankName").innerHTML = _userLeague.name;
    var rankL = _userLeague.tier.toLowerCase();
    document.getElementById("rankIcon").src = "//sk2.op.gg/images/medals/" + rankL + "_2.png";
}
// Unranked summoner's output layout
function unrankedOutput() {
    document.getElementById("name").innerHTML = "Summoner: " + _user.name;
    document.getElementById("userLevel").innerHTML = "Level: " + _user.summonerLevel;
    document.getElementById("icon").src = "http://ddragon.leagueoflegends.com/cdn/6.18.1/img/profileicon/" + _user.profileIconId + ".png";
    document.getElementById("rankLeague").innerHTML = "Unranked";
    document.getElementById("rankIcon").src = "//sk2.op.gg/images/medals/default.png";
    document.getElementById("LP").innerHTML = "";
    document.getElementById("rankName").innerHTML = "";
}
/**
 * Using ajax to call riot's api to get user data on LoL
 */
function getUserData(name) {
    $.ajax({
        url: "https://" + _region + ".api.pvp.net/api/lol/" + _region + "/v1.4/summoner/by-name/" + name + "?api_key=" + _api_key,
        type: "GET",
        data: JSON
    })
        .done(function (data) {
        if (data.length != 0) {
            console.log(data);
            // store user data
            _user = new summoner(data[name].id, data[name].name, data[name].profileIconId, data[name].summonerLevel, data[name].revisionDate);
            if (_user._summonerLevel == 30) {
                getLeagueData(_user._id);
            }
            else {
                unrankedOutput();
            }
        }
        else {
            document.getElementById("user-result").innerHTML = "Summoner " + name + " username was not found. Please check your username and region.";
        }
    })
        .fail(function (error) {
        swal("Error getting Summoner's data!", "Please try again.");
        console.log(error.getAllResponseHeaders());
    });
}
function getLeagueData(id) {
    $.ajax({
        url: "https://" + _region + ".api.pvp.net/api/lol/" + _region + "/v2.5/league/by-summoner/" + id + "/entry?api_key=" + _api_key,
        type: "GET",
        data: JSON
    })
        .done(function (leagueData) {
        if (leagueData.length != 0) {
            var e = "entries";
            _userLeague = new league(leagueData[id][0].queue, leagueData[id][0].name, leagueData[id][0].tier, +leagueData[id][0].entries[0].leaguePoints, leagueData[id][0].entries[0].division, +leagueData[id][0].entries[0].wins, leagueData[id][0].entries[0].losses);
            layoutUserData();
        }
        else {
            document.getElementById("user-result").innerHTML = "Summoner " + name + " rank was not found.";
        }
    })
        .fail(function (error) {
        swal("Error getting Summoner's data!", "Please try again.");
        console.log(error.getAllResponseHeaders());
    });
}
/**
 * Free champion rotation
 */
function changeSlides(d) {
    var c = "champions";
    var n = "name";
    for (var i = 0; i < 10; i++) {
        getChampName(d[c][i].id, "slide" + i);
    }
}
/**
 * Ajax to get list of free champions this week, the id of champions are in numbers so use getChampName to get the actual name from static riot API
 */
function getFreeChamp() {
    $.ajax({
        url: "https://" + _region + ".api.pvp.net/api/lol/" + _region + "/v1.2/champion?freeToPlay=true&api_key=" + _api_key,
        type: "GET",
        data: JSON
    })
        .done(function (freeData) {
        if (freeData.length != 0) {
            changeSlides(freeData);
        }
        else {
            console.log("Error in getting free rotation champions");
        }
    })
        .fail(function (error) {
        swal("Error getting free rotation champion's data!", "Please try again.");
        console.log(error.getAllResponseHeaders());
    });
}
function getChampName(id, slide) {
    $.ajax({
        url: "https://global.api.pvp.net/api/lol/static-data/" + _region + "/v1.2/champion/" + id + "?champData=image&api_key=" + _api_key,
        type: "GET",
        data: JSON
    })
        .done(function (champName) {
        var idForImage = "#" + slide;
        if (champName.length != 0) {
            document.getElementById(slide).src = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + champName.key + "_0.jpg";
            document.getElementById(slide).alt = "Couldn't find " + champName.key + ". Please contact site to fix the link.";
        }
        else {
            console.log("Error in getting champion's name.");
        }
    })
        .fail(function (error) {
        swal("Error getting free rotation champion's data!", "Please try again.");
        console.log(error.getAllResponseHeaders());
    });
}
/**
 * Format of how user LoL data is stored
 */
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
var league = (function () {
    function league(_queue, _name, _tier, _leaguePoints, _division, _losses, _wins) {
        this._queue = _queue;
        this._name = _name;
        this._tier = _tier;
        this._leaguePoints = _leaguePoints;
        this._division = _division;
        this._losses = _losses;
        this._wins = _wins;
        this.queue = _queue;
        this.name = _name;
        this.tier = _tier;
        this.leaguePoints = _leaguePoints;
        this.division = _division;
        this.losses = _losses;
        this.wins = _wins;
    }
    return league;
}());
/**
 * Unslider
 */
function bannerSlide() {
    $('.banner').unslider({
        autoplay: true,
        infinite: true,
        nav: true,
        keys: true,
        dots: true,
        fluid: true
    });
    $('.banner').height('initial');
}
jQuery(document).ready(function ($) {
    getFreeChamp();
    bannerSlide();
});
/**
 * Facebook login
 */
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
