const querystring = require('querystring');

module.exports = class FormParser {
  constructor(body, headers, limit = 56 * 1024) {
    this.body = body;
    this.headers = headers;
    this.limit = limit;
  }

  parse() {
    return querystring.parse(this.body.toString(this.headers['content-encoding'] || 'utf8'))
  }

  static getTypes(extendsTypes = []) {
    let originTypes = new Array('application/x-www-form-urlencoded');
    return Array.from(new Set(originTypes.concat(extendsTypes)))
  }
}
