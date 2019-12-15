/* eslint-disable import/no-dynamic-require, camelcase */
const request = require('request');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { TARGET_BROWSER } = process.env;
const manifest = require(`../../lib/${TARGET_BROWSER}/manifest.json`);
switch (TARGET_BROWSER) {
    case 'firefox': {
        publishFirefox();
        break;
    }
    case 'chrome': {
        publishCrhome();
        break;
    }
    default:
        throw new Error(`[publish] Cant publish target \`${TARGET_BROWSER}\``);
}
function publishFirefox() {
    const { MOZ_API_JWT_ISSUER, MOZ_API_JWT_SECRET } = process.env;
    const issuedAt = Math.floor(Date.now() / 1000);
    const token = jwt.sign({
        iss: MOZ_API_JWT_ISSUER,
        jti: Math.random().toString(),
        iat: issuedAt,
        exp: issuedAt + 60,
    }, MOZ_API_JWT_SECRET, { algorithm: 'HS256' });
    const id = manifest.applications.gecko.id;
    const version = manifest.version;
    request({
        url: `https://addons.mozilla.org/api/v3/addons/${id}/versions/${version}/`,
        method: 'PUT',
        headers: { Authorization: `JWT ${token}` },
        formData: { upload: fs.createReadStream(`./lib/${TARGET_BROWSER}.zip`) },
    }, (error, response, body) => {
        if (error) {
            throw error;
        }
        const r = JSON.parse(body);
        if (r.error) {
            throw r.error;
        }
        console.log('Firefox published', JSON.stringify(r)); // eslint-disable-line no-console
    });
}
function publishCrhome(target = 'default') {
    const { GAPI_MOBX_EXTENSION_CLIENT_ID, GAPI_MOBX_EXTENSION_CLIENT_SECRET, GAPI_MOBX_EXTENSION_REFRESH_TOKEN, } = process.env;
    const id = 'pfgnfdagidkfgccljigdamigbcnndkod';
    let headers;
    const handlePublishResponse = (err, response, body) => {
        if (err) {
            throw err;
        }
        const { error, statusDetail } = JSON.parse(body);
        if (error) {
            console.log({ error });
            throw error;
        }
        console.log('Chrome published', statusDetail); // eslint-disable-line no-console
    };
    const handleUploadResponse = (err, response, body) => {
        if (err) {
            throw err;
        }
        const { error, uploadState } = JSON.parse(body);
        if (error) {
            throw error;
        }
        if (uploadState !== 'SUCCESS')
            throw new Error(`uploadState: \`${uploadState}\` !== SUCCESS ${body}`);
        request({
            url: `https://www.googleapis.com/chromewebstore/v1.1/items/${id}/publish?publishTarget=${target}`,
            method: 'POST',
            headers,
        }, handlePublishResponse);
    };
    const handleAuthResponse = (err, response, body) => {
        if (err) {
            throw err;
        }
        const { error, access_token, token_type } = JSON.parse(body);
        if (error) {
            throw error;
        }
        headers = { Authorization: `${token_type} ${access_token}`, 'x-goog-api-version': '2' };
        fs.createReadStream(`./lib/${TARGET_BROWSER}.zip`).pipe(request({
            url: `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${id}`,
            method: 'PUT',
            headers,
        }, handleUploadResponse));
    };
    request({
        url: 'https://www.googleapis.com/oauth2/v4/token',
        method: 'POST',
        form: {
            client_id: GAPI_MOBX_EXTENSION_CLIENT_ID,
            client_secret: GAPI_MOBX_EXTENSION_CLIENT_SECRET,
            refresh_token: GAPI_MOBX_EXTENSION_REFRESH_TOKEN,
            grant_type: 'refresh_token',
        },
    }, handleAuthResponse);
}
// request({
//   url: `https://accounts.google.com/o/oauth2/token`,
//   method: 'POST',
//   form: {
//     client_id: GAPI_MOBX_EXTENSION_CLIENT_ID,
//     client_secret: GAPI_MOBX_EXTENSION_CLIENT_SECRET,
//     code: GAPI_MOBX_EXTENSION_CLIENT_AUTH_CODE,
//     grant_type: 'authorization_code',
//     redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
//   }
// }, (err, response, body) => {
//   if (err) {
//     throw err;
//   }
//   const {error, refresh_token, access_token, expires_in, token_type} = JSON.parse(body);
//   if (error) {
//     throw error;
//   }
//   console.log({error, refresh_token, access_token, expires_in, token_type})
// });
