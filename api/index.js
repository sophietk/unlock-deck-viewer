const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const express = require('express')

const { decks } = require('./config')
const { getPage, cropImage } = require('./pdf-api')

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'DELETE')
  next()
})

app.get('/decks', (req, res) => {
  res.send(decks.map(({ id, name, difficulty, nbCards }) => ({ id, name, difficulty, nbCards })))
})

app.get('/decks/:deckId/cards/:cardId/:face', (req, res) => {
  const { deckId, cardId, face } = req.params

  const cardPath = path.join(__dirname, `/decks/${deckId}-card-${cardId}-${face}.jpg`)
  if (fs.existsSync(cardPath)) {
    res.sendFile(cardPath)
    return
  }

  const { pdfCardWidth, pdfCardHeight, pdfMarginLeft, pdfMarginTop, getPageNumber } = decks.find(deck => deck.id === deckId)
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

app.delete('/cards', (req, res) => {
  const cardsRootPath = path.join(__dirname, `/decks/`)
  let generatedImageRegex = /[.](png|jpg)$/

  promisify(fs.readdir)(cardsRootPath)
    .then(files => files
      .filter(file => generatedImageRegex.test(file))
      .map(file => promisify(fs.unlink)(path.join(cardsRootPath, file)))
    )
    .then(deletePromises => Promise.all(deletePromises))
    .then(() => {
      res.status(204).send()
    })
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
