'use strict'

const test = require('brittle')
const WebSocket = require('ws')
const _isObject = require('lodash/isObject')

const WSv1 = require('../../lib/ws')
const orderbookR0 = require('../fixtures/response-ws-1-orderbook-R0.json')

const PORT = 1334
const getWSInstance = (args) => (
  new WSv1({
    url: `ws://localhost:${PORT}`,
    ...args
  })
)

test('WebSocket v1 integration', async (t) => {
  let ws = null
  let wss = null

  const opts = { timeout: 10 * 1000 }
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

  await t.test('plays ping pong', opts, (t) => {
    t.teardown(teardown)
    t.plan(1)

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    ws = getWSInstance()
    wss.on('connection', (ws) => {
      ws.on('message', (msg) => {
        ws.send('{"event":"pong"}')
      })
    })

    ws.on('open', () => ws.send({ event: 'ping' }))
    ws.on('pong', () => t.pass())
    ws.open()
  })

  await t.test('should receive info message', opts, (t) => {
    t.teardown(teardown)
    t.plan(4)

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    ws = getWSInstance()

    wss.on('connection', (ws) => {
      ws.send(JSON.stringify({
        event: 'info',
        version: 1.1,
        platform: {
          status: 1
        }
      }))
    })

    ws.on('info', (data) => {
      t.ok(_isObject(data.platform))
      t.is(data.event, 'info')
      t.is(data.version, 1.1)
      t.is(data.platform.status, 1)
    })

    ws.open()
  })

  await t.test('should emit an error when authorization fails', opts, (t) => {
    t.teardown(teardown)
    t.plan(1)

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    ws = getWSInstance()

    wss.on('connection', (ws) => {
      ws.on('message', (msg) => {
        ws.send('{"event":"auth","status":"FAILED","chanId":0,"code":10100,"msg":"apikey: invalid"}')
      })
    })

    ws.on('error', (err) => {
      t.is(err.event, 'auth')
    })

    ws.on('open', ws.auth.bind(ws))
    ws.open()
  })

  await t.test('should unsubscribe by channelId', opts, (t) => {
    t.teardown(teardown)
    t.plan(2)

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    ws = getWSInstance()

    wss.on('connection', (ws) => {
      ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        if (msg.event === 'unsubscribe') {
          ws.send('{"event":"unsubscribed","status":"OK","chanId":4}')
          return
        }

        ws.send('{"event":"subscribed","channel":"ticker","chanId":4,"pair":"BTCUSD"}')
      })
    })

    ws.once('subscribed', (data) => {
      const channelId = data.chanId

      ws.once('unsubscribed', (data) => {
        t.is(data.status, 'OK')
        t.is(data.chanId, channelId)
      })

      ws.unsubscribe(channelId)
    })

    ws.on('open', () => ws.subscribeTicker('BTCUSD'))
    ws.open()
  })

  await t.test('should receive a subscribed success messages', opts, (t) => {
    t.teardown(teardown)
    t.plan(2)

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    ws = getWSInstance()
    wss.on('connection', (ws) => {
      ws.on('message', (msg) => {
        ws.send('{"event":"subscribed","channel":"trades","chanId":4,"pair":"BTCUSD"}')
      })
    })

    ws.on('subscribed', (data) => {
      t.is(data.channel, 'trades')
      t.is(data.pair, 'BTCUSD')
    })

    ws.on('open', () => ws.subscribeTrades('BTCUSD'))
    ws.open()
  })

  await t.test('#orderBook data should have the defined fields', opts, (t) => {
    t.teardown(teardown)
    t.plan(5)

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    wss.on('connection', (ws) => {
      ws.on('message', (msg) => {
        ws.send(JSON.stringify({
          event: 'subscribed',
          channel: 'book',
          chanId: 13242,
          prec: 'R0',
          freq: 'F0',
          len: '25',
          pair: 'BTCUSD'
        }))

        ws.send(JSON.stringify(orderbookR0))
      })
    })

    ws = getWSInstance({ transform: true })
    ws.once('orderbook', (pair, data) => {
      t.is(pair, 'BTCUSD')
      t.is(typeof data[0].price, 'number')
      t.is(typeof data[0].orderId, 'number')
      t.is(typeof data[0].amount, 'number')
      t.is(data.length, 50)
    })

    ws.on('open', () => ws.subscribeOrderBook('BTCUSD'))
    ws.open()
  })

  await t.test('#ticker data should have the defined fields', opts, (t) => {
    t.teardown(teardown)
    t.plan(11)

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    wss.on('connection', (ws) => {
      ws.send('{"event":"info","version":1.1}')
      ws.on('message', (msg) => {
        ws.send('{"event":"subscribed","channel":"ticker","chanId":4,"pair":"BTCUSD"}')
        ws.send('[4,2169.6,1.93,2169.8,0.0349,100.9,0.0488,2169.6,25479.40978657,2196,2000.1]')
      })
    })

    ws = getWSInstance()

    ws.once('ticker', (pair, data) => {
      t.is(pair, 'BTCUSD')
      t.is(typeof data.bid, 'number')
      t.is(typeof data.bidSize, 'number')
      t.is(typeof data.ask, 'number')
      t.is(typeof data.askSize, 'number')
      t.is(typeof data.dailyChange, 'number')
      t.is(typeof data.dailyChangePerc, 'number')
      t.is(typeof data.lastPrice, 'number')
      t.is(typeof data.volume, 'number')
      t.is(typeof data.high, 'number')
      t.is(typeof data.low, 'number')
    })

    ws.on('open', () => ws.subscribeTicker('BTCUSD'))
    ws.open()
  })

  await t.test('#trade data should have the defined fields', opts, (t) => {
    t.teardown(teardown)
    t.plan(4)

    wss = new WebSocket.Server({
      perMessageDeflate: false,
      port: PORT
    })

    wss.on('connection', (ws) => {
      ws.send('{"event":"info","version":1.1}')
      ws.on('message', (msg) => {
        ws.send('{"event":"subscribed","channel":"trades","chanId":33,"pair":"BTCUSD"}')
        ws.send([
          '[33,[[32970704,1495442718,2169.1,0.03647196],[32970701,1495442718,2169.1,0.01058338],',
          '[32970697,1495442717,2169,-0.0000791],[32970696,1495442717,2169,-0.01054738],',
          '[32970692,1495442716,2169,-0.01063712],[32970683,1495442715,2169,-0.00191556],',
          '[32970682,1495442715,2169,-0.02003456],[32970681,1495442715,2169,-0.02002811],',
          '[32970680,1495442715,2169,-0.01079782],[32970679,1495442715,2169,-0.02002726],',
          '[32970678,1495442715,2169,-0.01079782],[32970662,1495442714,2169,-3.68585828],',
          '[32970654,1495442712,2169,-0.01413205],[32970646,1495442711,2169,-0.01066102],',
          '[32970643,1495442710,2169,-0.02002146],[32970640,1495442709,2169,-0.01727607],',
          '[32970631,1495442708,2169,-0.00984518],[32970629,1495442708,2169,-1.07188465],',
          '[32970618,1495442706,2169,-0.0995877],[32970613,1495442706,2169,-0.015553],',
          '[32970595,1495442702,2169,-0.00864857],[32970593,1495442702,2169,-0.01999732],',
          '[32970592,1495442702,2169,-0.01067048],[32970591,1495442702,2169.1,0.92541262],',
          '[32970590,1495442702,2169.1,0.9787866],[32970589,1495442702,2169,-0.01067048],',
          '[32970573,1495442702,2169,-0.01067048],[32970572,1495442702,2169,-0.0172659],',
          '[32970569,1495442701,2169,-0.02000913],[32970567,1495442701,2169,-0.01413205]]]'
        ].join(''))
      })
    })

    ws = getWSInstance()

    ws.once('trade', (pair, data) => {
      t.is(pair, 'BTCUSD')
      t.is(typeof data[0].timestamp, 'number')
      t.is(typeof data[0].price, 'number')
      t.is(typeof data[0].amount, 'number')
    })

    ws.on('open', () => ws.subscribeTrades('BTCUSD'))
    ws.open()
  })
})
