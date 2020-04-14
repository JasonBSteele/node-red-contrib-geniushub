module.exports = function(RED) {
    function GeniusHubServiceNode(config) {
        RED.nodes.createNode(this, config);
        this.host = "https://my.geniushub.co.uk/v1";

        this.token = config.token;

        //Not required 
        //this.secureApiKeyHeaderOrQueryName = n.secureApiKeyHeaderOrQueryName;
        //this.secureApiKeyIsQuery = n.secureApiKeyIsQuery;
    }

    RED.nodes.registerType('geniushub2-service', GeniusHubServiceNode, {
        credentials: {
            token: { type: 'text' }
        }
    });
}