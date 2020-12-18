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
  res.header('Access-Control-Allow-Methods', 'DELETE')
  next()
})

app.get('/decks', (req, res) => {
  res.send(config.map(({ id, name, difficulty, nbCards }) => ({ id, name, difficulty, nbCards })))
})

app.get('/decks/:deckId/cards/:cardId/:face', (req, res) => {
  const deckId = req.params.deckId
  const cardId = req.params.cardId
  const face = req.params.face

  const cardPath = path.join(__dirname, `/decks/${deckId}-card-${cardId}-${face}.jpg`)
  if (fs.existsSync(cardPath)) {
    res.sendFile(cardPath)
    return
  }

  const { pdfCardWidth, pdfCardHeight, pdfMarginLeft, pdfMarginTop, getPageNumber } = config.find(deck => deck.id === deckId)
  const pageNumber = getPageNumber(cardId, face)
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

app.delete('/cards', (req, res) => {
  const cardsRootPath = path.join(__dirname, `/decks/`)
  let regex = /[.](png|jpg)$/

  try {
    fs.readdirSync(cardsRootPath)
        .filter(f => regex.test(f))
        .map(f => fs.unlinkSync(cardsRootPath + f))
    res.status(204).send()
  } catch(err) {
    console.error(err)
    res.status(500).send(err)
    return
  }
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
