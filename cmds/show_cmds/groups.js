exports.command = 'groups'
exports.desc = 'List groups'
exports.builder = {}
exports.handler = function (argv) {
    const gestalt = require('../lib/gestalt')
    const displayResource = require('../lib/displayResourceUI');
    const chalk = require('chalk')

    const options = {
        message: "Groups",
        headers: ['UID', 'Group', 'Description', 'Org', 'Owner' /*'Created'*/],
        fields: ['id', 'name', 'description', 'org.properties.fqon', 'owner.name' /*'created.timestamp'*/],
        sortField: 'name',
    }

    try {
        const resources = gestalt.fetchGroups();

        // console.log(JSON.stringify(resources, null, 2))

        displayResource.run(options, resources);
    } catch (err) {
        console.log(err.message);
        console.log("Try running 'change-context'");
        console.log();
    }
}