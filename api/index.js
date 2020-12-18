const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const express = require('express')
const pdfJs = require('pdfjs-dist')
const gm = require('gm').subClass({ imageMagick: true })
const NodeCanvasFactory = require('./node-canvas-factory')

const { decks, zoom } = require('./config')

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

const getPage = (pdfPath, pageNumber) => {
  const pagePath = `${pdfPath.split('.pdf')[0]}-${pageNumber}.png`
  if (fs.existsSync(pagePath)) {
    return Promise.resolve(pagePath)
  }

  const rawPdf = new Uint8Array(fs.readFileSync(pdfPath))
  return pdfJs.getDocument(rawPdf)
    .promise
    .then(pdfDocument => pdfDocument.getPage(pageNumber + 1))
    .then(page => {
      const viewport = page.getViewport({ scale: zoom });
      const canvasFactory = new NodeCanvasFactory()
      const canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height
      )
      const renderContext = {
        canvasContext: canvasAndContext.context,
        viewport: viewport,
        canvasFactory: canvasFactory
      }
      return page.render(renderContext)
        .promise
        .then(() => {
          const image = canvasAndContext.canvas.toBuffer()
          return promisify(fs.writeFile)(pagePath, image)
            .catch(error => {
              console.error(err)
            })
        })
    })
    .then(() => pagePath)
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
      .map(f => fs.unlinkSync(path.join(cardsRootPath, f)))
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
