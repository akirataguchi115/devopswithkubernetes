const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
require('dotenv').config()

const directory = path.join(process.env.DIRECTORY)
const filePath = path.join(directory, 'stamps.txt')

const writeToFile = async () => {
  await new Promise(res => fs.mkdir(directory, (err) => res()))
  fs.writeFile(filePath, crypto.randomBytes(20).toString('hex'), function (err) {
    if (err) return console.log(err)
  })
  setTimeout(writeToFile, 5000)
}

writeToFile()