import fs from 'fs'
import path from 'path'
import express from 'express'
import getPort from 'get-port'

import { decks } from './config.js'
import { getPage, cropImage } from './pdf-img-api.js'

export const apiPort = await getPort({ port: 3000 })
const app = express()

app.get('/decks', (req, res) => {
  res.send(decks.map(({ id, name, difficulty, nbCards }) => ({ id, name, difficulty, nbCards })))
})

app.get('/decks/:deckId/cards/:cardId/:face', (req, res) => {
  const { deckId, cardId, face } = req.params

  const cardPath = path.join(import.meta.dirname, `/decks/${deckId}-card-${cardId}-${face}.jpg`)
  if (fs.existsSync(cardPath)) {
    setTimeout(() => res.sendFile(cardPath), 10)
    return
  }

  const { pdfCardWidth, pdfCardHeight, pdfMarginLeft, pdfMarginTop, getPageIndex, getRowIndex, getColumnIndex } = decks.find(deck => deck.id === deckId)
  const pageIndex = getPageIndex(cardId, face)
  const rowIndex = getRowIndex(cardId)
  const columnIndex = getColumnIndex(cardId, face)
  const marginTop = pdfMarginTop + rowIndex * pdfCardHeight
  const marginLeft = pdfMarginLeft + columnIndex * pdfCardWidth

  getPage(path.join(import.meta.dirname, `/decks/${deckId}.pdf`), pageIndex)
    .then(pagePath => cropImage(pagePath, pdfCardWidth, pdfCardHeight, marginLeft, marginTop, cardPath))
    .then(cardPath => res.sendFile(cardPath))
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
})

app.listen(apiPort, () => {
  console.log(`API server listening on port ${apiPort}`)
})
