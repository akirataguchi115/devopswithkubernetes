const Koa = require('koa')
const path = require('path')
const app = new Koa()
const PORT = process.env.PORT || 3000
const fs = require('fs')
const Router = require('koa-router')
const axios = require('axios').default

const directory = path.join('/', 'usr', 'src', 'app', 'files')
// const directory = path.join('../')
const filePath = path.join(directory, 'stamps.txt')
var router = new Router()

let timeStampNow = ''
let hash = ''
let pings = 0

const readFile = () => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) {
      return console.log('FAILED TO READ FILE', '--------------', err)
    }
    timeStampNow = new Date(Date.now()).toISOString()
    hash = buffer
    res()
  })
})

const readFiles = async () => {
  await readFile()
  // axios.get('http://localhost:3002/')
  await axios.get('http://pingpongapp-svc:2346')
    .then(function (response) {
      pings = response.data
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  return timeStampNow + ': ' + hash + '\nPing / Pongs: ' + pings
}

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return
  ctx.body = await readFiles()
  ctx.status = 200
})

app.listen(PORT)
