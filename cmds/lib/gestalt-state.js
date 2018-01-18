// Gestalt stuff
const os = require('os');
const fs = require('fs');
const glob = require('glob');
const CONFIG_DIR = os.homedir() + '/.fog'

// Exports

exports.getConfigDir = getConfigDir;

exports.saveState = (s) => {
    let state = this.getState();
    Object.assign(state, s); // merge in state
    const contents = `${JSON.stringify(state, null, 2)}\n`;
    writeFile('state.json.cached', contents);
}

exports.setState = (s) => {
    const contents = `${JSON.stringify(s, null, 2)}\n`;
    writeFile('state.json.cached', contents);
}

exports.clearState = () => {
    const dir = getConfigDir();
    const f = `${dir}/state.json.cached`;
    if (fs.existsSync(f)) {
        fs.unlinkSync(f)
    }
}

exports.clearCachedFiles = () => {
    let files = glob.sync(`${CONFIG_DIR}/*.cached`);
    files.map(f => {
        fs.unlinkSync(f);
    });

    const dir = getConfigDir();
    files = glob.sync(`${dir}/*.cached`);
    files.map(f => {
        fs.unlinkSync(f);
    });
}

exports.getCachedAuthToken = () => {
    const dir = getConfigDir();
    return JSON.parse(fs.readFileSync(`${dir}/auth.json.cached`, 'utf8')).access_token;
}

exports.getCachedAuthUser = () => {
    const dir = getConfigDir();
    return JSON.parse(fs.readFileSync(`${dir}/auth.json.cached`, 'utf8')).username;
}

exports.clearAuthToken = () => {
    const dir = getConfigDir();
    const f = `${dir}/auth.json.cached`;
    if (fs.existsSync(f)) {
        fs.unlinkSync(f)
    }
}

exports.getConfig = getConfig;

exports.getState = () => {
    return getJsonFromFile("state.json.cached");
}

exports.saveAuthToken = (contents) => {
    writeFile('auth.json.cached', contents);
}

exports.loadConfigFile = (filename) => {
    const f = this.getConfigDir() + `/${filename}`;
    if (fs.existsSync(f)) {
        const contents = fs.readFileSync(f, 'utf8');
        return JSON.parse(contents);
    }
    throw new Error(`${f} not found`);
}

exports.saveConfig = (config) => {
    return saveConfigToFile('config.json', config);
}

// exports.saveConfigToFile = saveConfigToFile;

function saveConfigToFile(file, config) {
    const contents = `${JSON.stringify(config, null, 2)}\n`;
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR);
        console.log(`Created ${CONFIG_DIR}.`);
    }
    fs.writeFileSync(`${CONFIG_DIR}/${file}`, contents);
}

exports.fileExists = fileExists;
exports.writeFile = writeFile;

function fileExists(file) {
    const dir = getConfigDir();
    const f = `${dir}/${file}`;
    return fs.existsSync(f);
}

function writeFile(file, contents) {
    const dir = getConfigDir();
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(`Created ${dir}.`);
    }
    fs.writeFileSync(`${dir}/${file}`, contents);
}

function getJsonFromFile(file) {
    const dir = getConfigDir();
    const f = `${dir}/${file}`;
    if (fs.existsSync(f)) {
        const contents = fs.readFileSync(f, 'utf8');
        return JSON.parse(contents);
    }
    return {};
}

function getConfigDir() {
    let dir = getConfig().gestalt_url;
    if (dir.indexOf('://') > -1) {
        dir = String(dir).substring(dir.indexOf('://') + 3);
    }
    return `${CONFIG_DIR}/${dir}`;
}

exports.getConfigUrl = getConfigUrl;
function getConfigUrl() {
    return getConfig().gestalt_url;
}

function getConfig() {
    const file = 'config.json';
    const f = `${CONFIG_DIR}/${file}`;
    if (fs.existsSync(f)) {
        const contents = fs.readFileSync(f, 'utf8');
        return JSON.parse(contents);
    }
    // throw Error(`'${f}' not found`);
    // throw { message: `'${f}' not found` };
    return {};
}

// exports.getConfigFromFile = getConfigFromFile;

// function getConfigFromFile(file) {
//     const f = `${CONFIG_DIR}/${file}`;
//     if (fs.existsSync(f)) {
//         const contents = fs.readFileSync(f, 'utf8');
//         return JSON.parse(contents);
//     }
//     return {};
// }