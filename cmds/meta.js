exports.command = 'meta <resource>'
exports.desc = 'Gestalt Meta functions'
exports.builder = function (yargs) {
  return yargs.commandDir('meta_cmds').commandDir('default_cmds');
}
exports.handler = function (argv) {}

