/*  This file is setting up a ExpressJS server
* to support the Next.js Server
*/
const express = require('express')
const next = require('next')
const port = 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.get('*', (request, response) => {
    return handle(request, response)
  })

  server.listen(port, (error) => {
    if (error) throw error
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
