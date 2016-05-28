const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(`${__dirname}/public/index.html`))
})

app.post('/', function (req, res) {
  const timestamp = new Date().valueOf()
  const data = req.body.data

  fs.writeFile(`data/data_${timestamp}`, data, function (err) {
    if (err) {
      res.status(300).send('Error')
    } else {
      exec(`./corenlp/corenlp.sh -annotators tokenize,ssplit,pos,lemma,ner -outputFormat text -file data/data_${timestamp}`, function (err) {
        if (err) {
          res.status(300).send('Error')
        } else {
          fs.readFile(`data_${timestamp}.out`, 'utf8', function (err, results) {
            if (err) {
              res.status(300).send('Error')
            } else {
              res.status(200).send(results)
            }
          })
        }
      })
    }
  })
})

app.listen(port, function () {
  console.log(`Click me if your terminal isn't suck http://localhost:${port}`)
})
