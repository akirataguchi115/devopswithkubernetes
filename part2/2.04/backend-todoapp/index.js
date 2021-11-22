const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const app = new Koa()
const serve = require('koa-static')
const views = require('koa-views')
const Router = require('koa-router')
app.use(serve('./public'))
const PORT = process.env.PORT || 3001
const router = new Router()
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')

require('dotenv').config()
const addressFrontend = process.env.FRONTEND
const directory = process.env.FILESDIR
const filePath = path.join(directory, 'image.jpg')
let todos = ['TODO 1', 'TODO 2']


app.use(views('./views', { map: { html: 'nunjucks' } }))
app.use(bodyParser())

const getFile = async () => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return console.log('FAILED TO READ FILE', '----------------', err)
    res(buffer)
  })
})

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false)
    return res(true)
  })
})

const findAFile = async () => {
  if (await fileAlreadyExists()) return

  await new Promise(res => fs.mkdir(directory, (err) => res()))
  const response = await axios.get('https://picsum.photos/200', { responseType: 'stream' })
  response.data.pipe(fs.createWriteStream(filePath))
}

router.get('/pic', async (ctx, next) => {
  if (ctx.path.includes('favicon.ico')) return
  findAFile()
  ctx.body = await getFile()
  ctx.set('Content-type', 'image/jpeg');
  ctx.status = 200
})
.get('/todos', async (ctx, next) => {
  ctx.body = JSON.stringify(todos)
  ctx.set('Content-type', 'application/json')
  ctx.status = 200
})
.post('/todos', (ctx, next) => {
  todos.push(ctx.request.body.content)
  ctx.redirect(addressFrontend)
  next()
})

app
  .use(cors({ origin: '*' }))
  .use(router.routes())
  .use(router.allowedMethods())

console.log('Started')

app.listen(PORT)