// Get jquery objects from DOM

var username = $("#username");
var region = "oce";
var searchbtn = $("#searchbtn");
var key = "RGAPI-72059D01-A819-4032-965D-656FFF263D28";

searchbtn.on("click", function() {
    username = document.getElementById("username").value;
    if (username == null || username == ""){
        alert("You did not enter an username");
    } else if(validateName(username)){
        //document.getElementById("hey").innerHTML = "Hello " + username;
        // valid username, call riot api here
        getRiotData(username, {


        });
    } else {
        alert("Invalid username");
    }
    console.log(username);
});

function validateName(name){;
    if (/^[0-9a-zA-Z\\p{L} _\\.]+$/.test(name)) {
        return true;
    }
    return false;
}

// Manipulate the DOM
function changeUI() {
    //Show detected mood
    pageheader.html("Your mood is: ...");

    //Display song refresh button
    refreshbtn.css("display", "inline");

    //Remove offset at the top
    pagecontainer.css("marginTop", "20px");
};
function changeasdfUI() {
    document.write("Hello " + username);
}
function getRiotData(username){
    $.ajax({
        url: "https://"+region+".api.pvp.net/api/lol/"+region+"/v1.4/summoner/by-name/" +username+"?api_key="+key,
        
        type: "GET",
        data: Text,
        processData: true
    })
    .done(function(data){
        if(data.length != 0){
            var userData = data;
            callback(userData);
        } else {
            hey.innerHTML = "Summoner " + username + " was not found. Please check your username and region."
        }
    })
    .fail(function(error){
        hey.innerHTML = "Sorry, something went wrong. Try again later.";
        console.log(error.getAllResponseHeaders());
    });

    function callback(userData){

    }
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
go on msa and check
 */