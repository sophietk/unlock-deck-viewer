const fs = require('fs')
const path = require('path')
const express = require('express')

const { decks } = require('./config')
const { getPage, cropImage } = require('./pdf-img-api')

const API_PORT = process.env.API_PORT || 3000
const LINES_PER_PAGE = 2
const app = express()

app.get('/decks', (req, res) => {
  res.send(decks.map(({ id, name, difficulty, nbCards }) => ({ id, name, difficulty, nbCards })))
})

app.get('/decks/:deckId/cards/:cardId/:face', (req, res) => {
  const { deckId, cardId, face } = req.params

  const cardPath = path.join(__dirname, `/decks/${deckId}-card-${cardId}-${face}.jpg`)
  if (fs.existsSync(cardPath)) {
    setTimeout(() => res.sendFile(cardPath), 10)
    return
  }

  const { pdfCardWidth, pdfCardHeight, pdfMarginLeft, pdfMarginTop, getPageNumber, getColNumber, colPerPage } = decks.find(deck => deck.id === deckId)
  const pageNumber = getPageNumber(cardId, face)
  const colNumber = getColNumber(cardId, face)
  const marginLeft = pdfMarginLeft + colNumber * pdfCardWidth
  const lineNumber = Math.floor(cardId / colPerPage) % LINES_PER_PAGE
  const marginTop = pdfMarginTop + lineNumber * pdfCardHeight

  getPage(path.join(__dirname, `/decks/${deckId}.pdf`), pageNumber)
    .then(pagePath => cropImage(pagePath, pdfCardWidth, pdfCardHeight, marginLeft, marginTop, cardPath))
    .then(cardPath => res.sendFile(cardPath))
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
})

app.listen(API_PORT, () => {
  console.log(`Server listening on port ${API_PORT}`)
})
