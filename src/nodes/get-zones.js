'use strict';

module.exports = function(RED) {
    function GetZones(config) {
        RED.nodes.createNode(this,config);
        this.service = RED.nodes.getNode(config.service);

        this.on('input', async (msg, send, done) => {
            msg.payload = await this.service.geniusHubClient.getZones();
            send(msg);
            done();
        });
    }
    RED.nodes.registerType("get-zones", GetZones);
}