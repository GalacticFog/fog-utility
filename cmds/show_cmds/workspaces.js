exports.command = 'workspaces'
exports.desc = 'List workspaces'
exports.builder = {}
exports.handler = function (argv) {
    const gestalt = require('../lib/gestalt')
    const displayResource = require('../lib/displayResourceUI');
    const selectHierarchy = require('../lib/selectHierarchy');

    selectHierarchy.resolveOrg(() => {

        const options = {
            message: "Workspaces",
            headers: ['Workspace', 'Name', 'Org', 'Owner'],
            fields: ['description', 'name', 'org.properties.fqon', 'owner.name'],
            sortField: 'description',
        }

        try {
            const fqon = gestalt.getState().org.fqon;

            const resources = gestalt.fetchWorkspaces([fqon]);

            // console.log(JSON.stringify(resources, null, 2))

            displayResource.run(options, resources);
        } catch (err) {
            console.log(err.message);
            console.log("Try running 'change-context'");
            console.log();
        }
    });
}