import JsonParser from './JsonParser';
import FormParser from './FormParser';
import TextParser from './TextParser';
import MultipartParser from './MultipartParser';
import StreamParser from './StreamParser';
import typeIs from './TypeIs';

class ParserFactory {
  constructor(req, enableTypes = [
    'json', 'form', 'text', 'multipart', 'stream',
  ], parsers = {}) {
    this.req = req;
    this.enableTypes = enableTypes;
    this.parsers = parsers;
  }

  addParser(name, _Parser, options = {}) {
    const Parser = _Parser;
    Parser.options = options;
    this.parsers[name] = Parser;
  }

  getBody() {
    return new Promise((resolve) => {
      const data = [];
      this.req.on('data', (chunk) => {
        if (data.length + chunk.length > this.limit) {
          throw new Error('invalid content length');
        }
        data.push(chunk);
      });
      this.req.on('end', () => resolve(Buffer.concat(data)));
    });
  }

  getEnableParser(body) {
    Object.entries(this.parsers).forEach(([name, Parser]) => {
      if (this.enableTypes.includes(name)) {
        if (typeIs(this.req, Parser.getTypes(Parser.options.extendsTypes))) {
          return new Parser(body, this.req.headers, Parser.options.limit, Parser.options.path);
        }
      }
      return null;
    });
  }
}

module.exports.koa = (options = {}) => async (ctx, next) => {
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

module.exports.express = (options = {}) => async (req, res, next) => {
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
  await next();
};
