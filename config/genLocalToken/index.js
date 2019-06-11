const request = require('request');
const process = require('process');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../');
const configFilePath = root + '/src/config.json';
const configFile = require(configFilePath);

// Request option constants
const tokenGenerateUrl = configFile.apiGatewayEndpoint;
const urlTail = 'v1/reb2-oauth2-facade/access-token-jwt';
const strictSSLVal = false;
const authorizationVal = 'Basic TXhsMUpNRE5qRjZTRDR6TnZaalhTb0JGalZOeEZ2UFE6MUVvblpFUzF0OVNzSU1BZg==';

// Request body for token call
const requestPayload = {
  // client_id: 'zTkFLIhIYhmtPt3IuMVsP5wEGfZ9zkx0',
  grant_type: 'client_credentials',
  repNTId: process.env.npm_config_ntid || 'manretail'
};

// Update the token to config.json
function updateToken(token) {
  const tokenWithPrefix = 'Bearer ' + token;
  configFile.token = tokenWithPrefix;
  fs.writeFile(configFilePath, JSON.stringify(configFile, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('Updated token ' + tokenWithPrefix);
  });
}

// Option object for the token generation request
const options = {
  strictSSL: strictSSLVal,
  url: tokenGenerateUrl + urlTail,
  body: requestPayload,
  json: true,
  method: 'POST',
  headers: {
    'authorization': authorizationVal,
    'channelid': process.env.npm_config_channel,
    'applicationId': 'REBELLION',
    'senderId': 'TMO',
    'activityId': 'dummy_activity_id_for_manual_token_call'
  }
};

// Callback for the token generation request
function callback(error, response, body) {
  if (body && body.access_token && !error && response.statusCode == 200) {
    console.log('JWT Token \n', body.access_token);
    // updateToken(info.access_token)
  } else {
    console.log('Issue in token generation response', error);
  }
}

// Token generation request call
request(options, callback);
