exports.command = 'group-members'
exports.desc = 'List group members'
exports.builder = {}
exports.handler = function (argv) {
    const gestalt = require('../lib/gestalt')
    const chalk = require('chalk')

    function sortBy(arr, key) {
        return arr.sort((a, b) => {
            if (a[key] < b[key]) { return -1; }
            if (a[key] > b[key]) { return 1; }
            return 0;
        })
    }

    try {
        let resources = gestalt.fetchGroups();

        resources = sortBy(resources, 'name');

        console.log();
        resources.map(group => {

            group.properties.users = sortBy(group.properties.users, 'name');

            console.log(chalk.underline(group.name));
            console.log();
            group.properties.users.map(user => {
                console.log("    " + user.name);
            })
            console.log();
        })

    } catch (err) {
        console.log(err.message);
        console.log("Try running 'change-context'");
        console.log();
    }
}