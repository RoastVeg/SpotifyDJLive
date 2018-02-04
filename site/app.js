var async       = require('async');
var querystring = require('querystring');
var request     = require('request');

const SPOTIFY_CLIENT_ID = '33148af9475e489393ea51a5221dc6dd';
const SPOTIFY_CLIENT_SECRET = 'ad6063329f8046df9709f8ca6c87f791';
const SPOTIFY_REDIRECT_URI = 'http://localhost:8080/login-callback';
const SPOTIFY_SCOPE = 'user-read-playback-state user-modify-playback-state';

var spotify_tokens = { };
var dj_info = {};

module.exports = {
    login,
    logout,
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
    const state = randomString(16);

    resp.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id:     SPOTIFY_CLIENT_ID,
        scope:         SPOTIFY_SCOPE,
        redirect_uri:  SPOTIFY_REDIRECT_URI,
        state:         state
    }));
}
function logout(req, resp) {
    resp.redirect('https://spotify.com/logout');
}

function loginCallback(req, resp) {
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
        resp.cookie('access_token', body.access_token);
        resp.redirect('/room');
    });
}

function room(req, resp) {
    resp.sendFile("views/room.html", {root: __dirname});
}

function dj(req, resp) {
    const options = {
        url: 'https://api.spotify.com/v1/me/player',
        headers: {
            'Authorization': 'Bearer ' + req.query.access_token,
        },
    };

    request.get(options, function(error, response, body){
        if (body !== '') {
            dj_info = JSON.parse(body);
        }
    });

    resp.sendStatus(200);
    resp.end();
}

function listen(req, resp) {
    if (dj_info['item'] === undefined) {
        return;
    }

    const playOptions = {
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
            'Authorization': 'Bearer ' + req.query.access_token,
        },
        body: {
            'uris': [dj_info['item']['uri']],
        },
        json: true
    };

    const playerOptions = {
        url: 'https://api.spotify.com/v1/me/player',
        headers: {
            'Authorization': 'Bearer ' + req.query.access_token,
        },
        json: true,
    };

    request.get(playerOptions, function(player_error, player_response, player_body) {
        if (player_body === '' || player_body === undefined) {
            return ;
        }

        const seekOptions = {
            url: 'https://api.spotify.com/v1/me/player/seek?position_ms=' + dj_info['progress_ms'],
            headers: {
                'Authorization': 'Bearer ' + req.query.access_token,
            },
            body: {
                'device_ids': [player_body['device']['id']],
                'position_ms': dj_info['progress_ms'],
            },
            json: true
        }; 

        // Pause/Play with the DJ
        if (player_body['is_playing'] !== dj_info['is_playing']) {

            // DJ is paused
            if (dj_info['is_playing'] === false) {
                const pauseOptions = {
                    url: 'https://api.spotify.com/v1/me/player/pause',
                    headers: {
                        'Authorization': 'Bearer ' + req.query.access_token,
                    },
                    body: {
                        'device_ids': [player_body['device']['id']],
                    },
                    json: true,
                };

                request.put(pauseOptions, (error, response, body) => {
                    request.put(seekOptions);
                    return;
                });
            }

            // DJ is playing
            else if (dj_info['is_playing'] === true) {
                request.put(playOptions, () => {
                    request.put(seekOptions);
                });

                return;
            }
        }

        const listenerProgress = player_body['progress_ms'];
        const djProgress = dj_info['progress_ms'];

        if (player_body['item']['uri'] !== dj_info['item']['uri']) {
            request.put(playOptions, () => {
                request.put(seekOptions);
            });
        } else {
            if (Math.abs(listenerProgress - djProgress) >= 10000) {
                request.put(seekOptions);
            }
        }
    });

    resp.end();
}
