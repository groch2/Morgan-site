const express = require('express')
var serveStatic = require('serve-static')
const app = express()
const port = 3000

app.use(serveStatic('dist', { extensions: ['html'] }))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
