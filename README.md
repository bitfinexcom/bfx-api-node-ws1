# Bitfinex WSv1 Reference Implementation for Node.JS

[![Build Status](https://travis-ci.org/bitfinexcom/bfx-api-node-ws1.svg?branch=master)](https://travis-ci.org/bitfinexcom/bfx-api-node-ws1)

This repo contains the reference implementation for version 1 of the websocket Bitfinex API. It is deprecated in favour of version 2, and should no longer be used.

For the version 2 API library, see [bitfinex-api-node](https://github.com/bitfinexcom/bitfinex-api-node)

### Features

* Emits API data as events from the class instance
* Provides methods for channel management & listening to incoming data

### Installation

```bash
npm i --save bfx-api-node-ws1
```

### Quickstart & Example

```js
const WSv1 = require('bfx-api-node-ws1')
const ws = new WSv1()

ws.open()

ws.on('open', () => {
  ws.subscribeTrades('BTCUSD')
})

ws.on('trades', (pair, trade) => {
  console.log(JSON.stringify({ pair, trade }, null, 2))
})
```

### Docs

For JSDoc-generated API documentation, [see `docs/ws1.md`](/docs/ws1.md)

### Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
