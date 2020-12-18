// Cf. pdfjs-dist/lib/test/unit/test_utils.js

const Canvas = require('canvas')

function NodeCanvasFactory () {}
NodeCanvasFactory.prototype = {
  create (width, height) {
    const canvas = Canvas.createCanvas(width, height)
    const context = canvas.getContext('2d')
    return {
      canvas: canvas,
      context: context
    }
  },

  reset (canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width
    canvasAndContext.canvas.height = height
  },

  destroy (canvasAndContext) {
    canvasAndContext.canvas.width = 0
    canvasAndContext.canvas.height = 0
    canvasAndContext.canvas = null
    canvasAndContext.context = null
  }
}

module.exports = NodeCanvasFactory
