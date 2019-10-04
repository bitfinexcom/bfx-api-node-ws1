<a name="WSv1"></a>

## WSv1
Communicates with v1 of the Bitfinex WebSocket API

**Kind**: global class  

* [WSv1](#WSv1)
    * [new WSv1()](#new_WSv1_new)
    * [.open()](#WSv1+open)
    * [.close()](#WSv1+close)
    * [.send(msg)](#WSv1+send)
    * [.subscribeOrderBook(pair, precision, length)](#WSv1+subscribeOrderBook)
    * [.subscribeTrades(pair)](#WSv1+subscribeTrades)
    * [.subscribeTicker(pair)](#WSv1+subscribeTicker)
    * [.unsubscribe(chanId)](#WSv1+unsubscribe)
    * [.auth()](#WSv1+auth)

<a name="new_WSv1_new"></a>

### new WSv1()

| Param | Type | Description |
| --- | --- | --- |
| opts.apiKey | <code>sting</code> |  |
| opts.apiSecret | <code>string</code> |  |
| opts.url | <code>string</code> | ws connection url |

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

| Param | Type |
| --- | --- |
| msg | <code>\*</code> | 

<a name="WSv1+subscribeOrderBook"></a>

### wSv1.subscribeOrderBook(pair, precision, length)
Subscribe to order book updates. Snapshot will be sent as multiple updates.
Event will be emited as `PAIRNAME_book`.

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
**See**: http://docs.bitfinex.com/#order-books  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pair | <code>string</code> | <code>&quot;BTCUSD&quot;</code> |  |
| precision | <code>string</code> |  | price aggregation level (P0 (def), P1, P2, P3) |
| length | <code>string</code> |  | number of price points. 25 (default) or 100. |

<a name="WSv1+subscribeTrades"></a>

### wSv1.subscribeTrades(pair)
Subscribe to trades. Snapshot will be sent as multiple updates.
Event will be emited as `PAIRNAME_trades`.

**Kind**: instance method of [<code>WSv1</code>](#WSv1)  
**See**: http://docs.bitfinex.com/#trades75  

| Param | Type | Default |
| --- | --- | --- |
| pair | <code>string</code> | <code>&quot;BTCUSD&quot;</code> | 

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
