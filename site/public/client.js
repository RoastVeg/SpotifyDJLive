const http = new XMLHttpRequest();
var intervalId;
var access_token = getCookie("access_token");
var playWindow = window.open("https://play.spotify.com", "_blank");
playWindow.blur();
window.focus();

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function listenSync() {
    http.open("POST", "listen?access_token=" + access_token);
    http.send();
    http.onload = () => console.log("beep");
}

function djSync() {
    http.open("POST", "dj?access_token=" + access_token);
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
