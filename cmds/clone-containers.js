exports.command = 'clone-containers'
exports.desc = 'Clone containers'
exports.builder = {}
exports.handler = function (argv) {

    const selectProvider = require('./lib/selectProvider');
    const selectEnvironment = require('./lib/selectEnvironment');
    const selectContainer = require('./lib/selectContainer');
    const gestalt = require('./lib/gestalt');
    const chalk = require('chalk');
    const selectHierarchy = require('./lib/selectHierarchy');

    selectHierarchy.resolveWorkspace(() => {

        console.log();
        console.log(chalk.bold('Clone containers from one environment to another'));
        console.log();
        console.log("Select source environment");
        console.log();
        selectEnvironment.run({}, (sourceEnv) => {
            console.log();

            gestalt.setCurrentEnvironment(sourceEnv);

            const containers = gestalt.fetchContainers();

            console.log("Select containers to clone (use arrows and spacebar to modify selection)");
            console.log();

            selectContainer.run({ mode: 'checkbox', defaultChecked: true }, (selectedContainers) => {
                console.log();

                console.log("Select target environment to clone containers to")
                console.log();

                selectEnvironment.run({}, (targetEnv) => {
                    console.log();

                    // Ensure different environments were used
                    if (sourceEnv.id == targetEnv.id) {
                        console.log("Aborting - can't use the same source and destination enviornment");
                        return;
                    }

                    gestalt.setCurrentEnvironment(targetEnv);

                    const state = gestalt.getState();

                    console.log("Containers will be created in the following location:");
                    console.log();
                    console.log('    Org:         ' + chalk.bold(`${state.org.description} (${state.org.fqon})`));
                    console.log('    Workspace:   ' + chalk.bold(`${state.workspace.description} (${state.workspace.name})`));
                    console.log('    Environment: ' + chalk.bold(`${state.environment.description} (${state.environment.name})`));
                    // console.log('    Provider:    ' + chalk.bold(`${provider.description} (${provider.name})`));
                    console.log();

                    displayRunningContainers(selectedContainers);

                    doConfirm(confirmed => {
                        if (!confirmed) {
                            console.log('Aborted.');
                            return;
                        }

                        const createdContainers = selectedContainers.map(item => {
                            console.log(`Creating container ${item.name}`);
                            const c = cloneContainerPayload(item);
                            const container = gestalt.createContainer(c, state);
                            return container;
                        });

                        displayRunningContainers(createdContainers);
                        console.log('Done.');
                    });
                });
            });
        });
    });

    function cloneContainerPayload(src) {
        let op = src.properties;
        return {
            name: src.name,
            description: src.description,
            properties: {
                provider: {
                    id: op.provider.id
                },
                num_instances: op.num_instances,
                cpus: op.cpus,
                memory: op.memory,
                disk: op.disk,
                container_type: op.container_type,
                image: op.image,
                network: op.network,
                health_checks: op.health_checks ? op.health_checks : [],
                port_mappings: op.port_mappings ? op.port_mappings : [],
                labels: op.labels ? op.labels : {},
                env: op.env ? op.env : {},
                volumes: op.volumes ? op.volumes : [],
                force_pull: op.force_pull ? op.force_pull : false,
                constraints: op.constraints ? op.constraints : [],
                accepted_resource_roles: op.accepted_resource_roles ? op.accepted_resource_roles : [],
                args: op.args,
                cmd: op.cmd,
                user: op.user
            }
        }
    }

    function displayRunningContainers(containers) {

        const displayResource = require('./lib/displayResourceUI');

        const options = {
            message: "Containers",
            headers: ['Container', 'Description', 'Status', 'Image', 'Instances', 'Owner'],
            fields: ['name', 'description', 'properties.status', 'properties.image', 'running_instances', 'owner.name'],
            sortField: 'description',
        }

        containers.map(item => {
            item.running_instances = `${item.properties.tasks_running} / ${item.properties.num_instances}`
        })

        displayResource.run(options, containers);
    }


    function doConfirm(callback) {
        const inquirer = require('inquirer');
        const questions = [
            {
                message: "Proceed?",
                type: 'confirm',
                name: 'confirm',
                default: false // Don't proceed if no user input
            },
        ];

        inquirer.prompt(questions).then(answers => {
            callback(answers.confirm);
        });
    }
}