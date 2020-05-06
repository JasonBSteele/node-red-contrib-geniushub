'use strict';

module.exports = function(RED) {

    class OverrideNode {

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
                            await this.service.geniusHubClient.override(zoneId, payload.setpoint, payload.duration);
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

            // if (!Number.isInteger(payload.zoneId)) {
            //     validationMsg += `zoneId is not an integer: ${payload.zoneId}\n`; 
            // }
            

            if (isNaN(payload.setpoint)) {
                validationMsg += `setpoint is not an number: ${payload.setpoint}\n`; 
            }
            else if (zoneType == "on / off"){
                validationMsg += `setpoint must be a 0 or 1 for on/off zones: ${payload.setpoint}\n`;
            }

            if (!Number.isInteger(payload.duration)) {
                validationMsg += `duration is not an integer: ${payload.duration}\n`; 
            }

            return validationMsg;
        }
    }

    RED.nodes.registerType("override", OverrideNode);
}