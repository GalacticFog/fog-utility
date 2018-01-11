exports.command = 'all-workspaces'
exports.desc = 'List all workspaces'
exports.builder = {}
exports.handler = function (argv) {
    const gestalt = require('../lib/gestalt')
    const displayResource = require('../lib/displayResourceUI');

    const options = {
        message: "Workspaces",
        headers: ['Org', 'Description', 'Name', 'Owner'],
        fields: ['org.properties.fqon', 'description', 'name', 'owner.name'],
        // headers: ['Workspace', 'Name', 'Path', 'Owner'],
        // fields: ['description', 'name', 'path', 'owner.name'],
        sortField: 'org.properties.fqon',
    }

    try {
        let resources = [];
        gestalt.fetchOrgFqons().map(fqon => {
            console.error(`Fetching from ${fqon}...`)
            const res = gestalt.fetchWorkspaces([fqon]);
            resources = resources.concat(res);
        });

        resources.map(r => {
            r.path = `[${r.org.properties.fqon}] ${r.name}`
        })

        displayResource.run(options, resources);

    } catch (err) {
        console.log(err.message);
        console.log("Try running 'change-context'");
        console.log();
    }
}