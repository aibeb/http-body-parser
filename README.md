http-body-parser
===============

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![Gittip][gittip-image]][gittip-url]

[npm-image]: https://img.shields.io/npm/v/http-body-parser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/http-body-parser
[travis-image]: https://img.shields.io/travis/eqfox/http-body-parser.svg?style=flat-square
[travis-url]: https://travis-ci.org/eqfox/http-body-parser
[coveralls-image]: https://img.shields.io/coveralls/eqfox/http-body-parser.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/eqfox/http-body-parser?branch=master
[david-image]: https://img.shields.io/david/eqfox/http-body-parser.svg?style=flat-square
[david-url]: https://david-dm.org/eqfox/http-body-parser
[node-image]: https://img.shields.io/badge/node.js-%3E=_7.6-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/


🔥 A body parser for koa, express. support `json`, `form`, `text`, `multipart` and `stream` type body.

## Install

[![NPM](https://nodei.co/npm/http-body-parser.png?downloads=true)](https://nodei.co/npm/http-body-parser/)

## Usage

### Koa
```js
const Koa = require('koa');
const bodyParser = require('http-body-parser').koa;

const app = new Koa();
app.use(bodyParser({}));

app.use(async ctx => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
});
```

### Express
```js
const express = require('express');
const bodyParser = require('http-body-parser').express;

const app = express();
app.use(bodyParser({}));

server.use('/', function(req, res) {
  res.send(req.body)
})
```

## Features
* Based on the ES6 syntax, the code is concise
* No third party module dependent
* Support Koa and Express

## Options

- default options
```js
{
    enableTypes: ['json', 'form', 'text', 'multipart', 'stream'],
    json: {
      limit: 1024*1024,
      strict: true,
      extendsTypes: []
    },
    text: {
      limit: 1024*1024,
      extendsTypes: []
    },
    form: {
      limit: 56*1024,
      extendsTypes: []
    },
    stream: {
      limit: 1024*1024,
      path: `the operating system's default directory`
    },
    multipart: {
      limit: 1024*1024,
      path: `the operating system's default directory`
    }
}
```
* **enableTypes**: parser will only parse when request type hits enableTypes, default is `['json', 'form', 'text', 'multipart', 'stream']`.
* **encode**: requested encoding. Default is `utf-8`.
* **limit**: limit of the body. If the body ends up being larger than this limit, a 413 error code is returned.
* **strict**: when set to true, JSON parser will only accept arrays and objects. Default is `true`.
* **extendTypes**: support extend types, eg:  `application/x-javascript`
* **path**: which folder the uploaded files should be stored, active on `multipart, stream`

## Raw Body

You can access raw request body by `ctx.request.rawBody`
