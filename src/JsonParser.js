class JsonParser {
  constructor(body, headers, limit = 1024 * 1024) {
    this.body = body;
    this.headers = headers;
    this.limit = limit;
  }

  parse() {
    return JSON.parse(this.body.toString(this.headers['content-encoding'] || 'utf8'));
  }

  static getTypes(extendsTypes = []) {
    const originTypes = ['application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/csp-report'];
    return Array.from(new Set(originTypes.concat(extendsTypes)));
  }
}

export default JsonParser;
