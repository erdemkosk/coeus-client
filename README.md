# Coeus Client

 ![Logo](https://i.imgur.com/Jgf7swu.gif)
## Documentation

Coeus is a custom flag and config service creation tool. Its main purpose is to make business decisions used in many projects or to turn off some features when requested, or to keep translations for applications that serve in more than one language. You can easily access the necessary data by cloning and using the npm client. It's free, the only fee is your own server fee. For this reason, it can be changed individually.

>▪️ It can be used to turn on or off some features in the system.
▪️Information that can change at any time, such as a phone number, can be stored.
▪️It can be used as a translation storage tool for multiple languages.

> This package using for wrapper for actions


In addition, it has a simple panel that is protected by the password you set. In this way, you can easily enter, update or delete your data.
### Using

```sh
const coeus = require('coeus-client');

(async () => {
    await coeus.connect({
        url: 'url',
        identity: 'id',
        password: 'password',
        interval: 5 * 1000, // update interval time
    })
    
 // add needed configs
    await coeus.client.addKeys({ keys: ['co:email', 'co:json','co:NUMBER_OF_GOOD_TIMES'] });
    // U can discard any config but ı dont recemended that.
    coeus.client.discard({ key: 'co:email' });

// this is updated event on every interval
    coeus.client.on('updated', (configs) => {
        console.log(configs);
    });
// this error event for when getting error on server
    coeus.client.on('error', (value) => {
        console.log(value);
    });
})();

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send(coeus.client.getConfig({ key: 'co:NUMBER_OF_GOOD_TIMES' }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
```

## Deployment Coesus
### With Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/erdemkosk/coeus)