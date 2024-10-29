import pdfJs from 'pdfjs-dist/build/pdf.js'
import { Jimp } from 'jimp'
import fs from 'fs'
import { promisify } from 'util'

import { zoom } from './config.js'
import { NodeCanvasFactory } from './node-canvas-factory.js'

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export const getPage = (pdfPath, pageNumber) => {
  const pagePath = `${pdfPath.split('.pdf')[0]}-${pageNumber}.png`
  if (fs.existsSync(pagePath)) {
    return Promise.resolve()
      .then(() => wait(10))
      .then(() => pagePath)
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
        viewport,
        canvasFactory
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

export const cropImage = (srcPath, width, height, marginLeft, marginTop, destPath) => {
  return Jimp.read(srcPath)
    .then(image => image.crop({ x: marginLeft, y: marginTop, w: width, h: height })
      .write(destPath)
    )
    .then(() => destPath)
}
