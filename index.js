const JsonParser = require('./models/JsonParser.js');
const FormParser = require('./models/FormParser.js');
const TextParser = require('./models/TextParser.js');
const MultipartParser = require('./models/MultipartParser.js');
const StreamParser = require('./models/StreamParser.js');
const typeIs = require('./lib/TypeIs.js');

class ParserFactory {
  constructor(req, enableTypes = [
    'json', 'form', 'text', 'multipart', 'stream'
  ], parsers = {}) {
    this.req = req;
    this.enableTypes = enableTypes;
    this.parsers = parsers;
  }

  addParser(name, Parser, options = {}) {
    Parser.options = options;
    this.parsers[name] = Parser
  }

  getBody() {
    return new Promise((resolve, reject) => {
      const data = [];
      this.req.on('data', (chunk) => {
        if (data.length + chunk.length > this.limit) {
          throw new Error('invalid content length');
        }
        data.push(chunk);
      });
      this.req.on('end', () => {
        return resolve(Buffer.concat(data));
      });
    });
  }

  getEnableParser(body) {
    for (let [name,
      Parser]of Object.entries(this.parsers)) {
      if (this.enableTypes.includes(name)) {
        if (typeIs(this.req, Parser.getTypes(Parser.options.extendsTypes))) {
          return new Parser(body, this.req.headers);
        }
      }
    }
  }
}

// Middleware
// options = {enableTypes:['json', 'form'], json: {}, text: {}}
module.exports = (options = {}) => {
  return async(ctx, next) => {
    // new parserFactory
    let parserFactory = new ParserFactory(ctx.req, options.enableTypes);
    // add parser to factory
    parserFactory.addParser('json', JsonParser, options.json);
    parserFactory.addParser('form', FormParser, options.form);
    parserFactory.addParser('text', TextParser, options.text);
    parserFactory.addParser('multipart', MultipartParser, options.multipart);
    parserFactory.addParser('stream', StreamParser, options.stream);
    // get request body
    let body = await parserFactory.getBody();
    // parse body
    let parser = parserFactory.getEnableParser(body);
    if (parser) {
      ctx.request.rawBody = body;
      ctx.request.body = parser.parse();
    }
    await next();
  };
}
