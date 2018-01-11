exports.command = 'org-containers'
exports.desc = 'List org containers'
exports.builder = {}
exports.handler = function (argv) {
    const gestalt = require('../lib/gestalt')
    const displayResource = require('../lib/displayResourceUI');
    const selectHierarchy = require('../lib/selectHierarchy');

    selectHierarchy.resolveOrg(() => {
        try {
            let allContainers = [];

            const fqon = gestalt.getCurrentOrg().fqon;

            const envs = gestalt.fetchOrgEnvironments([fqon]);
            envs.map(env => {
                console.log(`Fetching containers from ${fqon}/'${env.name}'`);
                const state = {
                    org: {
                        fqon: fqon
                    },
                    environment: {
                        id: env.id
                    }
                }
                const containers = gestalt.fetchContainers(state);

                containers.map(item => {
                    item.env = { name: env.name };
                    item.fqon = fqon;
                    item.running_instances = `${item.properties.tasks_running} / ${item.properties.num_instances}`;
                });

                allContainers = allContainers.concat(containers);
            });

            displayContainers(allContainers);

        } catch (err) {
            console.log(err.message);
            console.log("Try running 'change-context'");
            console.log();
        }

        function displayContainers(containers) {
            const options = {
                message: "Containers",
                headers: ['Container', 'Description', 'Status', /*'Image',*/ 'Instances', 'Owner', 'FQON', 'ENV'],
                fields: ['name', 'description', 'properties.status', /*'properties.image',*/ 'running_instances', 'owner.name', 'org.properties.fqon', 'env.name'],
                sortField: 'org.properties.fqon',
            }

            displayResource.run(options, containers);
        }
    });
}