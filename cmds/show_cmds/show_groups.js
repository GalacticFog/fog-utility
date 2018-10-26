const gestalt = require('../lib/gestalt')
const ui = require('../lib/gestalt-ui')
const cmd = require('../lib/cmd-base');
exports.command = 'groups'
exports.desc = 'List groups'
exports.builder = {}
exports.handler = cmd.handler(async function (argv) {
    const resources = await gestalt.fetchGroups();
    ui.displayResources(resources, argv);
});