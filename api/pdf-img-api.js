import { pdf } from 'pdf-to-img'
import { Jimp } from 'jimp'
import fs from 'fs'
import { promisify } from 'util'

import { zoom } from './config.js'

const pagePromises = new Map()

export const getPage = (pdfPath, pageNumber) => {
  const pagePath = `${pdfPath.split('.pdf')[0]}-${pageNumber}.png`

  // Page already exists
  if (fs.existsSync(pagePath)) {
    return Promise.resolve(pagePath)
  }

  // Another caller is already generating this exact page.
  if (pagePromises.has(pagePath)) {
    return pagePromises.get(pagePath)
  }

  // Page will be generated
  const promise = new Promise((resolve, reject) => {
    pdf(pdfPath, { scale: zoom })
      .then(pdfDocument => pdfDocument.getPage(pageNumber + 1))
      .then(image => {
        const tmpPath = `${pagePath}.${process.pid}.${Date.now()}.tmp`
        return promisify(fs.writeFile)(tmpPath, image)
          .then(() => promisify(fs.rename)(tmpPath, pagePath))
      })
      .then(() => resolve(pagePath))
      .catch(reject)
      .finally(() => {
        pagePromises.delete(pagePath)
      })
  })
  pagePromises.set(pagePath, promise)
  return promise
}

export const cropImage = (srcPath, width, height, marginLeft, marginTop, destPath) => {
  return Jimp.read(srcPath)
    .then(image => image.crop({ x: marginLeft, y: marginTop, w: width, h: height })
      .write(destPath)
    )
    .then(() => destPath)
}
