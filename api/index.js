const express = require('express')
const PDFImage = require('pdf-image').PDFImage
const app = express()

app.get('/', (req, res) => {
  res.send('Back')
})

app.get('/deck/:deckId/pages/:pageId.png', (req, res) => {
  const deckId = req.params.deckId
  const pageId = req.params.pageId

  new PDFImage(__dirname + `/decks/${deckId}.pdf`)
    .convertPage(pageId)
    .then(imagePath => res.sendFile(imagePath))
    .catch(err => {
      console.error(err)
      res.status(500).send(err)
    })
})

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
