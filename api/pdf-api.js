const pdfJs = require('pdfjs-dist')
const gm = require('gm').subClass({ imageMagick: true })
const fs = require('fs')
const { promisify } = require('util')

const { zoom } = require('./config')

const NodeCanvasFactory = require('./node-canvas-factory')

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
      const viewport = page.getViewport({ scale: zoom })
      const canvasFactory = new NodeCanvasFactory()
      const canvasAndContext = canvasFactory.create(viewport.width, viewport.height)
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

module.exports = { getPage, cropImage }
