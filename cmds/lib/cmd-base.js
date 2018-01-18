const state = {};

exports.handler = function (main) {
    return function (argv) {
        state.argv = argv;
        run(main, argv).then(() => {
            // Post
        });
    }
}

exports.debug = debug;

async function run(fn, argv) {
    try {
        await fn(argv);
    } catch (err) {
        handleError(argv, err);
    }
}

function handleError(argv, err) {
    if (argv.debug) {
        console.log(err)
    } else {
        try {
            const json = JSON.parse(err);
            if (json) {
                if (json.message) {
                    console.error(json.message);
                } else {
                    console.error(`Error: ${err}`);
                }
            } else {
                console.error(`Error: ${err}`);
            }
        } catch (err2) {
            // Failed to parse
            console.error(`Error: ${err}`);
        }
    }
}

function debug(str) {
    if (!state.argv) console.error('WARNING: state.argv isn\'t initialized in cmd-base.js::debug()');
    if (state.argv && state.argv.debug) {
        console.log(typeof str)
        if (typeof str == 'object') {
            console.log('[DEBUG] ' + JSON.stringify(str, null, 2));
        } else {
            console.log('[DEBUG] ' + str);
        }
    }
}