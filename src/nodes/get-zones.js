module.exports = function(RED) {
    function GetZones(config) {
        RED.nodes.createNode(this,config);
        this.service = RED.nodes.getNode(config.service);

        //var node = this;

        this.on('input', async msg => {
            msg.payload = await this.service.geniusHubClient.getZones();
                //.then(
                //    z => z)
                //.catch(e => console.error("Critical failure: " + e.message));

            //this.payload = msg.payload.toLowerCase();
            this.send(msg);
            this.done();
        });
    }
    RED.nodes.registerType("get-zones", GetZones);
}