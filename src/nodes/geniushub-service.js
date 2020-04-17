'use strict';

module.exports = function(RED) {

    const GeniusHubClient = require("../geniushub-client.js");
    
    function GeniusHubServiceNode(config) {
        RED.nodes.createNode(this, config);

        this.geniusHubClient = new GeniusHubClient(this.credentials.token);
    }

    RED.nodes.registerType('geniushub2-service', GeniusHubServiceNode, {
        credentials: {
            token: { type: 'text' }
        }
    });
}