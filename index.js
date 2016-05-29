const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const exec = require('child_process').exec

const app = express()
const port = process.env.PORT || 3000
const corenlp = {
  'host': 'localhost:9000',
  'properties': {
    'tokenize.whitespace': 'true',
    'annotators': 'ner', // tokenize, ssplit, pos, lemma, ner, depparse, coref, natlog, openie
    'outputFormat': 'json'
  }
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(`${__dirname}/public/index.html`))
})

app.post('/', function (req, res) {
  const input = req.body.data
  const command = `wget --post-data '${input}' '${corenlp.host}/?properties=${JSON.stringify(corenlp.properties)}' -O -`
  exec(command, function (err, stdout) {
    if (err) {
      res.status(300).send('Error')
    } else {
      const corenlpResult = JSON.parse(stdout)
      const tokens = corenlpResult.sentences[0].tokens.map(function (token) {
        return {
          word: token.word,
          pos: token.pos,
          ner: token.ner,
          normalizedNER: token.normalizedNER
        }
      })
      let titleTokens = []
      let dateTimeTokens = []
      tokens.forEach(function (token, index) {
        if (isNERDateTime(token)) {
          if (index === 0 || isNERDateTime(tokens[index - 1])) {
            dateTimeTokens.push(token)
          } else if (tokens[index - 1].pos === 'IN' || tokens[index - 1].pos === ':') {
            dateTimeTokens.push(titleTokens.pop(), token)
          } else {
            titleTokens.push(token)
          }
        } else {
          titleTokens.push(token)
        }
      })
      const result = {}
      result.title = titleTokens.map((token) => token.word).join(" ")
      const resultDateTime = Array.from(new Set(dateTimeTokens
        .filter((token) => token.normalizedNER !== undefined)
        .map((token) => token.normalizedNER))
      )
      resultDateTime.forEach(function(dateTime) {
        if (dateTime[0] === 'T' && dateTime[3] === ':') {
          result.time = dateTime.substring()
        } else if (dateTime[dateTime.length - 6] === 'T'){
          result.date = dateTime.substring(0, dateTime.length - 6)
          result.time = dateTime.substring(dateTime.length - 6)
        } else {
          result.date = dateTime
        }
      })
      result.time = result.time.substring(1)
      res.status(200).send(JSON.stringify(result))
    }
  })
})

app.listen(port, function () {
  console.log(`Click me if your terminal isn't suck http://localhost:${port}`)
})

function isNERDateTime(token) {
  return token.ner === 'DATE' || token.ner === 'TIME'
}
