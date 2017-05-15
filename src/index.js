import JsonParser from './JsonParser';
import FormParser from './FormParser';
import TextParser from './TextParser';
import MultipartParser from './MultipartParser';
import StreamParser from './StreamParser';
import ParserFactory from './ParserFactory';

exports.koa = (options = {}) => async (ctx, next) => {
    // new parserFactory
  const parserFactory = new ParserFactory(ctx.req, options.enableTypes);
    // add parser to factory
  parserFactory.addParser('json', JsonParser, options.json);
  parserFactory.addParser('form', FormParser, options.form);
  parserFactory.addParser('text', TextParser, options.text);
  parserFactory.addParser('multipart', MultipartParser, options.multipart);
  parserFactory.addParser('stream', StreamParser, options.stream);
    // get request body
  const body = await parserFactory.getBody();
    // parse body
  const parser = parserFactory.getEnableParser(body);
  if (parser) {
    ctx.request.rawBody = body;
    ctx.request.body = parser.parse();
  }
  await next();
};

exports.express = (options = {}) => async (req, res, next) => {
  try {
    // new parserFactory
    const parserFactory = new ParserFactory(req, options.enableTypes);
    // add parser to factory
    parserFactory.addParser('json', JsonParser, options.json);
    parserFactory.addParser('form', FormParser, options.form);
    parserFactory.addParser('text', TextParser, options.text);
    parserFactory.addParser('multipart', MultipartParser, options.multipart);
    parserFactory.addParser('stream', StreamParser, options.stream);
    // get request body
    const body = await parserFactory.getBody();
    // parse body
    const parser = parserFactory.getEnableParser(body);
    if (parser) {
      req.rawBody = body;
      req.body = parser.parse();
    }
  } catch (e) {
    return next(e);
  }
  await next();
};
