const parse = require('./lib');

// I like concise code, so I wrote this library
module.exports = (opts) => {
  opts = opts || {};
  let detectJSON = opts.detectJSON;
  let onerror = opts.onerror;

  let enableTypes = opts.enableTypes || ['json', 'form'];
  let enableForm = checkEnable(enableTypes, 'form');
  let enableJson = checkEnable(enableTypes, 'json');
  let enableText = checkEnable(enableTypes, 'text');

  opts.detectJSON = undefined;
  opts.onerror = undefined;

  // force co-body return raw body
  opts.returnRawBody = true;

  // default json types
  let jsonTypes = ['application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/csp-report'];

  // default form types
  let formTypes = ['application/x-www-form-urlencoded'];

  // default text types
  let textTypes = ['text/plain'];

  let jsonOpts = opts;
  let formOpts = opts;
  let textOpts = opts;

  let extendTypes = opts.extendTypes || {};

  extendType(jsonTypes, extendTypes.json);
  extendType(formTypes, extendTypes.form);
  extendType(textTypes, extendTypes.text);

  return async(ctx, next) => {
    if (ctx.request.body !== undefined)
      return await next();
    if (ctx.disableBodyParser)
      return await next();
    try {
      const res = await parseBody(ctx);
      ctx.request.body = 'parsed' in res
        ? res.parsed
        : {};
      if (ctx.request.rawBody === undefined)
        ctx.request.rawBody = res.raw;
      }
    catch (err) {
      if (onerror) {
        onerror(err, ctx);
      } else {
        throw err;
      }
    }
    await next();
  };

  async function parseBody(ctx) {
    if (enableJson && ((detectJSON && detectJSON(ctx)) || ctx.request.is(jsonTypes))) {
      return await parse.json(ctx, jsonOpts);
    }
    if (enableForm && ctx.request.is(formTypes)) {
      return await parse.form(ctx, formOpts);
    }
    if (enableText && ctx.request.is(textTypes)) {
      return await parse.text(ctx, textOpts) || '';
    }
    return {};
  }
};

extendType(original, extend) => {
  if (extend) {
    if (!Array.isArray(extend)) {
      extend = [extend];
    }
    extend.forEach(function(extend) {
      original.push(extend);
    });
  }
}

checkEnable(types, type) => {
  return types.indexOf(type) >= 0;
}
