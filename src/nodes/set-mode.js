'use strict';

module.exports = function(RED) {

    class SetModeNode {

        constructor(config) {
            RED.nodes.createNode(this,config);
            this.service = RED.nodes.getNode(config.service);

            let parts = config.zone.split('|');

            if (parts.length == 3) {
                let zoneId = parts[0];
                let zoneName = parts[1];
                let zoneType = parts[2];

                this.on('input', async (msg, send, done) => {
                    try {
                        let payload = msg.payload;
                        let validationMsg = this.validatePayload(zoneType, payload);
                        if (validationMsg.length > 0) {
                            done(validationMsg);
                        }
                        else {
                            await this.service.geniusHubClient.setMode(zoneId, payload);
                            done();
                        }
                    }
                    catch(e) {
                        done(e);
                    }
                });
            }
        }

        validatePayload(zoneType, payload) {
            let validationMsg = "";

            

            return validationMsg;
        }
    }

    RED.nodes.registerType("set-mode", SetModeNode);
}