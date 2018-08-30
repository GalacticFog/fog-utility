const gestalt = require('../lib/gestalt')
const cmd = require('../lib/cmd-base');
const out = console.log;
const util = require('../lib/util');
const { debug } = require('../lib/debug');
const { directorySchema } = require('../../schemas');
const security = require('../lib/gestalt/securityclient');

exports.command = 'delete-directory [name]';
exports.description = 'Delete LDAP directory';

exports.builder = {
    name: {
        description: 'Directory name to delete',
        required: true
    },

    org: {
        definition: 'Org to create directory against',
        required: true
    }
}

exports.handler = cmd.handler(async function (argv) {
    const fqon = argv.org;
    const name = argv.name;

    const directories = await security.GET(`/${fqon}/directories`);
    const directory = directories.find(d => d.name == name);
    if (directory) {
        const response = await security.DELETE(`/directories/${directory.id}`);
        debug(response);
        out(`Deleted directory '${directory.name}' (${directory.id})`);    
    } else {
        throw Error(`Directory '${name}' not found in '${fqon}' org`);
    }
});
