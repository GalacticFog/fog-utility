exports.command = 'org-lambdas'
exports.desc = 'List org lambdas'
exports.builder = {}
exports.handler = function (argv) {
    const gestalt = require('../lib/gestalt')
    const displayResource = require('../lib/displayResourceUI');
    const selectHierarchy = require('../lib/selectHierarchy');

    selectHierarchy.resolveOrg(() => {

        const options = {
            message: "Lambdas",
            headers: ['Lambda', 'Runtime', 'Public', 'FQON', 'Type', 'Owner', 'ID'],
            fields: ['name', 'properties.runtime', 'properties.public', 'org.properties.fqon', 'properties.code_type', 'owner.name', 'id'],
            sortField: 'description',
        }

        try {

            const resources = gestalt.fetchOrgLambdas();
            // console.log(JSON.stringify(resources, null, 2))
            resources.map(item => {
                //
            })

            // console.log(JSON.stringify(resources, null, 2))

            displayResource.run(options, resources);
        } catch (err) {
            console.log(err.message);
            console.log("Try running 'change-context'");
            console.log();
        }
    });
}