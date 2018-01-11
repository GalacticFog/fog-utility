exports.command = 'all-environments'
exports.desc = 'List all enviornments'
exports.builder = {}
exports.handler = function (argv) {
    const gestalt = require('../lib/gestalt')
    const displayResource = require('../lib/displayResourceUI');

    const options = {
        message: "Environments",
        headers: ['Description', 'Name', 'Org', 'Type', 'Workspace', 'Owner'],
        fields: ['description', 'name', 'org.properties.fqon', 'properties.environment_type', 'properties.workspace.name', 'owner.name'],
        sortField: 'description',
    }

    try {
        let resources = [];
        gestalt.fetchOrgFqons().map(fqon => {

            console.error(`Fetching from ${fqon}...`)

            const res = gestalt.fetchOrgEnvironments([fqon]);

            resources = resources.concat(res);

        });
        displayResource.run(options, resources);

    } catch (err) {
        console.log(err.message);
        console.log("Try running 'change-context'");
        console.log();
    }
}