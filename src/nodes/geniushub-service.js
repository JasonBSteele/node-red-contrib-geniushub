'use strict';

module.exports = function(RED) {

    const GeniusHubClient = require("../geniushub-client.js");
    
    function GeniusHubServiceNode(config) {
        RED.nodes.createNode(this, config);

        this.geniusHubClient = new GeniusHubClient(this.token);
    }

    RED.nodes.registerType('geniushub2-service', GeniusHubServiceNode); //, {
        // credentials: {
        //     token: { type: 'text' }
        // }
    //});

    RED.httpAdmin.get('/geniushub/zones', function(req, res, next)
	{
        let client = new GeniusHubClient(req.query.token);

        client.getZonesSummary()
        .then(zones  => {
			res.end(JSON.stringify(zones));
		})
		.catch(error => {
			res.send(500).send(error.message);
		});

    });
}