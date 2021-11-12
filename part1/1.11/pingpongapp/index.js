const Koa = require('koa')
const path = require('path')
const app = new Koa()
const PORT = process.env.PORT || 3002
const fs = require('fs')

const directory = path.join('/', 'usr', 'src', 'app', 'files')
// const directory = path.join('../')
const filePath = path.join(directory, 'pings.txt')

let pings = 7

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false)
    return res(true)
  })
})

const writePings = async () => {
  fs.writeFile(filePath, (pings).toString(), function (err) {
    if (err) return console.log(err)
  })
}

const readPings = async () => new Promise(res => {
  fs.readFile(filePath, 'utf8', (err, buffer) => {
    if (err) {
      return console.log('FAILED TO READ FILE', '--------------', err)
    }
    pings = buffer
    res(++pings)
  })
})

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return
  if (!await fileAlreadyExists()) {
    fs.mkdir(directory, (err) => console.log('error ', err))
    ctx.body = 1
    pings = 1
  } else {
    ctx.body = await readPings()
  }
  writePings()
  ctx.status = 200
});

app.listen(PORT)
