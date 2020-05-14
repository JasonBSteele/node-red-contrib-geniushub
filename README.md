# node-red-contrib-geniushub

[![GitHub license](https://img.shields.io/github/license/JasonBSteele/node-red-contrib-geniushub)](https://github.com/JasonBSteele/node-red-contrib-geniushub/blob/master/LICENSE)

A collection of [Node-RED](https://nodered.org/) nodes to control the [Genius Hub](https://www.geniushub.co.uk/) heating system.

## Installation

Install directly from your Node-RED's setting pallete.

You will need a token to use in the configuration of the nodes. You can create one here [https://my.geniushub.co.uk/tokens](https://my.geniushub.co.uk/tokens) by logging in with you Genius Hub credentials and clicking the `+` button. Note that you can set the Expiration Date to date up to a year from now. You will need to Renew the token when it expires by clicking the Renew button next to it.   
## Nodes
Both nodes take a command through the input `topic` and when they output a message they set the output `topic` to the `topic` passed in. The commands are case insensitive.

### whole house
This node represents the Genius Hub Whole House. It supports the following commands:

- `getZones` - outputs the full state of all the zones, see https://my.geniushub.co.uk/docs#operation/getZones for the schema of the output `payload`.
- `getSummary` - outputs the `id` and `name` for each zone, see https://my.geniushub.co.uk/docs#operation/getZonesSummary for the schema of the output `payload`.
- `getTemperature` - outputs the temperature in Celcius as a real number. 
- `off` - turns off all the `radiator` zones.
- `restore` - restores the state of all `radiator` zones that were turned off by the `off` command.

### zone
This node represents a single Genius Hub zone. It supports the following commands:

- `getStatus` - outputs the full state of the zone, see https://my.geniushub.co.uk/docs#operation/getZone for the schema of the output `payload`
- `getTemperature` - outputs the temperature in Celcius as a real number.
- `getMode` - outputs the current mode as one of the following strings `off`, `timer`, `footprint`, and `override`.
- `getSetpoint` - outputs the temperature that the zone has been set to in Celcius as a real number.
- `getOverride` - outputs the current override, see https://my.geniushub.co.uk/docs#operation/getZoneOverrideSettings for the schema of the output `payload`.
- `getOccupied` - outputs `true` if the zone is occupied and `false` if it is not.
- `getTimerSchedule` - outputs the weekly schedule of the timer, see https://my.geniushub.co.uk/docs#operation/getZoneTimerSchedule for the schema of the output `payload`. (Note that this currently returns an error 500).
- `getFootprintSchedule` - outputs the weekly schedule created by the footprint feature, see https://my.geniushub.co.uk/docs#operation/getZoneFootprintSchedule for the schema of the output `payload`.
- `off` - set the zone to the `off` mode.
- `timer` - set the zone to the `timer` mode.
- `footprint` - set the zone to the `footprint` mode,
- `override` - set an override for the zone. The `payload` can contain a `setpoint` in Celcius and a `duration` in seconds, If either are omitted the current override will be updated. If there is no `payload` the default override will be set.

## Known Issues

- The `whole house` `off` command only turns of zones with the type `radiator`. Please let me know the zone `type` of any other zones that should be turned off by this.
- The `whole house` `restore` command will only undo what was done by a preceding `off` command. It will not be able to undo an off that has been done through the Genius Hub app or web site. 
- According to the documentation at https://my.geniushub.co.uk/docs# `whole house` `getSummary` should return the `type` as well as the `id` and `name` of a zone but unfortunately it doesn't.
- The `whole house` `getTimerSchedule` command currently return an HTTP error 500 as that is what it gets from the Genius Hub cloud. Can this be confirmed as in issue?

