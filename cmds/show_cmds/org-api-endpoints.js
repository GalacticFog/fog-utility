const cmd = require('../lib/cmd-base');
exports.command = 'org-api-endpoints'
exports.desc = 'List org API endpoints'
exports.builder = {}
exports.handler = cmd.handler(async function (argv) {
    const displayResource = require('../lib/displayResourceUI');
    const gestalt = require('../lib/gestalt');
    const selectHierarchy = require('../lib/selectHierarchy');

    const options = {
        message: "API Endpoints",
        headers: [
            'Resource Path',
            'Type',
            'Security',
            'FQON',
            // 'Workspace',
            // 'Environment',
            'Synchronous',
            'Methods',
            'Owner'
        ],
        fields: [
            'properties.api_path',
            'properties.implementation_type',
            'properties.plugins.gestaltSecurity.enabled',
            'org.properties.fqon',
            // 'properties.workspace',
            // 'properties.environment',
            'properties.synchronous',
            'properties.methods',
            'owner.name'
        ],
        sortField: 'description',
    }

    await selectHierarchy.resolveOrg();

    const resources = await gestalt.fetchOrgApis();

    const apis = resources.map(item => {
        return {
            id: item.id,
            fqon: item.org.properties.fqon
        }
    });
    const eps = await gestalt.fetchApiEndpoints(apis);
    eps.map(ep => {
        ep.properties.api_path = `/${ep.properties.parent.name}${ep.properties.resource}`
        ep.properties.environment = '(empty)';
        ep.properties.workspace = '(empty)';
    });

    displayResource.run(options, eps);
});