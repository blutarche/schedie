const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const exec = require('child_process').exec

const app = express()
const port = process.env.PORT || 3000
const corenlp = {
  'host': 'corenlp.run',
  'properties': {
    "tokenize.whitespace": "true",
    "annotators": "tokenize, ssplit, pos, ner",
    "outputFormat": "json"
  }
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(`${__dirname}/public/index.html`))
})

app.post('/', function (req, res) {
  exec(`wget --post-data '${req.body.data}' '${corenlp.host}/?properties=${JSON.stringify(corenlp.preperties)}' -O -`, function (err, stdout) {
    if (err) {
      res.status(300).send('Error')
    } else {
      res.status(200).send(stdout)
    }
  })
})

app.listen(port, function () {
  console.log(`Click me if your terminal isn't suck http://localhost:${port}`)
})
