const express = require('express')
const PDFImage = require('pdf-image').PDFImage
const gm = require('gm').subClass({ imageMagick: true })
const fs = require('fs')
const path = require('path')

const config = require('./config')

const app = express()
const currentDensity = 200

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/decks', (req, res) => {
  res.send(config.map(({id, name, nbCards}) => ({id, name, nbCards})))
})

app.get('/decks/:deckId/cards/:cardId/:face', (req, res) => {
  const deckId = req.params.deckId
  const cardId = req.params.cardId
  const face = req.params.face

  const cardPath = path.join(__dirname, `/decks/${deckId}-card-${cardId}-${face}.png`)
  try {
    if (fs.existsSync(cardPath)) {
      res.sendFile(cardPath)
      return
    }
  } catch (err) {
    console.error(err)
  }

  const {pdfCardWidth, pdfCardHeight, pdfMarginLeft, pdfMarginTop, pageNumberFn} = config.find(deck => deck.id === deckId)
  const pageNumber = pageNumberFn(cardId, face)
  let colNumber
  if (face === 'recto') {
    colNumber = (cardId % 6) % 3
  } else if (face === 'verso') {
    colNumber = 2 - (cardId % 6) % 3
  }
  const marginLeft = pdfMarginLeft + colNumber * pdfCardWidth
  const lineNumber = Math.floor(cardId / 3) % 2
  const marginTop = pdfMarginTop + lineNumber * pdfCardHeight

  getPage(path.join(__dirname, `/decks/${deckId}.pdf`), pageNumber)
    .then(pagePath => cropImage(pagePath, pdfCardWidth, pdfCardHeight, marginLeft, marginTop, cardPath))
    .then(cardPath => res.sendFile(cardPath))
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
})

const getPage = (pdfPath, pageNumber) => {
  return new PDFImage(pdfPath, {
    convertOptions: {
      // '-interlace': 'none',
      '-density': currentDensity,
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
