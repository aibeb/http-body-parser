koa-bodyparser
===============

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![Gittip][gittip-image]][gittip-url]

[npm-image]: https://img.shields.io/npm/v/koa-bodyparser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-bodyparser
[travis-image]: https://img.shields.io/travis/koajs/bodyparser.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/bodyparser
[coveralls-image]: https://img.shields.io/coveralls/koajs/bodyparser.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/bodyparser?branch=master
[david-image]: https://img.shields.io/david/koajs/bodyparser.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/bodyparser
[node-image]: https://img.shields.io/badge/node.js-%3E=_7.6-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/


A body parser for koa, express. support `json`, `form`, `text`, `multipart` and `stream` type body.

## Install

[![NPM](https://nodei.co/npm/koa-bodyparser.png?downloads=true)](https://nodei.co/npm/koa-bodyparser/)

## Usage

```js
const Koa = require('koa');
const bodyParser = require('http-body-parser');

const app = new Koa();
app.use(bodyParser({

}));

app.use(async ctx => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
});
```

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
      limit: 1024*1024
    },
    multipart: {
      limit: 1024*1024
    }
}
```
* **enableTypes**: parser will only parse when request type hits enableTypes, default is `['json', 'form', 'text', 'multipart', 'stream']`.
* **encode**: requested encoding. Default is `utf-8`.
* **limit**: limit of the body. If the body ends up being larger than this limit, a 413 error code is returned. Default is `56kb`.
* **strict**: when set to true, JSON parser will only accept arrays and objects. Default is `true`.
* **extendTypes**: support extend types, eg:  `['application/x-javascript']`

## Raw Body

You can access raw request body by `ctx.request.rawBody`
