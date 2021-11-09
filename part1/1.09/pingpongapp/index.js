const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 3000

let pingAmount = 0 

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return

  pingAmount++
  ctx.body = `pong ${pingAmount}`
});

app.listen(PORT)
