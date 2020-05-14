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

        async executeCommand(inMsg) {
            let outPayload = {};
            let command = inMsg.topic.toUpperCase();

            switch(this._commands[command]) {
                case this._commands.GETZONES:
                    outPayload = await this.service.geniusHubClient.getZones();
                    break;

                case this._commands.GETSUMMARY:
                    outPayload = await this.service.geniusHubClient.getZonesSummary();
                    break;

                case this._commands.GETTEMPERATURE:
                    outPayload = await this.service.geniusHubClient.getWholeHouseTemperature();
                    break;
    
                case this._commands.OFF:
                    await this.doOff(inMsg);
                    break;
    
                case this._commands.RESTORE:
                    await this.doRestore(inMsg);
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
    }

    RED.nodes.registerType("geniushub-whole-house", WholeHouseNode);
}