const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 3000
const createRandomString = () => Math.random().toString(36).substr(2, 6)

const arrayOfStrings = []
const arrayOfTimestamps = []

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return

  const stringNow = createRandomString()
  const timeStampNow = Date(Date.now())
  arrayOfStrings.push(stringNow)
  arrayOfTimestamps.push(timeStampNow)
  console.log('--------------------')
  console.log(`Responding with ${stringNow}`)
  ctx.body = `${timeStampNow} : ${stringNow}`
});

app.listen(PORT)
