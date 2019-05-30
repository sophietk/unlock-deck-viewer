const express = require('express')
const PDFImage = require('pdf-image').PDFImage
const gm = require('gm').subClass({imageMagick: true})
const app = express()

const pdfCardWidth = 720
const pdfCardHeight = 1323
const pdfMarginLeft = 130
const pdfMarginTop = 505

app.get('/', (req, res) => {
  res.send('Back')
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
  const colNumber = (cardId % 6) % 3
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
