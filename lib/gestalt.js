// Gestalt stuff
const request = require('sync-request');
const querystring = require('querystring');
const gestaltState = require('./gestalt-state');

// Exports

exports.fetchOrgFqons = () => {
    const res = meta_GET('/orgs?expand=true');
    const list = res.map(item => item.properties.fqon).sort();
    return list;
}

exports.fetchOrgs = () => {
    return meta_GET('/orgs?expand=true');
}

exports.fetchWorkspaces = (fqonList) => {
    if (!fqonList) fqonList = [getGestaltState().org.fqon];

    let workspaces = fqonList.map(fqon => {
        const res = meta_GET(`/${fqon}/workspaces?expand=true`)
        return res;
    });

    workspaces = [].concat.apply([], workspaces); // flatten array

    // console.log(workspaces);
    return workspaces;
}

exports.fetchEnvironments = () => {
    const state = getGestaltState();
    if (!state.org) throw Error("No Org in current context");
    if (!state.org.fqon) throw Error("No FQON in current context");
    if (!state.workspace) throw Error("No Workspace in current context");
    if (!state.workspace.id) throw Error("No Workspace ID in current context");
    
    return meta_GET(`/${state.org.fqon}/workspaces/${state.workspace.id}/environments?expand=true`)
}

exports.fetchOrgEnvironments = (fqonList) => {
    if (!fqonList) fqonList = [getGestaltState().org.fqon];

    let envs = fqonList.map(fqon => {
        const res = meta_GET(`/${fqon}/environments?expand=true`)
        return res;
    });

    envs = [].concat.apply([], envs); // flatten array

    // console.log(workspaces);
    return envs;
}

exports.getEnvironment = (uid) => {
    const state = getGestaltState();
    if (!state.org) throw Error("No Org in current context");
    if (!state.org.fqon) throw Error("No FQON in current context");
    return meta_GET(`/${state.org.fqon}/environments/${uid}`)
}

exports.setCurrentWorkspace = (s) => {
    if (!s.workspace) throw Error("Workspace not specified")
    if (!s.workspace.id) throw Error("Workspace ID not specified")

    const state = getGestaltState();
    Object.assign(state, s); // merge in state
   
    delete state.environment;
    delete state.container; 

    gestaltState.setState(state);
}

exports.setCurrentEnvironment = (s) => {
    if (!s.environment) throw Error("Environment not specified")
    if (!s.environment.id) throw Error("Environment ID not specified")
    
    const state = getGestaltState();
    Object.assign(state, s); // merge in state
   
    delete state.container; 

    gestaltState.setState(state);
}

exports.setCurrentContainer = (s) => {
    if (!s.container) throw Error("Container not specified")
    if (!s.container.id) throw Error("Container ID not specified")
    
    const state = getGestaltState();
    Object.assign(state, s); // merge in state
   
    gestaltState.setState(state);
}


exports.setCurrentOrg = (s) => {
    if (!s.org) throw Error("Org not specified")
    if (!s.org.fqon) throw Error("Org fqon not specified")
    
    const state = getGestaltState();
    Object.assign(state, s); // merge in state
   
    delete state.Workspace;
    delete state.environment;
    delete state.container; 

    gestaltState.setState(state);
}

exports.getCurrentWorkspace = () => {
    return getGestaltState().workspace;
}

exports.getCurrentEnvironment = () => {
    return getGestaltState().environment;
}

exports.getCurrentOrg = () => {
    return getGestaltState().org;
}

exports.getState = () => {
    // returns a copy of the writen state    
    return getGestaltState();
}

exports.fetchContainers = () => {
    return fetchType('containers');
}

exports.fetchOrgContainers = (fqon) => {
    const state = getGestaltState();
    if (!fqon) fqon = state.org.fqon; // default
    return meta_GET(`/${fqon}/containers`)
}

exports.fetchLambdas = () => {
    return fetchType('lambdas');
}

exports.fetchApis = () => {
    return fetchType('apis');
}

exports.fetchPolicies = () => {
    return fetchType('policies');
}

function fetchType(type) {
    const state = getGestaltState();
    if (!state.org) throw Error("No Org in current context");
    if (!state.org.fqon) throw Error("No FQON in current context");
    if (!state.environment) throw Error("No Workspace in current context");
    if (!state.environment.id) throw Error("No Workspace ID in current context");
    if (!type) throw Error("Type not specified");
    return meta_GET(`/${state.org.fqon}/environments/${state.environment.id}/${type}?expand=true`)
}

exports.getContainer = (uid) => {
    const state = getGestaltState();
    if (!state.org) throw Error("No Org in current context");
    if (!state.org.fqon) throw Error("No FQON in current context");
    if (!uid) throw Error("Container UID not specified");
    const res = meta_GET(`/${state.org.fqon}/containers/${uid}`)
    return res;
}

exports.fetchContainer = () => {
    const state = getGestaltState();
    if (!state.org) throw Error("No Org in current context");
    if (!state.org.fqon) throw Error("No FQON in current context");
    if (!state.container) throw Error("No Container in current context");
    if (!state.container.id) throw Error("No Container ID in current context");
    const res = meta_GET(`/${state.org.fqon}/containers/${state.container.id}`)
    return res;
}

exports.fetchOrgEntitlements = () => {
    const state = getGestaltState();
    if (!state.org) throw Error("No Org in current context");
    if (!state.org.fqon) throw Error("No FQON in current context");
    const res = meta_GET(`/${state.org.fqon}/entitlements?expand=true`)
    return res;
}

exports.fetchWorkspaceEntitlements = () => {
    const state = getGestaltState();
    if (!state.org) throw Error("No Org in current context");
    if (!state.org.fqon) throw Error("No FQON in current context");
    if (!state.workspace) throw Error("No Workspace in current context");
    if (!state.workspace.id) throw Error("No Workspace ID in current context");
    const res = meta_GET(`/${state.org.fqon}/workspaces/${state.workspace.id}/entitlements?expand=true`)
    return res;
}

exports.fetchEnvironmentEntitlements = () => {
    const state = getGestaltState();
    if (!state.org) throw Error("No Org in current context");
    if (!state.org.fqon) throw Error("No FQON in current context");
    if (!state.environment) throw Error("No Workspace in current context");
    if (!state.environment.id) throw Error("No Workspace ID in current context");
    const res = meta_GET(`/${state.org.fqon}/environments/${state.environment.id}/entitlements?expand=true`)
    return res;  
}


exports.authenticate = () => {//(username, password) => {

    const security_url = getGestaltConfig()['gestalt_url'] + '/security';
    const url = '/root/oauth/issue';

    const username = getGestaltConfig()['username'];
    const password = getGestaltConfig()['password'];

    if (!username) throw Error("Username missing from config");
    if (!password) throw Error("Password missing from config");

    const postData = querystring.stringify({
        grant_type: "password",
        username: username,
        password: password
    });

    const res = request('POST', `${security_url}${url}`, {

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        },

        body: postData
    });

    if (res.statusCode == 200) {
        const auth = JSON.parse(String(res.getBody()));

        const contents = `${JSON.stringify(auth, null, 2)}\n`;

        gestaltState.saveAuthToken(contents);

    } else {
        console.error(`Authentication to ${security_url} didn't succeed.  Response: ${res}`);
        console.error('|' + res.statusCode + '|');
        console.error(res.getBody());
    }
}


// Functions

function meta_GET(url, opts) {
    const token = getCachedAuthToken();
    const options = Object.assign({ headers: { Authorization: `Bearer ${token}` } }, opts); // merge in user specified options
    const meta_url = getGestaltConfig()['gestalt_url'] + '/meta';

    const res = request('GET', `${meta_url}${url}`, options);
    return JSON.parse(res.getBody());
}


// Internal State functions 

function getCachedAuthToken() {
    return gestaltState.getCachedAuthToken();
}

function getGestaltConfig() {
    return gestaltState.getConfig();
}

function getGestaltState() {
    return gestaltState.getState();
}

