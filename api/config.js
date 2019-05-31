const referenceDensity = 300
const currentDensity = 200
const ratioDensity = currentDensity / referenceDensity

module.exports = [
  {
    id: '59baa2_b414561726024995b66b03ecef774c8b',
    name: 'La 5e avenue',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    nbCards: 27,
    pageNumberFn: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2 + 1
      return face === 'recto' ? pageNumber : pageNumber - 1
    }
  },
  {
    id: '59baa2_d7f24d940eea4cfa89b7400dfb581459',
    name: 'Le donjon de Doo-Arann',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 128 * ratioDensity,
    pdfMarginTop: 505 * ratioDensity,
    nbCards: 24,
    pageNumberFn: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2
      if (face === 'recto') {
        pageNumber = (pageNumber % 4) ? pageNumber + 1 : pageNumber
      } else if (face === 'verso') {
        pageNumber = (pageNumber % 4) ? pageNumber : pageNumber + 1
      }
      return pageNumber
    }
  },
  {
    id: '59baa2_fcba9236512e4b2b912e26150ca01264',
    name: 'L’élite',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    nbCards: 21,
    pageNumberFn: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2 + 1
      return face === 'recto' ? pageNumber : pageNumber - 1
    }
  },
  {
    id: '59baa2_ec1d34bb0fe246069dd7dc12ebf8697d',
    name: 'À la poursuite de Cabrakan',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 128 * ratioDensity,
    pdfMarginTop: 505 * ratioDensity,
    nbCards: 24,
    pageNumberFn: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2
      if (face === 'recto') {
        pageNumber = (pageNumber % 4) ? pageNumber + 1 : pageNumber
      } else if (face === 'verso') {
        pageNumber = (pageNumber % 4) ? pageNumber : pageNumber + 1
      }
      return pageNumber
    }
  },
  {
    id: '59baa2_164fbfd3e76b4dbcb46282074693f098',
    name: 'Le temple de RA',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    nbCards: 24,
    pageNumberFn: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2 + 1
      return face === 'recto' ? pageNumber : pageNumber - 1
    }
  }
]
