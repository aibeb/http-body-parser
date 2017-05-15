const Koa = require('koa');
const test = require('ava');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const bodyParser = require('../lib').koa;
const image1 = path.join(__dirname, 'image1.jpg');
const image2 = path.join(__dirname, 'image2.jpg');

const app = new Koa();
app.use(async (ctx, next) => {
  await next();
});
app.use(bodyParser({
  enableTypes: [
    'json', 'form', 'text', 'multipart', 'stream',
  ],
  stream: {
    path: 'uploads/',
  },
}));
app.use((ctx) => {
  ctx.body = ctx.request.body;
});
const server = app.listen();

test('JSON', async (t) => {
  t.plan(2);
  const res = await request(server).post('/').set('Content-Type', 'application/json').send({ name: 'eqfox' });
  t.is(res.status, 200);
  t.deepEqual(res.body, { name: 'eqfox' });
});

test('Form', async (t) => {
  t.plan(2);
  const res = await request(server).post('/').set('Content-Type', 'application/x-www-form-urlencoded').send('name=eqfox');
  t.is(res.status, 200);
  t.deepEqual(res.body, { name: 'eqfox' });
});

test('Text', async (t) => {
  t.plan(2);
  const res = await request(server).post('/').set('Content-Type', 'text/plain').send('eqfox');
  t.is(res.status, 200);
  t.is(res.text, 'eqfox');
});

test('Multipart', async (t) => {
  t.plan(4);
  const res = await request(server).post('/').field('name', 'eqfox').attach('image1', image1).attach('image2', image2);
  t.is(res.status, 200);
  t.deepEqual(res.body.name, 'eqfox');
  t.deepEqual(res.body.image1.name, 'image1.jpg');
  t.deepEqual(res.body.image2.name, 'image2.jpg');
});

test('Stream', async (t) => {
  t.plan(2);
  const res = await request(server).post('/').set('Content-Type', 'application/octet-stream').send(fs.readFileSync(image1));
  t.is(res.status, 200);
  t.true(res.body.name != undefined);
});
