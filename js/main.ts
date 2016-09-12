import * as $ from 'jquery';


// Get jquery objects from DOM
var api_key = "RGAPI-72059D01-A819-4032-965D-656FFF263D28";
var region = "oce";

var username = "";
var pageheader = $("#page-header")[0];
var searchbtn = $("#searchbtn")[0];
var userData:summoner;

searchbtn.addEventListener("click", function(){
    username = document.getElementById("username").nodeValue;
    username=username.toLowerCase();
    if (username == null || username == ""){
        alert("You did not enter an username");
    } else if(validateName(username)){
        getRiotData(username);
    } else {
        alert("Invalid username, please try again.");
    }
});

function validateName(name) : Boolean {
    if (/^[0-9a-zA-Z\\p{L} _\\.]+$/.test(name)) {
        return true;
    }
    return false;
}

// Manipulate the DOM
function initialChangeUI() {
    //Show detected mood
    document.getElementById("pageheader").innerHTML ="Checking summoner's data: ...";
    //Display song refresh button
    //refreshbtn.css("display", "inline");

    //Remove offset at the top
    //pagecontainer.css("marginTop", "20px");
}
function finalChangeUI(){
    document.getElementById("pageheader").innerHTML = "Use YooLoL to check your level in OCE LoL";
}

function getRiotData(username) : void {
    initialChangeUI();
    $.ajax({
        url: "https://"+region+".api.pvp.net/api/lol/"+region+"/v1.4/summoner/by-name/" +username+"?api_key="+api_key,
        type: "GET",
        data: JSON
    })
    .done(function(summonerData){
        if(summonerData.length != 0){
            sortData(summonerData);
        } else {
            document.getElementById("user-result").innerHTML = "Summoner " + username + " username was not found. Please check your username and region."
        }
    })
    .fail(function(error){
        alert("Error getting Summoner's data!");
        console.log(error.getAllResponseHeaders());
    });
}

function sortData(summonerData){

    userData.id=summonerData[username].id;
    userData.name=summonerData[username].name;
    userData.profileIconId=summonerData[username].profileIconId;
    userData.summonerLevel=summonerData[username].summonerLevel;
    userData.revisionDate=summonerData[username].revisionDate;

    document.getElementById("user-result").innerHTML = username + "'s level is " + userData.summonerLevel;
    finalChangeUI();
}
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
function sendSummonerDataRequest(username) : void {
    $.ajax({
        url: "https://"+region+".api.pvp.net/api/lol/"+region+"/v1.4/summoner/by-name/" +username+"?api_key="+api_key,
        type: "GET",
        data: JSON
    })
    .done(function(summonerData){
        if(summonerData.length != 0){
            sortData(summonerData);
        } else {
            document.getElementById("user-result").innerHTML = "Summoner " + username + " username was not found. Please check your username and region."
        }
    })
    .fail(function(error){
        alert("Error getting Summoner's data!");
        console.log(error.getAllResponseHeaders());
    });
}
class summoner {
    name: string;
    id: number;
    profileIconId: number;
    summonerLevel: number;
    revisionDate: number;
    constructor(public sName, public sID, public sProfileIconId, public sSummonerLevel, public sRevisionDate){
        this.name=sName;
        this.id=sID;
        this.profileIconId=sProfileIconId;
        this.summonerLevel=sSummonerLevel;
        this.revisionDate=sRevisionDate;
    }
}