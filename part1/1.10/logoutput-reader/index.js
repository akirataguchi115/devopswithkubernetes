const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 3000
const createRandomString = () => Math.random().toString(36).substr(2, 6)
const fs = require('fs')

const arrayOfStrings = []
const arrayOfTimestamps = []

let text = 'waiting for read'

const findAFile = async () => {
  fs.readFile('/usr/src/app/files/stamps.txt', 'utf8', (err, data) => {
    if (err) {
      return
    }
    text = data
  })
}

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return
  const stringNow = createRandomString()
  const timeStampNow = Date(Date.now())
  arrayOfStrings.push(stringNow)
  arrayOfTimestamps.push(timeStampNow)
  await findAFile()
  ctx.body = text
});

app.listen(PORT)
