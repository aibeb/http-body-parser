class TextParser {
  constructor(body, headers, limit = 1024 * 1024) {
    this.body = body;
    this.headers = headers;
    this.limit = limit;
  }

  parse() {
    return this.body.toString(this.headers['content-encoding'] || 'utf8');
  }

  static getTypes(extendsTypes = []) {
    const originTypes = new Array('text/plain');
    return Array.from(new Set(originTypes.concat(extendsTypes)));
  }
}

module.exports = TextParser;
