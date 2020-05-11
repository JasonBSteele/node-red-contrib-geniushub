'use strict';

module.exports = function(RED) {
 
    class  GetZonesNode {
    
        constructor(config) {
            RED.nodes.createNode(this,config);
            this.service = RED.nodes.getNode(config.service);

            this.on('input', async (msg, send, done) => {
                try
                {
                    if (config.detailed) {
                        msg.payload = await this.service.geniusHubClient.getZones();
                    } else {
                        msg.payload = await this.service.geniusHubClient.getZonesSummary();
                    }

                    if (config.topic) {
                        msg.topic = config.topic;
                    }
                    send(msg);
                    done();
                }
                catch(e)
                {
                    done(e);
                }
            });
        }
    }

    RED.nodes.registerType("get-zones", GetZonesNode);
}