'use strict'

const PORT = 1337

const test = require('brittle')
const WebSocket = require('ws')
const WSv1 = require('../../lib/ws')

test('websocket1 parsing non json', async (t) => {
  let ws = null
  let wss = null

  const teardown = async () => {
    try { // may fail due to being modified by a test, it's not a problem
      if (ws && ws.isOpen()) {
        ws.close()
      }
    } catch (e) {}

    ws = null

    if (wss) {
      await new Promise(resolve => wss.close(resolve))
    }

    wss = null
  }

  await t.test('should not crash the client', (t) => {
    t.teardown(teardown)
    t.plan(1)

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
        t.is(msg.len, '25')
      })

      ws.send("HTTP Code 408 - I'm a Tea Pot")
    })

    ws.on('open', () => ws.subscribeOrderBook('BTCUSD', 'R0'))
  })
})
