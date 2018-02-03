var querystring = require('querystring');
var request     = require('request');

const SPOTIFY_CLIENT_ID = '33148af9475e489393ea51a5221dc6dd';
const SPOTIFY_CLIENT_SECRET = 'ad6063329f8046df9709f8ca6c87f791';
const SPOTIFY_REDIRECT_URI = 'http://localhost:8080/login-callback';
const SPOTIFY_SCOPE = '';

var spotify_tokens = { };

module.exports = {
    login,
    loginCallback,
    room,
    dj,
    listen,
};

function randomString(length) {
    var text    = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var ii = 0; ii < length; ii++)
        text = text + charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

function login(req, resp) {
    console.log(req.url);

    const state = randomString(16);

    resp.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id:     SPOTIFY_CLIENT_ID,
        scope:         SPOTIFY_SCOPE,
        redirect_uri:  SPOTIFY_REDIRECT_URI,
        state:         state
    }));
}

function loginCallback(req, resp) {
    console.log(req.url);

    const authOptions = {
        url:  'https://accounts.spotify.com/api/token',
        form: {
            code: req.query.code,
            redirect_uri: SPOTIFY_REDIRECT_URI,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function(error, respTokens, body) {
        spotify_tokens.access_token = body.access_token;
        spotify_tokens.refresh_token = body.refresh_token;

        resp.redirect('/room');
    });
}

function room(req, resp) {
    console.log(req.url);

    resp.write('<p>Welcome to the room!<p>');
    resp.end();
}

function dj(req, resp) {
    console.log(req.url);    

    resp.write('<p>Hello, DJ!</p>');
    resp.end();
}

function listen(req, resp) {
    console.log(req.url);    

    resp.write('<p>Hello, listener!</p>');
    resp.end();
}
