const strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/;

class JsonParser {
  constructor(body, headers, limit = 1024 * 1024) {
    this.body = body;
    this.headers = headers;
    this.limit = limit;
  }

  parse() {
    if (!strictJSONReg.test(this.body)) {
      throw new Error('invalid JSON, only supports object and array');
    }
    return JSON.parse(this.body.toString(this.headers['content-encoding'] || 'utf8'));
  }

  static getTypes(extendsTypes = []) {
    let originTypes = new Array('application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/csp-report');
    return Array.from(new Set(originTypes.concat(extendsTypes)))
  }
}

module.exports = JsonParser
