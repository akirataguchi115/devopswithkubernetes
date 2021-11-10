const Koa = require('koa')
const app = new Koa()
const PORT = 3001
const createRandomString = () => Math.random().toString(36).substr(2, 6)
const fs = require('fs')

const arrayOfStrings = []
const arrayOfTimestamps = []

const writeToFile = () => {
  const stringNow = createRandomString()
  const timeStampNow = Date(Date.now())
  arrayOfStrings.push(stringNow)
  arrayOfTimestamps.push(timeStampNow)
  fs.writeFile('/usr/src/app/files/stamps.txt', stringNow + ' : ' + timeStampNow, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written succesfully
  })
  setTimeout(writeToFile, 5000)
}

writeToFile()