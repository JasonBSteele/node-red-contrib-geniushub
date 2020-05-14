'use strict';

module.exports = function(RED) {

    const GeniusHubClient = require("../geniushub-client.js");
    
    class  GeniusHubServiceNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.geniusHubClient = new GeniusHubClient(config.token);
        }
    }

    RED.nodes.registerType('geniushub-service', GeniusHubServiceNode);

    RED.httpAdmin.get('/geniushub/zones', function(req, res, next)
	{
        let client = new GeniusHubClient(req.query.token);

        client.getZones()
        .then(zones => {
			res.end(JSON.stringify(zones));
		})
		.catch(error => {
            res.status(500).send(error);
		});
    });
}