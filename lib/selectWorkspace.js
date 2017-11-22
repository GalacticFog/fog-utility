#!/usr/bin/env node
exports.run = (callback) => {
    const argv = require('yargs').argv
    const gestalt = require('./gestalt')
    const selectResource = require('./selectResourceUI');

    selectResource.mode = 'autocomplete';

    function sortBy(arr, key) {
        return arr.sort((a, b) => {
            if (a[key] < b[key]) { return -1; }
            if (a[key] > b[key]) { return 1; }
            return 0;
        })
    }

    const options = {
        message: "Select Workspace",
        valueKey: 'value',
        fields: ['description', 'name', 'fqon', 'owner.name'],
        returnValue: "workspace",
        fetchFunction: () => {
            var res = gestalt.fetchWorkspaces([gestalt.getState().org.fqon]);

            // decorate items
            res.map(r => {
                // to be returned by selection
                r.value = {
                    id: r.id,
                    name: r.name,
                    description: r.description
                };

                // alter for display
                r.fqon = r.org.properties.fqon;
                r.name = `${r.name}`;
            });
            return sortBy(res, 'description');
        }
    };

    selectResource.run(options, answers => {
        gestalt.setCurrentWorkspace(answers);
        if (callback) callback(answers);
    });
}