import express from "express"
import request from "request"
import dotenv from "dotenv"

const port = 5000

global.access_token = ''
global.refresh_token = ''
global.expires_in = 0

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var spotify_redirect_uri = 'http://localhost:5173/auth/callback'

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.get('/auth/login', (req, res) => {
  console.log("attempting to login...")
  var scope = "streaming user-read-email user-read-private user-modify-playback-state"
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  })

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.get('/auth/callback', (req, res) => {
  console.log('redirecting back to infotainment!')
  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body.access_token, '\n', body.refresh_token, '\n', body.expires_in, '\n', body.scope)
      global.access_token = body.access_token;
      global.refresh_token = body.refresh_token;
      global.expires_in = body.expires_in
      res.redirect('/')
    }
    else {
        console.log(error);
    }
  });

})

app.get('/auth/token', (req, res) => {
  res.json({ 
    access_token: global.access_token,
    refresh_token: global.refresh_token,
    expires_in: global.expires_in
  })
})

app.get('/auth/refresh-token', (req, res) => {
  console.log('refreshing tokens')
  // console.log(refresh_token)
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: global.refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      global.access_token = body.access_token,
      global.refresh_token = body.refresh_token || global.refresh_token;
      // console.log(access_token)
      res.send({
        'access_token': global.access_token,
        'refresh_token': global.refresh_token
      });
    }
    else {
      console.log(`status code ${response.code}, error ${error}, response ${body}`)
    }
  });
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})