// Get jquery objects from DOM
/*
var username = $("#username");
var pageheader = $("#page-header");
var region = "oce";
var searchbtn = $("#searchbtn");
var api_key = "RGAPI-72059D01-A819-4032-965D-656FFF263D28";

var summonerLevel = "";
var summonerID = "";


searchbtn.on("click", function() {
    username = document.getElementById("username").value;
    username=username.toLowerCase();
    if (username == null || username == ""){
        swal("You did not enter an username");
    } else if(validateName(username)){
        getRiotData(username);
    } else {
        alert("Invalid username");
    }
});


function validateName(name){
    if (/^[0-9a-zA-Z\\p{L} _\\.]+$/.test(name)) {
        return true;
    }
    return false;
}

// Manipulate the DOM
function initialChangeUI() {
    //Show detected mood
    pageheader.html("Checking summoner's data: ...");

    //Display song refresh button
    //refreshbtn.css("display", "inline");

    //Remove offset at the top
    //pagecontainer.css("marginTop", "20px");
}
function finalChangeUI(){
    pageheader.html("Use YooLoL to check your level in OCE LoL");
}

function getRiotData(username){
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
        swal("Oops...", "Error getting Summoner's data!", "error");
        console.log(error.getAllResponseHeaders());
    });
}

function sortData(summonerData){
    summonerLevel = summonerData[username].summonerLevel;
    summonerID = summonerData[username].id;
    document.getElementById("user-result").innerHTML = username + "'s level is " + summonerLevel;
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