const http = new XMLHttpRequest();
var intervalId;

function listenSync() {
    http.open("POST", "listen");
    http.send();
    http.onload = () => console.log("beep");
}

function djSync() {
    http.open("POST", "dj");
    http.send();
    http.onload = () => console.log("boop");
}

function SDJLstartListen() {
    clearInterval(intervalId);
    intervalId = setInterval(listenSync, 5000);
}

function SDJLstartDj() {
    clearInterval(intervalId);
    intervalId = setInterval(djSync, 5000);
}

function SDJLstop() {
    clearInterval(intervalId);
}
