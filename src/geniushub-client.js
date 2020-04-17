'use strict';

const axios = require('axios').default;

module.exports = class GeniusHubClient {

    constructor(token) {
        this.client =  axios.create({
            baseURL: 'https://my.geniushub.co.uk/v1',
            timeout: 10000,
            headers: {'Authorization': 'Bearer ' + token}
            });
    }

    async getZones() {
        let r = await this.client.get('zones');

        return r.data;
    }
}