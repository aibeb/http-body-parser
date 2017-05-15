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
    let parser = null;
    Object.entries(this.parsers).forEach(([name, Parser]) => {
      if (this.enableTypes.includes(name)) {
        if (typeIs(this.req, Parser.getTypes(Parser.options.extendsTypes))) {
          parser = new Parser(body, this.req.headers, Parser.options.limit, Parser.options.path);
        }
      }
    });
    return parser;
  }
}

export default ParserFactory;
