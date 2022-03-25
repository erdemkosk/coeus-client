const axios = require('axios');
const EventEmitter = require('events');
const { INTERVAL_STATUSES , DEFAULT_INTERVAL_TIME } = require('./constants')

let TOKEN;
let URL;
let IDENTITY;
let PASSWORD;
let INTERVAL;

class Client extends EventEmitter {
    constructor({ url, identity, password, interval }) {
        super();
        this.configs = [];
        this.keys = [];
        this.interval = interval ||  DEFAULT_INTERVAL_TIME;
        this.status = INTERVAL_STATUSES.READY;
        URL = url;
        IDENTITY = identity;
        PASSWORD = password;
    }

    async connect() {
        const authObject = {
            identity: IDENTITY,
            password: PASSWORD,
        };

        TOKEN = await axios.post(URL + 'auth/login', authObject)
            .then(function (response) {
                return response.data.data;

            })
            .catch(function (error) {
                console.log('Coeus connection failed.')
            });
    };

    async getConfigs() {
        this.status = INTERVAL_STATUSES.PENDING;
        const keysObject = {
            keys: this.keys,
        };

        const config = {
            headers: { Authorization: `Bearer ${TOKEN}` }
        };

        const that = this;

        return axios.post(URL + 'api/config/by-keys', keysObject, config)
            .then(function (response) {
                that.configs = response.data.config;
                that.status = INTERVAL_STATUSES.UPDATED;
                that.emit('updated', that.configs);
            })
            .catch(function (error) {

                that.emit('error', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    message: error.response.data.message,
                });
            });
    };

     getConfig({ key = '' }) {
        return this.configs.find(config => config.Key === key);
    };

    async addKeys({ keys = [] }) {
        this.keys = [...this.keys, ...keys];
        this.getConfigs({ keys: this.keys });

        if (!INTERVAL) {
            INTERVAL = await setInterval(() => { this.getConfigs(); }, this.interval);
        }
    };

    async discard({ key }) {
        this.keys = this.keys.filter(mapKey => mapKey !== key);
    };
}

module.exports = {
    connect: async function ({ url, identity, password, interval }) {
        const client = new Client({ url, identity, password, interval });
        await client.connect();
        this.client = client;
        return client;
    },
};