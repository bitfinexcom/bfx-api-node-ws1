## Modules

<dl>
<dt><del><a href="#module_bfx-api-node-ws1">bfx-api-node-ws1</a></del></dt>
<dd><p>This repo contains the reference implementation for version 1 of the
websocket Bitfinex API. It is deprecated in favour of version 2, and should
no longer be used.</p>
<p>For the version 2 API library, see <a href="https://github.com/bitfinexcom/bitfinex-api-node">bitfinex-api-node</a>.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#WSv1">WSv1</a> ⇐ <code>events.EventEmitter</code></dt>
<dd><p>Communicates with v1 of the Bitfinex WebSocket API</p>
</dd>
</dl>

<a name="module_bfx-api-node-ws1"></a>

## ~~bfx-api-node-ws1~~
***Deprecated***

This repo contains the reference implementation for version 1 of the
websocket Bitfinex API. It is deprecated in favour of version 2, and should
no longer be used.

For the version 2 API library, see [bitfinex-api-node](https://github.com/bitfinexcom/bitfinex-api-node).

**License**: MIT  
<a name="WSv1"></a>

## WSv1 ⇐ <code>events.EventEmitter</code>
Communicates with v1 of the Bitfinex WebSocket API

**Kind**: global class  
**Extends**: <code>events.EventEmitter</code>  

* [WSv1](#WSv1) ⇐ <code>events.EventEmitter</code>
    * [new WSv1(opts)](#new_WSv1_new)
    * [.isOpen()](#WSv1+isOpen) ⇒ <code>boolean</code>
    * [.open()](#WSv1+open)
    * [.close()](#WSv1+close)
    * [.send(msg)](#WSv1+send)
    * [.subscribeOrderBook(pair, [prec], [len])](#WSv1+subscribeOrderBook)
    * [.subscribeTrades(pair)](#WSv1+subscribeTrades)
    * [.subscribeTicker(pair)](#WSv1+subscribeTicker)
    * [.unsubscribe(chanId)](#WSv1+unsubscribe)
    * [.auth()](#WSv1+auth)

<a name="new_WSv1_new"></a>

### new WSv1(opts)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| opts | <code>object</code> |  | options |
| [opts.apiKey] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | API key |
| [opts.apiSecret] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | API secret |
| [opts.url] | <code>string</code> | <code>&quot;&#x27;wss://api.bitfinex.com/ws&#x27;&quot;</code> | connection url |

<a name="WSv1+isOpen"></a>

### wSv1.isOpen() ⇒ <code>boolean</code>
Returns status of websocket

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
**Returns**: <code>boolean</code> - open  
<a name="WSv1+open"></a>

### wSv1.open()
Opens a new websocket conection to the configured URL

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
<a name="WSv1+close"></a>

### wSv1.close()
Close the websocket connection

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
<a name="WSv1+send"></a>

### wSv1.send(msg)
Send a packet via the ws connection; automatically converted to a JSON
string.

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>object</code> \| <code>Array</code> | message |

<a name="WSv1+subscribeOrderBook"></a>

### wSv1.subscribeOrderBook(pair, [prec], [len])
Subscribe to order book updates. Snapshot will be sent as multiple updates.
Event will be emited as `PAIRNAME_book`.

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
**See**: http://docs.bitfinex.com/#order-books  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pair | <code>string</code> | <code>&quot;BTCUSD&quot;</code> | pair |
| [prec] | <code>string</code> | <code>&quot;&#x27;P0&#x27;&quot;</code> | price aggregation level (P0, P1, P2, P3) |
| [len] | <code>string</code> | <code>&quot;&#x27;25&#x27;&quot;</code> | number of price points. 25 or 100. |

<a name="WSv1+subscribeTrades"></a>

### wSv1.subscribeTrades(pair)
Subscribe to trades. Snapshot will be sent as multiple updates.
Event will be emited as `PAIRNAME_trades`.

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
**See**: http://docs.bitfinex.com/#trades75  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pair | <code>string</code> | <code>&quot;BTCUSD&quot;</code> | pair |

<a name="WSv1+subscribeTicker"></a>

### wSv1.subscribeTicker(pair)
Subscribe to ticker updates. The ticker is a high level overview of the
state of the market. It shows you the current best bid and ask, as well as
the last trade price.

Event will be emited as `PAIRNAME_ticker`.

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
**See**: http://docs.bitfinex.com/#ticker76  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pair | <code>string</code> | <code>&quot;BTCUSD&quot;</code> | pair |

<a name="WSv1+unsubscribe"></a>

### wSv1.unsubscribe(chanId)
Unsubscribe from a channel.

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  

| Param | Type | Description |
| --- | --- | --- |
| chanId | <code>number</code> | ID of the channel received on `subscribed` event |

<a name="WSv1+auth"></a>

### wSv1.auth()
Authenticate the user. Will receive executed traded updates.

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
**See**: http://docs.bitfinex.com/#wallet-updates  
