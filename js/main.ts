// typescript definition for facebook 
///<reference path="fbsdk.d.ts" />
// typescript definition for sweetalert
///<reference path="sweetalert.d.ts" />
// api-key for riot api
var _api_key = "RGAPI-72059D01-A819-4032-965D-656FFF263D28";
// username of user
var _username;
// region default is oce for now
var _region = "oce";
var searchbtn = document.getElementById('searchbtn');
// user data on LoL
var _user;
var _userLeague;
var _userEntry;

// when search button is pushed 
searchbtn.addEventListener('click', function () {
    _username = (<HTMLInputElement>document.getElementById('username')).value;
    _username = _username.toLowerCase();
    if (validateName(_username)) {
        getUserData(_username);
    } else {
        document.getElementById("user-result").innerHTML = _username + " username is invalid, please enter again.";
        swal("Invalid username: " + _username, "Please try again." );
    }
});
// valid LoL username given in Riot API documentation
function validateName(name: string) {
    return (/^[0-9a-zA-Z\\p{L} _\\.]+$/.test(name));
}

class summoner {
    id: number;
    name: string;
    profileIconId: number;
    summonerLevel: number;
    revisionDate: number;
    userLeague: league;
    constructor(public _id, public _name, public _profileIconId, public _summonerLevel, public _revisionDate) {
        this.id = _id;
        this.name = _name;
        this.profileIconId = _profileIconId;
        this.summonerLevel = _summonerLevel;
        this.revisionDate = _revisionDate;
    }
}
function summonerData(d: JSON, n: string) {
    _user = new summoner(d[n].id, d[n].name, d[n].profileIconId, d[n].summonerLevel, d[n].revisionDate);
    getLeagueData(_user.id);
    console.log(_user);
    console.log(_userLeague);
    layoutUserData(_user,_userLeague);
}
class league {
    queue: string;
    name: string;
    tier:  string;
    entry: any;
    //leaguePoints:number;
    //division: string;
    //losses: number;
    //wins: number;
    constructor(public  _queue, public _name, public _tier, public _entries){
        this.queue = _queue;
        this.name = _name;
        this.tier = _tier;
        this.entry = _entries;
        //console.log(_entries);
        //this.leaguePoints=_entries["entries"][0].leaguePoints;
        //this.division=_entries["entries"][0].division;
        //this.losses=_entries["entries"][0].losses;
        //this.wins=_entries["entries"][0].wins;
    }
}
function leagueData(d: JSON,id:number){
    _userLeague = new league(d[id][0].queue,d[id][0].name,d[id][0].tier,d[id][0].entry);
    console.log(_userLeague);
}


// call Riot API using ajax to get user's summoner data
function getUserData(name: string) {
    $.ajax({
        url: "https://" + _region + ".api.pvp.net/api/lol/" + _region + "/v1.4/summoner/by-name/" + name + "?api_key=" + _api_key,
        type: "GET",
        data: JSON
    })
        .done(function (data) {
            if (data.length != 0) {
                console.log(data);
                summonerData(data, name);
            } else {
                document.getElementById("user-result").innerHTML = "Summoner " + name + " username was not found. Please check your username and region."
            }
        })
        .fail(function (error) {
            alert("Error getting Summoner's data!");
            console.log(error.getAllResponseHeaders());
        });
}
function getLeagueData(id: number) {
    $.ajax({
        url: "https://" + _region + ".api.pvp.net/api/lol/" + _region + "/v2.5/league/by-summoner/" + id + "/entry?api_key=" + _api_key,
        type: "GET",
        data: JSON
    })
        .done(function (lData) {
            if (lData.length != 0) {
                leagueData(lData,id);
            } else {
                //document.getElementById("user-result").innerHTML = "Summoner " + name + " username was not found. Please check your username and region."
                console.log("no league data");
            }
        })
        .fail(function (error) {
            alert("Error getting Summoner's data!");
            console.log(error.getAllResponseHeaders());
        });
}

function layoutUserData() {
    document.getElementById("name").innerHTML = "Summoner: " + _user.name;
    document.getElementById("userLevel").innerHTML = "Level: " + _user.summonerLevel;
    (<HTMLInputElement>document.getElementById("icon")).src = "http://ddragon.leagueoflegends.com/cdn/6.18.1/img/profileicon/" + _user.profileIconId + ".png"
    document.getElementById("rankLeague").innerHTML = _userLeague.tier;
    document.getElementById("rankName").innerHTML = "Level: " + _userLeague.name;
    var rankL = _userLeague.tier.toLowerCase();
    (<HTMLInputElement>document.getElementById("rankIcon")).src = "http://sk2.op.gg/images/medals/" + rankL + "_2.png"
}
/**
 * Facebook login 
 */
var _fb_id = "323270821354701";
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
        testAPI();
    } else if (response.status === 'not_authorized') {
        document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    } else {
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
        cookie: true,  // enable cookies to allow the server to access 
        // the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.7' // use graph api version 2.5
    });

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', "GET", function (response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML = 'Hello, ' + response.name + '!';
    });
}