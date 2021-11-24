const Koa = require('koa')
const path = require('path')
const app = new Koa()
const PORT = process.env.PORT || 3000
const fs = require('fs')
const Router = require('koa-router')
const axios = require('axios').default
require('dotenv').config()

const directory = path.join(process.env.DIRECTORY)
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
  await axios.get(process.env.PINGPONGADDRESS)
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
  const message = process.env.MESSAGE
  return message + '\n'
  + timeStampNow + ': ' + hash + '\n'
  + 'Ping / Pongs: ' + pings
}

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return
  ctx.body = await readFiles()
  ctx.status = 200
})

app.listen(PORT)
