const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const app = new Koa()
const PORT = process.env.PORT || 3000

const directory = path.join('/', 'usr', 'src', 'app', 'files')
// const directory = path.join('./', 'files')
const filePath = path.join(directory, 'image.jpg')

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
  const response = await axios.get('https://picsum.photos/500', { responseType: 'stream' })
  response.data.pipe(fs.createWriteStream(filePath))
}

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return
  findAFile()
  ctx.body = await getFile()
  ctx.set('Content-type', 'image/jpeg');
  ctx.status = 200
});

console.log('Started')

app.listen(PORT)