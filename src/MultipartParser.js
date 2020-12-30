import fs from 'fs';
import Path from 'path';
import crypto from 'crypto';
import os from 'os';

class MultipartParser {
  constructor(body, headers, limit = 1024 * 1024, path = os.tmpdir()) {
    this.body = body;
    this.headers = headers;
    this.limit = limit;
    this.path = path;
    this.boundary = Buffer.from(`--${headers['content-type'].split(';').pop().replace('boundary=', '').trim()}`);
  }

  parse() {
    let begin = 0;
    const body = {};
    while (begin < this.body.length) {
      const end = this.body.indexOf(this.boundary, begin + this.boundary.length);
      if (end === -1) { break; }
      const fieldStart = begin + this.boundary.length + 2;
      const fieldEnd = this.body.indexOf(Buffer.from([0x0d, 0x0a]), fieldStart);
      const field = this.body.slice(fieldStart, fieldEnd);
      const nameMatch = field.toString().match(/\bname=("([^"]*)"|([^\(\)<>@,;:\\"\/\[\]\?=\{\}\s\t/]+))/i);
      const filenameMatch = field.toString().match(/\bfilename=("(.*?)"|([^\(\)<>@,;:\\"\/\[\]\?=\{\}\s\t/]+))($|;\s)/i);
      if (!nameMatch) {
        break;
      }
      if (!filenameMatch) {
        const valueStart = fieldEnd + 2 + 2;
        const valueEnd = this.body.indexOf(Buffer.from([0x0d, 0x0a]), valueStart);
        const value = this.body.slice(valueStart, valueEnd);
        body[nameMatch[2]] = value.toString();
      } else {
        const valueStart = this.body.indexOf(Buffer.from([0x0d, 0x0a]), fieldEnd + 2) + 2 + 2;
        const valueEnd = this.body.indexOf(Buffer.from([0x0d, 0x0a]), valueStart);
        const value = this.body.slice(valueStart, valueEnd);
        body[nameMatch[2]] = {
          name: filenameMatch[2],
          path: Path.join(this.path, filenameMatch[2]),
          mimetype: null,
          size: value.length,
          sha256: crypto.createHash('sha256').update(value).digest('hex'),
        };
        fs.writeFileSync(Path.join(this.path, filenameMatch[2]), value);
      }
      begin = end;
    }
    return body;
  }

  static getTypes(extendsTypes = []) {
    const originTypes = new Array('multipart/form-data');
    return Array.from(new Set(originTypes.concat(extendsTypes)));
  }
}

export default MultipartParser;
