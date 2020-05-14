'use strict';

module.exports = function(RED) {

    class ZoneNode {
        
        _commands = {
            GETSTATE: Symbol("GETSTATE"),
            GETSETPOINT: Symbol("GETSETPOINT"),
            GETTEMPERATURE: Symbol("GETTEMPERATURE"),
            GETOVERRIDE: Symbol("GETOVERRIDE"),
            GETMODE: Symbol("GETMODE"),
            GETOCCUPIED: Symbol("GETOCCUPIED"),
            GETTIMERSCHEDULE: Symbol("GETTIMERSCHEDULE"),
            GETFOOTPRINTSCHEDULE: Symbol("GETFOOTPRINTSCHEDULE"),
            OFF: Symbol("OFF"),
            TIMER: Symbol("TIMER"),
            FOOTPRINT: Symbol("FOOTPRINT"),
            OVERRIDE: Symbol("OVERRIDE")
        };

        constructor(config) {
            RED.nodes.createNode(this,config);
            this.service = RED.nodes.getNode(config.service);
 
            this.on('input', async (inMsg, send, done) => {
                let parts = config.zone.split('|');

                if (parts.length == 3) {
                    let zoneId = parts[0];
                    let zoneName = parts[1];
                    let zoneType = parts[2];
        
                    try {
                        let outMsg = await this.executeCommand(zoneId, zoneType, inMsg);
                        if (outMsg) {
                            send(outMsg);
                        }
                        done();
                    }
                    catch(ex) {
                        done(ex);
                    }
                }
                else {
                    done("A zone needs to be selected in the properties");
                }

            });
        }

        async executeCommand(zoneId, zoneType, inMsg) {
            let outPayload = "";
            let command = inMsg.topic.toUpperCase();

            switch(this._commands[command]) {
                case this._commands.GETSTATE:
                    outPayload = await this.service.geniusHubClient.getZone(zoneId);
                    break;

                case this._commands.GETTEMPERATURE:
                    outPayload = await this.service.geniusHubClient.getZoneTemperature(zoneId);
                    break;

                case this._commands.GETSETPOINT:
                    outPayload = await this.service.geniusHubClient.getZoneSetpoint(zoneId);
                    break;

                case this._commands.GETOVERRIDE:
                    outPayload = await this.service.geniusHubClient.getZoneOverride(zoneId);
                    break;
                
                case this._commands.GETMODE:
                    outPayload = await this.service.geniusHubClient.getZoneMode(zoneId);
                    break;

                case this._commands.GETOCCUPIED:
                    outPayload = await this.service.geniusHubClient.getZoneOccupied(zoneId);
                    break;

                case this._commands.GETTIMERSCHEDULE:
                    outPayload = await this.service.geniusHubClient.getZoneTimerSchedule(zoneId);
                    break;

                case this._commands.GETFOOTPRINTSCHEDULE:
                    outPayload = await this.service.geniusHubClient.getZoneFootprintSchedule(zoneId);
                    break;

                case this._commands.OFF:
                    await this.service.geniusHubClient.setMode(zoneId, "off");
                    break;

                case this._commands.TIMER:
                    await this.service.geniusHubClient.setMode(zoneId, "timer");
                    break;
    
                case this._commands.FOOTPRINT:
                    await this.service.geniusHubClient.setMode(zoneId, "footprint");
                    break;
    
                case this._commands.OVERRIDE:
                    await this.doOverride(zoneId, zoneType, inMsg.payload);
                    break;

                default:
                    throw `Topic value "${inMsg.topic}" is not a valid command`;
            }

            if (outPayload) {
                let outMsg = {};
                outMsg.topic = inMsg.topic;
                outMsg.payload = outPayload;

                return outMsg;
            }
        }

        async doOverride(zoneId, zoneType, payload) {
            if (payload) {
                let validationMsg = "";

                if (payload.setpoint) {
                    if (isNaN(payload.setpoint)) {
                        validationMsg += `setpoint "${payload.setpoint}" is not an number. \n`; 
                    }
                    else if (zoneType == "on / off" && payload.setpoint != 0 && payload.setpoint != 1) {
                        validationMsg += `setpoint "${payload.setpoint}" must be a 0 or 1 for on/off zones. \n`;
                    }
                }
            
                if (payload.duration && !Number.isInteger(payload.duration)) {
                    validationMsg += `duration "${payload.duration}" is not an integer. \n`; 
                }

                if (validationMsg) {
                    throw validationMsg;
                }

                if (payload.setpoint && payload.duration) {
                    await this.service.geniusHubClient.override(zoneId, payload.setpoint, payload.duration);
                }
                else if (payload.setpoint || payload.duration) {
                    await this.service.geniusHubClient.changeOverride(zoneId, payload.setpoint, payload.duration);
                }
                else {
                    throw `payload "${payload}" is not valid for an override`
                }
            }
            else {
                await this.service.geniusHubClient.setMode(zoneId, "override"); 
            }
        }
    }

    RED.nodes.registerType("geniushub-zone", ZoneNode);
}