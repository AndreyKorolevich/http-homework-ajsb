const http = require('http');
const path = require('path');
const Tiket = require('./Tiket');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const app = new Koa();

const public = path.join(__dirname, '/public')
app.use(koaStatic(public));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUD, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(async ctx => {
    const { method } = ctx.request.querystring;
    switch (method) {
        case 'allTickets':
            ctx.response.body = await Tiket.getAll();
            ctx.response.status = 200;
            return;
        case 'ticketById':
            const tiketId = await Tiket.getById(ctx.request.querystring.id);
            ctx.response.body = tiketId;
            return;
        case 'createTicket':
            const tiket = new Tiket(ctx.request.body.name, ctx.request.body.description, ctx.request.body.status);
            await tiket.save();
            return;
        default:
            ctx.response.status = 404;
            return;
    }
});


const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);
