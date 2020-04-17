'use strict';

const axios = require('axios').default;

module.exports = class GeniusHubClient {

    constructor(token) {
        console.log('client ctor token: ' + token);
        this.client =  axios.create({
            baseURL: 'https://my.geniushub.co.uk/v1',
            timeout: 10000,
            headers: {'Authorization': 'Bearer ' + token}
            });

    }

    async getZones() {
        //not returned
        let r = await this.client.get('zones')
            // .then(
            //     r => r.data)
            // .catch(
            //     e => console.log('my error' + e.toJSON()));

        return r.data;
    }
}