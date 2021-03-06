const { meta } = require('gestalt-fog-sdk');
const cmd = require('../lib/cmd-base');
const util = require('../lib/util');


exports.command = 'update-license [file]'
exports.desc = 'Update Gestalt license'
exports.builder = {
    file: {
        alias: 'f',
        description: 'resource definition file',
    }
}

exports.handler = cmd.handler(async function (argv) {
    if (!argv.file) {
        throw Error('missing --file parameter');
    }

    console.log('Loading license from file...');
    // const data = util.readFileAsText(argv.file);

    // const spec = {
    //     "name": "Default-License-1",
    //     "description": "Default GF license",
    //     "properties": {
    //         "data": data
    //     }
    // }

    const spec = util.loadObjectFromFile(argv.file);

    const res = await meta.POST('/root/licenses', spec);
    console.log("Gestalt Platform license updated.")
});
