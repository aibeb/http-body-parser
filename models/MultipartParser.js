const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const uuid = require('uuid');

class MultipartParser {
  constructor(body, headers, limit = 1024 * 1024) {
    this.body = body;
    this.headers = headers;
    this.limit = limit;
    this.boundary = Buffer.from('--' + headers['content-type'].split(';').pop().replace('boundary=', '').trim());
  }

  parse() {
    let begin = 0;
    const body = {};
    while (begin < this.body.length) {
      let end = this.body.indexOf(this.boundary, begin + this.boundary.length);
      if (end === -1)
        break;
      let field_start = begin + this.boundary.length + 2;
      let field_end = this.body.indexOf(Buffer.from([0x0d, 0x0a]), field_start);
      let field = this.body.slice(field_start, field_end);
      let name_match = field.toString().match(/\bname=("([^"]*)"|([^\(\)<>@,;:\\"\/\[\]\?=\{\}\s\t/]+))/i);
      let filename_match = field.toString().match(/\bfilename=("(.*?)"|([^\(\)<>@,;:\\"\/\[\]\?=\{\}\s\t/]+))($|;\s)/i);
      if (!name_match) {
        break;
      }
      if (!filename_match) {
        let value_start = field_end + 2 + 2;
        let value_end = this.body.indexOf(Buffer.from([0x0d, 0x0a]), value_start);
        let value = this.body.slice(value_start, value_end);
        body[name_match[2]] = value.toString();
      } else {
        let value_start = this.body.indexOf(Buffer.from([0x0d, 0x0a]), field_end + 2) + 2 + 2;
        let value_end = this.body.indexOf(Buffer.from([0x0d, 0x0a]), value_start);
        let value = this.body.slice(value_start, value_end);
        body[name_match[2]] = {
          name: filename_match[2],
          path: path.join('uploads', filename_match[2]),
          mimetype: null,
          size: value.length,
          sha256: crypto.createHash('sha256').update(value).digest("hex")
        };
        fs.writeFileSync(path.join('uploads', filename_match[2]), value)
      }
      begin = end;
    }
    return body
  }

  static getTypes(extendsTypes = []) {
    let originTypes = new Array('multipart/form-data');
    return Array.from(new Set(originTypes.concat(extendsTypes)))
  }
}

module.exports = MultipartParser
