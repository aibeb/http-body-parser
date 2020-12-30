const uuid = require('uuid');
const Path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');

class StreamParser {
  constructor(body, headers, limit = 1024 * 1024, path = os.tmpdir()) {
    this.body = body;
    this.headers = headers;
    this.limit = limit;
    this.path = path;
  }

  parse() {
    const filename = uuid();
    const file = {
      name: filename,
      path: Path.join(this.path, filename),
      mimetype: null,
      size: this.body.length,
      sha256: crypto.createHash('sha256').update(this.body).digest('hex'),
    };
    const dirname = Path.dirname(file.path);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }
    fs.writeFileSync(file.path, this.body);
    return file;
  }

  static getTypes(extendsTypes = []) {
    const originTypes = new Array('application/octet-stream');
    return Array.from(new Set(originTypes.concat(extendsTypes)));
  }
}

export default StreamParser;
