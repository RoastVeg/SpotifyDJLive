const SPOTIFY_CLIENT_ID = '33148af9475e489393ea51a5221dc6dd';
const SPOTIFY_CLIENT_SECRET = 'ad6063329f8046df9709f8ca6c87f791';
const SPOTIFY_SCOPE = '';

function dj(req, resp) {
    resp.write('<p>Hello, DJ!</p>');
    resp.end();
}

function listen(req, resp) {
    resp.write('<p>Hello, listener!</p>');
    resp.end();
}

module.exports = {
    dj,
    listen,
};
