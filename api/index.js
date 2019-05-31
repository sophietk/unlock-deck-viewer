const express = require('express')
const PDFImage = require('pdf-image').PDFImage
const gm = require('gm').subClass({imageMagick: true})
const fs = require('fs')
const app = express()

const pdfCardWidth = 720
const pdfCardHeight = 1323
const pdfMarginLeft = 130
const pdfMarginTop = 505

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => {
  res.send('Back')
})

app.get('/decks', (req, res) => {
  fs.readdir(__dirname + '/decks/', function (err, files) {
    if (err) {
      console.error(err)
      res.status(500).send(err)
      return
    }

    const decks = files
      .filter(file => file.includes('.pdf'))
      .map(file => file.replace('.pdf', ''))
    res.send(decks)
  })
})

app.get('/decks/:deckId/pages/:pageId', (req, res) => {
  const deckId = req.params.deckId
  const pageId = req.params.pageId

  getPage(__dirname + `/decks/${deckId}.pdf`, 0)
    .then(pagePath => res.sendFile(pagePath))
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
})

app.get('/decks/:deckId/cards/:cardId/:face', (req, res) => {
  const deckId = req.params.deckId
  const cardId = req.params.cardId
  const face = req.params.face

  let pageNumber = Math.floor(cardId / 6) * 2
  if (face === 'recto') {
    pageNumber = (pageNumber % 4) ? pageNumber + 1 : pageNumber
  } else if (face === 'verso') {
    pageNumber = (pageNumber % 4) ? pageNumber : pageNumber + 1
  }
  let colNumber
  if (face === 'recto') {
    colNumber = (cardId % 6) % 3
  } else if (face === 'verso') {
    colNumber = 2 - (cardId % 6) % 3
  }
  const marginLeft = pdfMarginLeft + colNumber * pdfCardWidth
  const lineNumber = Math.floor(cardId / 3) % 2
  const marginTop = pdfMarginTop + lineNumber * pdfCardHeight

  getPage(__dirname + `/decks/${deckId}.pdf`, pageNumber)
    .then(pagePath => cropImage(pagePath, pdfCardWidth, pdfCardHeight, marginLeft, marginTop, __dirname + `/decks/${deckId}-card-${cardId}-${face}.png`))
    .then(cardPath => res.sendFile(cardPath))
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
})

const getPage = (pdfPath, pageNumber) => {
  return new PDFImage(pdfPath, {
      convertOptions: {
        '-interlace': 'none',
        '-density': '300',
        '-quality': '100'
      }
    })
    .convertPage(pageNumber)
}

const cropImage = (srcPath, width, height, marginLeft, marginTop, destPath) => {
  return new Promise((resolve, reject) => {
    gm(srcPath)
      .crop(width, height, marginLeft, marginTop)
      .write(destPath, err => {
        if (err) {
          reject(err)
          return
        }
        resolve(destPath)
      })
  })
}

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
