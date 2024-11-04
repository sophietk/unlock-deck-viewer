import { pdf } from 'pdf-to-img'
import { Jimp } from 'jimp'
import fs from 'fs'
import { promisify } from 'util'

import { zoom } from './config.js'

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export const getPage = (pdfPath, pageNumber) => {
  const pagePath = `${pdfPath.split('.pdf')[0]}-${pageNumber}.png`
  if (fs.existsSync(pagePath)) {
    return Promise.resolve()
      .then(() => wait(10))
      .then(() => pagePath)
  }

  return pdf(pdfPath, { scale: zoom })
    .then(pdfDocument => pdfDocument.getPage(pageNumber + 1))
    .then(image => promisify(fs.writeFile)(pagePath, image))
    .then(() => pagePath)
}

export const cropImage = (srcPath, width, height, marginLeft, marginTop, destPath) => {
  return Jimp.read(srcPath)
    .then(image => image.crop({ x: marginLeft, y: marginTop, w: width, h: height })
      .write(destPath)
    )
    .then(() => destPath)
}
