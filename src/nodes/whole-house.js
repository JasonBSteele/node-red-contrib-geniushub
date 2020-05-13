'use strict';

module.exports = function(RED) {
 
    class  WholeHouseNode {
        
        _offableTypes = ["radiator"];

        _commands = {
            GETZONES: Symbol("GETZONES"),
            GETSUMMARY: Symbol("GETSUMMARY"),
            GETTEMPERATURE: Symbol("GETTEMPERATURE"),
            OFF: Symbol("OFF"),
            RESTORE: Symbol("RESTORE")
        };
    
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.service = RED.nodes.getNode(config.service);
            
            this.on('input', async (inMsg, send, done) => {
                try {
                    let outMsg = await this.executeCommand(inMsg);
                    if (outMsg) {
                        send(outMsg);
                    }
                    done();
                }
                catch(ex) {
                    done(ex);
                }
            });
        }

        async doGetZones(inMsg) {
            let outMsg = {};
            outMsg.topic = inMsg.topic;
            outMsg.payload = await this.service.geniusHubClient.getZones();

            return outMsg;
        }

        async doGetSummary(inMsg) {
            let outMsg = {};
            outMsg.topic = inMsg.topic;
            outMsg.payload = await this.service.geniusHubClient.getZonesSummary();

            return outMsg;
        }

        async doGetTemperature(inMsg) {
            let outMsg = {};
            outMsg.topic = inMsg.topic;
            outMsg.payload = await this.service.geniusHubClient.getWholeHouseTemperature();

            return outMsg;
        }

        async doOff(inMsg) {
            let client = await this.service.geniusHubClient;
            
            let globalContext = this.context().global;
            let restoreStates = globalContext.get("WholeHouseRestoreStates") || new Map(); 
            
            let zones = await client.getZones();
            let tasks = [];
            let offableTypes = this._offableTypes;
            
            zones.forEach(zone => {
                if (offableTypes.includes(zone.type) && zone.mode != "off") {
                    restoreStates.set(zone.id, zone.mode);
                    tasks.push(client.setMode(zone.id, "off"));
                }
            });
            
            await Promise.all(tasks);

            //TODO Set the restore states for those zones that suceeded
            globalContext.set("WholeHouseRestoreStates", restoreStates);
        }

        async doRestore(inMsg) {
            let client = await this.service.geniusHubClient;
            let globalContext = this.context().global;
            let restoreStates = globalContext.get("WholeHouseRestoreStates") || new Map(); 
            
            let zones = await client.getZones();
            let tasks = [];
            
            zones.forEach(zone => {
                if (restoreStates.has(zone.id) && zone.mode == "off") {
                    let restoreState = restoreStates.get(zone.id);
                    try {
                        tasks.push(client.setMode(zone.id, restoreState));
                    }
                    catch(ex) {
                        console.log(`zone ${zone.id} : ${ex}`);
                    }
                }
            });
            
            await Promise.all(tasks);

            //TODO Unset the restore states for those zones that suceeded
            globalContext.set("WholeHouseRestoreStates", new Map());
        }
        
        async executeCommand(inMsg) {
            let outMsg = {};
            let command = inMsg.topic.toUpperCase();

            switch(this._commands[command]) {
                case this._commands.GETZONES:
                    outMsg = await this.doGetZones(inMsg);
                    break;

                case this._commands.GETSUMMARY:
                    outMsg = await this.doGetSummary(inMsg);
                    break;

                case this._commands.GETTEMPERATURE:
                    outMsg = await this.doGetTemperature(inMsg);
                    break;
    
                case this._commands.OFF:
                    outMsg = await this.doOff(inMsg);
                    break;
    
                case this._commands.RESTORE:
                    outMsg = await this.doRestore(inMsg);
                    break;
    
                default:
                    throw `Topic value ${inMsg.topic} is not a valid command`;
            }

            return outMsg;
        }

            // if (payload.setpoint && isNaN(payload.setpoint)) {
            //     validationMsg += `setpoint is not an number: ${payload.setpoint}\n`; 
            // }
            // else if (zoneType == "on / off") {
            //     validationMsg += `setpoint must be a 0 or 1 for on/off zones: ${payload.setpoint}\n`;
            // }

            // if (payload.duration && !Number.isInteger(payload.duration)) {
            //     validationMsg += `duration is not an integer: ${payload.duration}\n`; 
            // }

            // if(change) {
            //     if (!payload.setpoint && !payload.duration) {
            //         validationMsg += "At least one of setpoint or duration must be specified\n"; 
            //     }
            // } 
            // else {
            //     if (!payload.setpoint) {
            //         validationMsg += "setpoint must be specified\n";
            //     }

            //     if (!payload.duration) {
            //         validationMsg += "duration must be specified\n";
            //     }
            // }
        //}
    }

    RED.nodes.registerType("whole-house", WholeHouseNode);
}