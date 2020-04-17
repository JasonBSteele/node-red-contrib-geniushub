'use strict';

module.exports = function(RED) {

    const GeniusHubClient = require("../geniushub-client.js");
    
    function GeniusHubServiceNode(config) {
        RED.nodes.createNode(this, config);
        //this.host = "https://my.geniushub.co.uk/v1";

        //this.token = config.token;
        
        this.geniusHubClient = new GeniusHubClient(this.credentials.token);
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