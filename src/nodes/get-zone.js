'use strict';

module.exports = function(RED) {

    class GetZoneNode {
        
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
                        switch(config.detail)
                        {
                            case "FULL":
                                msg.payload = await this.service.geniusHubClient.getZone(zoneId);
                                break;

                            case "TEMPERATURE":
                                msg.payload = await this.service.geniusHubClient.getZoneTemperature(zoneId);
                                break;

                            case "SETPOINT":
                                msg.payload = await this.service.geniusHubClient.getZoneSetpoint(zoneId);
                                break;

                            case "OVERRIDE":
                                msg.payload = await this.service.geniusHubClient.getZoneOverride(zoneId);
                                break;
                            
                            case "MODE":
                                    msg.payload = await this.service.geniusHubClient.getZoneMode(zoneId);
                                    break;
    
                            case "OCCUPIED":
                                msg.payload = await this.service.geniusHubClient.getZoneOccupied(zoneId);
                                break;

                            case "TIMER_SCHEDULE":
                                msg.payload = await this.service.geniusHubClient.getZoneTimerSchedule(zoneId);
                                break;

                            case "FOOTPRINT_SCHEDULE":
                                msg.payload = await this.service.geniusHubClient.getZoneFootprintSchedule(zoneId);
                                break;
                        }

                        if (config.topic) {
                            msg.topic = config.topic;
                        }
                        send(msg);
                        done();
                    }
                    catch(e) {
                        done(e);
                    }
                });
            }
        }

    }

    RED.nodes.registerType("get-zone", GetZoneNode);
}