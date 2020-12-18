const zoom = 2
const ratioDensity = 0.24 * zoom

module.exports = [
  {
    id: '59baa2_5dbfd556434846bf8754ca4116101f37',
    name: 'Tutoriel',
    difficulty: '☆☆☆',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    nbCards: 12,
    getPageNumber: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2 + 1
      return face === 'recto' ? pageNumber : pageNumber - 1
    }
  },
  {
    id: '59baa2_b414561726024995b66b03ecef774c8b',
    name: 'La 5e avenue',
    difficulty: '★☆☆',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    nbCards: 27,
    getPageNumber: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2 + 1
      return face === 'recto' ? pageNumber : pageNumber - 1
    }
  },
  {
    id: '59baa2_f33934a78d5b438e8cd3dafc2ae1b07f',
    name: 'Le foie de l’Axolotl',
    difficulty: '★☆☆',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 160 * ratioDensity,
    pdfMarginTop: 426 * ratioDensity,
    nbCards: 24,
    getPageNumber: (cardId, face) => {
      const pdfPagesToSkip = 2
      let pageNumber = Math.floor(cardId / 6) * 2 + pdfPagesToSkip
      return face === 'recto' ? pageNumber : pageNumber + 1
    }
  },
  {
    id: '59baa2_fcba9236512e4b2b912e26150ca01264',
    name: 'L’élite',
    difficulty: '★★☆',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    nbCards: 21,
    getPageNumber: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2 + 1
      return face === 'recto' ? pageNumber : pageNumber - 1
    }
  },
  {
    id: '59baa2_ec1d34bb0fe246069dd7dc12ebf8697d',
    name: 'À la poursuite de Cabrakan',
    difficulty: '★★☆',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 128 * ratioDensity,
    pdfMarginTop: 505 * ratioDensity,
    nbCards: 24,
    getPageNumber: (cardId, face) => {
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
    id: '59baa2_d7f24d940eea4cfa89b7400dfb581459',
    name: 'Le donjon de Doo-Arann',
    difficulty: '★★☆',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 128 * ratioDensity,
    pdfMarginTop: 505 * ratioDensity,
    nbCards: 24,
    getPageNumber: (cardId, face) => {
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
    difficulty: '★★★',
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    nbCards: 24,
    getPageNumber: (cardId, face) => {
      let pageNumber = Math.floor(cardId / 6) * 2 + 1
      return face === 'recto' ? pageNumber : pageNumber - 1
    }
  }
]
