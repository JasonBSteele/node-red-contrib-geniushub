'use strict';

const axios = require('axios').default;

module.exports = class GeniusHubClient {

    constructor(token) {
        this.client =  axios.create({
            baseURL: "https://my.geniushub.co.uk/v1",
            timeout: 10000,
            headers: {"Authorization": "Bearer " + token}
            });
    }

    async _callGeniusHub(url, method, data) {
        let options = {
            url: url,
            method: method,
            data: data
        }

        try {
            let response = await this.client.request(options);
            return response.data;
        }
        catch(e) {
            if (e.response) {
                if (e.response.status == 401) throw "The token is not valid.";
            }
            throw e;
        }
    }

    async getZones(type) {
        let zones = await this._callGeniusHub("zones");
        
        if (type) {
            zones = zones.filter(z => z.type === type);
        }

        return zones;
    }

    async getZonesSummary(type) {
        let zones = await this._callGeniusHub("zones");

        if (type) {
            zones = zones.filter(z => z.type === type);
        }

        return zones;
    }

    async override(zoneId, setpoint, duration) {
        await this._callGeniusHub(`zones/${zoneId}/override`, "post", 
            {
                setpoint: setpoint,
                duration: duration
            });
    }
}