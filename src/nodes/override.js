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
                        let validationMsg = this.validatePayload(zoneType, config.change, payload);
                        if (validationMsg.length > 0) {
                            done(validationMsg);
                        }
                        else {
                            if (config.change) {
                                await this.service.geniusHubClient.changeOverride(zoneId, payload.setpoint, payload.duration);
                            } 
                            else {
                                await this.service.geniusHubClient.override(zoneId, payload.setpoint, payload.duration);
                            }
                            done();
                        }
                    }
                    catch(e) {
                        done(e);
                    }
                });
            }
        }

        validatePayload(zoneType, change, payload) {
            let validationMsg = "";

            if (payload.setpoint && isNaN(payload.setpoint)) {
                validationMsg += `setpoint is not an number: ${payload.setpoint}\n`; 
            }
            else if (zoneType == "on / off") {
                validationMsg += `setpoint must be a 0 or 1 for on/off zones: ${payload.setpoint}\n`;
            }

            if (payload.duration && !Number.isInteger(payload.duration)) {
                validationMsg += `duration is not an integer: ${payload.duration}\n`; 
            }

            if(change) {
                if (!payload.setpoint && !payload.duration) {
                    validationMsg += "At least one of setpoint or duration must be specified\n"; 
                }
            } 
            else {
                if (!payload.setpoint) {
                    validationMsg += "setpoint must be specified\n";
                }

                if (!payload.duration) {
                    validationMsg += "duration must be specified\n";
                }
            }

            return validationMsg;
        }
    }

    RED.nodes.registerType("override", OverrideNode);
}