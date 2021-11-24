const Koa = require('koa')
const app = new Koa()
const PORT = process.env.PORT || 3002
require('dotenv').config()

const { Pool } = require('pg')
const credentials = {
  user: "dbuser",
  host: "postgres-svc",
  database: "pingpongdb",
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
}
const pool = new Pool(credentials)
console.log(credentials)

const readPingsFromDb = async () => new Promise(res => {
  let currentPings = 0
    ; (async () => {
      const client = await pool.connect()
      try {
        let response = await client.query('SELECT * FROM pingpong')
        currentPings = await response.rows[0].pings
        await client.query('INSERT INTO pingpong(pings) VALUES ($1)', [currentPings + 1])
        await client.query('DELETE FROM pingpong WHERE pings=$1', [currentPings])
      } finally {
        // Make sure to release the client before any error handling,
        // just in case the error handling itself throws an error.
        client.release()
        res(currentPings)
      }
    })().catch(err => console.log(err.stack))
})

app.use(async ctx => {
  if (ctx.path.includes('favicon.ico')) return
  ctx.body = await readPingsFromDb()
  ctx.status = 200
});

app.listen(PORT)
