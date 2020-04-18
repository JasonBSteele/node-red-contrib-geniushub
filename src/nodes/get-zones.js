'use strict';

module.exports = function(RED) {
 
    class  GetZonesNode {
    
        constructor(config) {
            RED.nodes.createNode(this,config);
            this.service = RED.nodes.getNode(config.service);

            this.on('input', async (msg, send, done) => {
                try
                {
                    msg.payload = await this.service.geniusHubClient.getZones();
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