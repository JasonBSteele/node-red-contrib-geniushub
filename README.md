# node-red-contrib-geniushub

[![GitHub license](https://img.shields.io/github/license/JasonBSteele/node-red-contrib-geniushub)](https://github.com/JasonBSteele/node-red-contrib-geniushub/blob/master/LICENSE)

A collection of [Node-RED](https://nodered.org/) nodes to control [Genius Hub](https://www.geniushub.co.uk/) heating system.

## Installation

Install directly from your Node-RED's setting pallete.

You will need a token to use in the configuration of the nodes. You can create one here [https://my.geniushub.co.uk/tokens](https://my.geniushub.co.uk/tokens) by logging in with you Genius Hub credentials and clicking the + button. Note that you can set the Expiration Date to date up to a year from now. You will need to Renew the token when it expires by clicking the Rebew button next to it.   
## Nodes
The following nodes are provided. Let me know through the issues tab if you have any problems with them. Also feel free to suggest adding any additional ones that you need. 

Note that the nodes are not updated in real time from Genius Hub as that would require polling the Genius Hub cloud service as there is no web hook feature for it to provide notifications to us. This could be added but the polling interval would need to be fairly long (probably a minute) to avoid adding significant load to the service.

The following nodes are available:

### get zones
This node will return an array of nodes with detailed information on each node. The schema for the data returned can be found at  [https://my.geniushub.co.uk/docs#tag/zones](https://my.geniushub.co.uk/docs#tag/zones).

### get zone
Similarly this node will return information for a single node. However the node is specified in the node's properties and the specific information to return can be specified by setting the detail level in the properties.

The detail levels are: `Full`, `Temperature`, `Setpoint`, `Mode`, `Occupied`, `Timer Schedule` and `Footprint Schedule`. Note that `Timer Schedule` currently does not work as I suspect there is an issue with the cloud service that needs to be resolved.

### override
This allows an override to be set for a zone. A `setpoint` and `duration` are specifed through the input `payload`.

### set mode
This allows the mode to be set for a zone. The input `payload` can be set to `off`, `timer`, `override` or `footprint`. 

If an `override` is active on a zone, `timer` or `footprint` will cancel it.

If `override` is specified the default override for the zone will be activated on it.
