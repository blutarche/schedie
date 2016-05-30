const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const exec = require('child_process').exec

const app = express()
const port = process.env.PORT || 3000
const corenlp = {
  'host': 'http://158.108.238.141:9000',
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
      let startDateTimeTokens = []
      let endDateTimeTokens = []
      let locationTokens = []
      let isStartTime = true
      tokens.forEach(function (token, index) {
        if (isNERDateTime(token)) {
          locationState = false
          if (index === 0 || (isNERDateTime(tokens[index - 1]) && isStartTime) || tokens[index - 1].pos.includes('NN')) {
            isStartTime = true
            startDateTimeTokens.push(token)
          } else if (tokens[index - 1].pos === 'IN') {
            isStartTime = true
            startDateTimeTokens.push(titleTokens.pop(), token)
          } else if (tokens[index - 1].pos === ':' || tokens[index - 1].pos === 'TO' || (isNERDateTime(tokens[index - 1]) && !isStartTime)) {
            isStartTime = false
            endDateTimeTokens.push(titleTokens.pop(), token)
          } else {
            titleTokens.push(token)
          }
        } else if (token.ner === 'LOCATION' || token.ner === 'ORGANIZATION' && index !== 0) {
          if (tokens[index - 1].pos === 'IN') {
            titleTokens.pop()
            locationTokens.push(token)
            locationState = true
          } else if (locationState) {
            locationTokens.push(token)
          } else {
            titleTokens.push(token)
          }
        } else {
          locationState = false
          titleTokens.push(token)
        }
      })
      const result = {
        title: "",
        startdate: "",
        enddate: "",
        starttime: "",
        endtime: "",
        location: ""
      }
      result.title = titleTokens.map((token) => token.word).join(" ")
      result.location = locationTokens.map((token) => token.word).join(" ")
      const startDateTime = separateDateTime(startDateTimeTokens)
      const endDateTime = separateDateTime(endDateTimeTokens)
      result.startdate = startDateTime.date
      result.enddate = endDateTime.date
      result.starttime = startDateTime.time
      result.endtime = endDateTime.time

      console.log("Tokens")
      console.log(tokens)
      console.log("Title")
      console.log(titleTokens)
      console.log("Start")
      console.log(startDateTimeTokens)
      console.log("End")
      console.log(endDateTimeTokens)
      console.log("Result")
      console.log(result)

      res.status(200).json(JSON.stringify(result))
    }
  })
})

app.listen(port, function () {
  console.log(`Click me if your terminal isn't suck http://localhost:${port}`)
})

function separateDateTime(dateTimeTokens) {
  const result = {
    date: "",
    time: ""
  }
  const resultDateTime = Array.from(new Set(dateTimeTokens
    .filter((token) => token.normalizedNER !== undefined)
    .map((token) => token.normalizedNER))
  )
  resultDateTime.forEach(function(dateTime) {
    if (dateTime[0] === 'T' && dateTime[3] === ':') {
      if (dateTime.length > 6) {
        const tmpTimeArray = dateTime.split(' ')
        result.time = tmpTimeArray[0]
        result.date = `${tmpTimeArray[1]} ${tmpTimeArray[2]}`
      } else {
        result.time = dateTime
      }
    } else if (dateTime[dateTime.length - 6] === 'T' && dateTime[dateTime.length - 3] === ':'){
      result.date = dateTime.substring(0, dateTime.length - 6)
      result.time = dateTime.substring(dateTime.length - 6)
    } else {
      result.date = dateTime
    }
  })
  return result
}

function isNERDateTime(token) {
  return token.ner === 'DATE' || token.ner === 'TIME'
}
