const zoom = 2.89
const ratioDensity = 0.24 * zoom
const rowsPerPage = 2

getPageIndex = (columnsPerPage, pdfPagesToSkip, isFirstPageRecto) => (cardId, face) => {
  const pageIndex = Math.floor(cardId / columnsPerPage / rowsPerPage) * 2 + pdfPagesToSkip

  if (isFirstPageRecto) {
    return face === 'recto' ? pageIndex : pageIndex + 1
  } else {
    return face === 'recto' ? pageIndex + 1 : pageIndex
  }
}

getPageIndexWithInvertedRectoVersoEvery2Pages = (columnsPerPage, pdfPagesToSkip, isFirstPageRecto) => (cardId, face) => {
  const pageIndex = Math.floor(cardId / columnsPerPage / rowsPerPage) * 2 + pdfPagesToSkip

  if (face === 'recto' ^ !isFirstPageRecto) {
    return (pageIndex % 4) ? pageIndex + 1 : pageIndex
  } else {
    return (pageIndex % 4) ? pageIndex : pageIndex + 1
  }
}

getRowIndex = (columnsPerPage) => (cardId) => {
  return Math.floor(cardId / columnsPerPage) % rowsPerPage
}

getColumnIndex = (columnsPerPage, isVersoFromLeftToRight) => (cardId, face) => {
  const colIndex = cardId % columnsPerPage
  return face === 'recto' ^ isVersoFromLeftToRight ? colIndex : columnsPerPage - 1 - colIndex
}

module.exports.zoom = zoom

module.exports.decks = [
  {
    id: '59baa2_5dbfd556434846bf8754ca4116101f37',
    name: 'Tutoriel',
    difficulty: '☆☆☆',
    nbCards: 10,
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    getPageIndex: getPageIndex(3, 0, false),
    getRowIndex: getRowIndex(3),
    getColumnIndex: getColumnIndex(3, true)
  },
  {
    id: '59baa2_b414561726024995b66b03ecef774c8b',
    name: 'La 5e avenue',
    difficulty: '★☆☆',
    nbCards: 27,
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    getPageIndex: getPageIndex(3, 0, false),
    getRowIndex: getRowIndex(3),
    getColumnIndex: getColumnIndex(3, true)
  },
  {
    id: '59baa2_f33934a78d5b438e8cd3dafc2ae1b07f',
    name: 'Le foie de l’Axolotl',
    difficulty: '★☆☆',
    nbCards: 24,
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 160 * ratioDensity,
    pdfMarginTop: 426 * ratioDensity,
    getPageIndex: getPageIndex(3, 2, true),
    getRowIndex: getRowIndex(3),
    getColumnIndex: getColumnIndex(3, false)
  },
  {
    id: '59baa2_91481bc69eda4c75b6ef318135d8508b',
    name: 'Cambriolage fantôme',
    difficulty: '★☆☆',
    nbCards: 24,
    pdfCardWidth: 778 * ratioDensity,
    pdfCardHeight: 1321 * ratioDensity,
    pdfMarginLeft: 462 * ratioDensity,
    pdfMarginTop: 252 * ratioDensity,
    getPageIndex: getPageIndex(2, 0, false),
    getRowIndex: getRowIndex(2),
    getColumnIndex: getColumnIndex(2, true)
  },
  {
    id: '59baa2_fcba9236512e4b2b912e26150ca01264',
    name: 'L’élite',
    difficulty: '★★☆',
    nbCards: 21,
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    getPageIndex: getPageIndex(3, 0, false),
    getRowIndex: getRowIndex(3),
    getColumnIndex: getColumnIndex(3, true)
  },
  {
    id: '59baa2_ec1d34bb0fe246069dd7dc12ebf8697d',
    name: 'À la poursuite de Cabrakan',
    difficulty: '★★☆',
    nbCards: 24,
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 128 * ratioDensity,
    pdfMarginTop: 505 * ratioDensity,
    getPageIndex: getPageIndexWithInvertedRectoVersoEvery2Pages(3, 0, true),
    getRowIndex: getRowIndex(3),
    getColumnIndex: getColumnIndex(3, true)
  },
  {
    id: '59baa2_d7f24d940eea4cfa89b7400dfb581459',
    name: 'Le donjon de Doo-Arann',
    difficulty: '★★☆',
    nbCards: 24,
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 128 * ratioDensity,
    pdfMarginTop: 505 * ratioDensity,
    getPageIndex: getPageIndexWithInvertedRectoVersoEvery2Pages(3, 0, true),
    getRowIndex: getRowIndex(3),
    getColumnIndex: getColumnIndex(3, true)
  },
  {
    id: 'Noel_en_juillet-',
    name: 'Noël en juillet',
    difficulty: '★★☆',
    nbCards: 27,
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 160 * ratioDensity,
    pdfMarginTop: 430 * ratioDensity,
    getPageIndex: getPageIndex(3, 0, false),
    getRowIndex: getRowIndex(3),
    getColumnIndex: getColumnIndex(3, true)
  },
  {
    id: '59baa2_164fbfd3e76b4dbcb46282074693f098',
    name: 'Le temple de RA',
    difficulty: '★★★',
    nbCards: 24,
    pdfCardWidth: 721 * ratioDensity,
    pdfCardHeight: 1323 * ratioDensity,
    pdfMarginLeft: 146 * ratioDensity,
    pdfMarginTop: 276 * ratioDensity,
    getPageIndex: getPageIndex(3, 0, false),
    getRowIndex: getRowIndex(3),
    getColumnIndex: getColumnIndex(3, true)
  }
]
