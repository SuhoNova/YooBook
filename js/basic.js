// Get jquery objects from DOM

var imgSelector = $("#my-file-selector");
var refreshbtn = $("#refreshbtn");
var pageheader = $("#page-header");
var pagecontainer = $("#page-container");
var username = $("#username");

var searchbtn = $("#searchbtn");

searchbtn.on("click", function() {
    document.getElementById("hey").innerHTML = "Hello " ;
    alert("HEY" + username);
});


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
