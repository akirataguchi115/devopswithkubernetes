const Koa = require('koa')
const path = require('path')
const app = new Koa()
const PORT = process.env.PORT || 3000
const fs = require('fs')

const directory = path.join('/', 'usr', 'src', 'app', 'files')
// const directory = path.join('../')
const filePath = path.join(directory, 'stamps.txt')
const pingPath = path.join(directory, 'pings.txt')

let timeStampNow = ''
let hash = ''
let pings = 0

const readFiles = async () => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) {
      return console.log('FAILED TO READ FILE', '--------------', err)
    }
    timeStampNow = new Date(Date.now()).toISOString()
    hash = buffer
  })
  fs.readFile(pingPath, (err, buffer) => {
    if (err) {
      return console.log('FAILED TO READ FILE', '--------------', err)
    }
    pings = buffer
  })
  res(timeStampNow + ': ' + hash + '\nPing / Pongs: ' + pings)
})

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return
  ctx.body = await readFiles()
  ctx.status = 200
});

app.listen(PORT)
