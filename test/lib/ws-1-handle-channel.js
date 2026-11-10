'use strict'

const test = require('brittle')
const BfxWs = require('../../lib/ws')

const bfxWs = new BfxWs({
  apiKey: 'dummy',
  apiSecret: 'dummy'
})

test('ws1 channel msg handling', async (t) => {
  await t.test('ws1 transforms & normalizes well - R0 update', (t) => {
    t.plan(1)

    bfxWs._channelMap = {
      32755: { channel: 'book', prec: 'R0', symbol: 'tBTCUSD' }
    }

    bfxWs.once('orderbook', (symbol, data) => {
      t.alike(data, { price: 2477.1, orderId: 2919111002, amount: 0.0125 })
    })

    bfxWs._handleChannel([32755, 2919111002, 2477.1, 0.0125])
  })

  await t.test('ws1 transforms & normalizes well - P1 update', (t) => {
    t.plan(1)

    bfxWs._channelMap = {
      182: { channel: 'book', prec: 'P1', symbol: 'tBTCUSD' }
    }

    bfxWs.once('orderbook', (symbol, data) => {
      t.alike(data, { price: 2494, count: 2, amount: 5.9895 })
    })

    bfxWs._handleChannel([182, 2494, 2, 5.9895])
  })

  await t.test('ws1 transforms & normalizes well - P1 snap', (t) => {
    t.plan(1)

    bfxWs._channelMap = {
      39: { channel: 'book', prec: 'P1', symbol: 'tBTCUSD' }
    }

    bfxWs.once('orderbook', (symbol, data) => {
      t.alike(data[1], { price: 2494, count: 3, amount: 0.14606853 })
    })

    const snap = [39, [
      [2495, 2, 0.8744],
      [2494, 3, 0.14606853],
      [2492, 1, 0.4]
    ]]

    bfxWs._handleChannel(snap)
  })

  await t.test('ws1 transforms & normalizes well - R0 snap', (t) => {
    t.plan(1)

    bfxWs._channelMap = {
      34513: { channel: 'book', prec: 'R0', symbol: 'tBTCUSD' }
    }

    bfxWs.once('orderbook', (symbol, data) => {
      t.alike(
        data[1],
        { price: 2494.5, orderId: 2919279471, amount: 0.07288 }
      )
    })

    const snap = [34513, [
      [2919278474, 2494.5, 0.07901704],
      [2919279471, 2494.5, 0.07288],
      [2919280093, 2494.5, 0.03644]
    ]]

    bfxWs._handleChannel(snap)
  })
})
