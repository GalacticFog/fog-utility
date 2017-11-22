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
        message: "Select Org",
        valueKey: 'value',
        fields: ['description', 'properties.fqon', 'owner.name'],
        returnValue: "org",
        fetchFunction: () => {
            var res = gestalt.fetchOrgs();
            res.map(r => {
                // to be returned by selection
                r.value = {
                    id: r.id,
                    name: r.name,
                    description: r.description,
                    fqon: r.properties.fqon
                };
                r.fqon = r.properties.fqon
            });
            return sortBy(res, 'fqon');
        }
    };

    selectResource.run(options, answers => {
        gestalt.setCurrentOrg(answers);
        if (callback) callback(answers);
    });
}