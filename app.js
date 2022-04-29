const express = require('express')
const app = express()

// #############################################################################
// Logs all request paths and method
app.use(function (req, res, next) {
  console.log(`current time: ${new Date().toISOString()}`)
  console.log(`env keys: ${Object.keys(process.env)}`)
  next();
  console.log('done')
});

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
  res.json({
      message: process.env.GREETING_MESSAGE||'empty process.env.GREETING_MESSAGE',
      path: req.originalUrl,
      at: new Date().toISOString(),
      params: req.params,
      env: filter(process.env, (k,v) => {return !k.startsWith('AWS')}),
      headers: req.headers
    })
    res.end()
})

function filter(obj, cb) {
  return Object.fromEntries(Object.entries(obj).filter(([key, val]) => cb(val, key)));
}

module.exports = app
