const request = require('request-promise-native');
const gestaltSession = require('../gestalt-session');
const querystring = require('querystring');
const { isJsonString } = require('../helpers')
const { debug } = require('../debug');

exports.login = async function (creds) {
    gestaltSession.clearSessionData();

    const auth = await authenticate(creds); // Could throw error

    // Clear the current context
    gestaltSession.clearSessionData();
    gestaltSession.saveAuthData(auth);

    return { username: auth.username };
}

// exports.logout = function() {
//     gestaltSession.clearSessionData();
// }

function getSecurityUrl() {
    const config = gestaltSession.getSessionConfig();
    if (config['security_url']) {
        return config['security_url']
    }

    if (config['gestalt_url']) {
        return config['gestalt_url'] + '/security';
    }

    throw Error(`No security URL present in config`)
}

async function authenticate(creds) {
    const url = '/root/oauth/issue';

    const username = creds['username'];
    const password = creds['password'];

    if (!username) throw Error("Username missing from creds");
    if (!password) throw Error("Password missing from creds");

    const postData = querystring.stringify({
        grant_type: "password",
        username: username,
        password: password
    });

    const security_url = getSecurityUrl();

    debug(`${security_url}${url}`);

    { // Scope block
        const debugPostData = querystring.parse(postData);
        debugPostData.password = '******';
        debug(querystring.stringify(debugPostData));
    }

    try {

        const body = await request({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            },
            body: postData,
            method: 'POST',
            uri: `${security_url}${url}`
        });

        const auth = JSON.parse(body); // JSON.parse(String(res.getBody()));

        debug('Response:');
        debug(auth);

        // Enhance payload with username
        auth.username = username;
        auth.timestamp = new Date();
        auth.expiration = new Date(Date.now() + auth.expires_in * 1000);

        return auth;

    } catch (res) {
        if (res.response && res.response.body) {
            const error = res.response.body;
            if (isJsonString(error)) throw JSON.parse(error);
            throw error;
        } else {
            throw res;
        }
    }
}