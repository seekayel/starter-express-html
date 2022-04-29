const express = require('express')
const path = require("path");
const app = express()

function filter(obj, cb) {
  return Object.fromEntries(Object.entries(obj).filter(([key, val]) => cb(val, key)));
}

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options))

app.use('/error', async (req, res) => {
  throw new Error('Forcing an error')
})

app.use('/status/:code?', async (req, res) => {
  res.statusCode = req.params.code || 200
  res.send(`Sending status: ${res.statusCode}`)
  res.end()
})

// #############################################################################
// Catch all handler for all other request.
app.use('*', (req,res) => {
//   var region = (process.env.region)? process.env.region : 'undefined'
  res.json({
      message: 'msg: have a nice day',
      path: req.originalUrl,
      at: new Date().toISOString(),
      params: req.params,
      env: filter(process.env, (k,v) => {return !k.startsWith('AWS')}),
      headers: req.headers
    })
    .end()
})

module.exports = app
