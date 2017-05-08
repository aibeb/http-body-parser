const uuid = require('uuid');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

class StreamParser {
  constructor(body, headers, limit) {
    this.body = body;
    this.headers = headers;
    this.limit = limit;
  }

  parse() {
    let filename = uuid();
    let file = {
      name: filename,
      path: path.join('uploads', filename),
      mimetype: null,
      size: this.body.length,
      sha256: crypto.createHash('sha256').update(this.body).digest("hex")
    };
    fs.writeFileSync(file.path, this.body)
    return file
  }

  static getTypes(extendsTypes = []) {
    let originTypes = new Array('application/octet-stream');
    return Array.from(new Set(originTypes.concat(extendsTypes)))
  }
}

module.exports = StreamParser
