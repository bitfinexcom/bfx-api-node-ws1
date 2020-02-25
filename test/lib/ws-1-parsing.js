/* eslint-env mocha */
'use strict'

const PORT = 1337

const assert = require('assert')
const WebSocket = require('ws')
const WSv1 = require('../../lib/ws')

describe('websocket1 parsing non json', () => {
  let ws = null
  let wss = null

  afterEach(async () => {
    try { // may fail due to being modified by a test, it's not a problem
      if (ws && ws.isOpen()) {
        await new Promise(resolve => ws.close(resolve))
      }
    } catch (e) {}

    ws = null

    if (wss) {
      await new Promise(resolve => wss.close(resolve))
    }

    wss = null
  })

  it('should not crash the client', (done) => {
    ws = new WSv1({
      apiKey: 'dummy',
      apiSecret: 'dummy',
      url: `ws://localhost:${PORT}`
    })

    ws.open()

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    wss.on('connection', function connection (ws) {
      ws.on('message', function incoming (msg) {
        msg = JSON.parse(msg)
        assert.strictEqual(msg.len, '25')
        done()
      })

      ws.send("HTTP Code 408 - I'm a Tea Pot")
    })

    ws.on('open', () => ws.subscribeOrderBook('BTCUSD', 'R0'))
  })
})
