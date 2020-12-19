const cardsTpl = Handlebars.compile(document.querySelector('#tpl-cards').innerHTML)

fetch(`/decks`)
  .then(response => response.json())
  .then(decks => {
    decks.forEach(({ id, name, difficulty }) => {
      const option = document.createElement('option')
      option.value = id
      option.text = `${name} ${difficulty}`
      document.querySelector('select').add(option, null)
    })
    document.querySelector('#nbCards').value = decks[0].nbCards
    document.querySelector('select').addEventListener('change', event => {
      const selectedDeckId = event.target.value
      document.querySelector('#nbCards').value = decks.find(deck => deck.id === selectedDeckId).nbCards
    })
  })

document.querySelector('#btnLoad').addEventListener('click', () => {
  const deckId = document.querySelector('#deckId').value
  const nbCards = document.querySelector('#nbCards').value
  const cardIds = Array.from({ length: nbCards }, (v, k) => k)

  document.querySelector('.cards').innerHTML = cardsTpl({ cards: cardIds.map(cardId => ({ cardId, deckId })) })
  document.querySelectorAll('.card').forEach(cardEl => {
    const cardId = cardEl.dataset.id
    cardEl.addEventListener('click', event => {
      event.stopPropagation()
      if (cardEl.dataset.face === 'recto') {
        flip(cardId)
      } else {
        zoom(deckId, cardId, 'verso')
      }
    })
    cardEl.querySelector('[data-action="flip"]').addEventListener('click', event => {
      event.stopPropagation()
      flip(cardId)
    })
    cardEl.querySelector('[data-action="zoom"]').addEventListener('click', event => {
      event.stopPropagation()
      const face = cardEl.dataset.face
      zoom(deckId, cardId, face)
    })
    cardEl.querySelector('[data-action="discard"]').addEventListener('click', event => {
      event.stopPropagation()
      discard(cardId)
    })
  })
})

const flip = (cardId) => {
  const cardEl = document.querySelector(`#card-${cardId}`)
  const isRecto = cardEl.dataset.face === 'recto'
  cardEl.dataset.face = isRecto ? 'verso' : 'recto'
  cardEl.querySelector('[data-action="flip"]').classList.toggle('btn-primary')
  cardEl.querySelector('[data-action="zoom"]').classList.toggle('btn-primary')
}

const discard = (cardId) => {
  const cardEl = document.querySelector(`#card-${cardId}`)
  cardEl.classList.toggle('discarded')
}

const modalZoomEl = document.querySelector('#modal-zoom')

const zoom = (deckId, cardId, face) => {
  modalZoomEl.querySelector('img').src = `http://localhost:3000/decks/${deckId}/cards/${cardId}/${face}`
  modalZoomEl.querySelector('img').classList.remove('rotate')
  modalZoomEl.querySelector('.modal-body').style.overflowY = 'auto'
  modalZoomEl.classList.add('active')
}

const closeZoom = () => {
  modalZoomEl.classList.remove('active')
}
modalZoomEl.addEventListener('click', closeZoom)

const rotateZoom = e => {
  e.stopPropagation()
  modalZoomEl.querySelector('img').classList.toggle('rotate')
  modalZoomEl.querySelector('.modal-body').style.overflowY = 'initial'
}
modalZoomEl.querySelector('.link-rotate').addEventListener('click', rotateZoom)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
document.querySelector('#btnFullscreen').addEventListener('click', toggleFullscreen)

const btnResetCardsEl = document.querySelector('#btnResetCards')
const resetCards = () => {
  btnResetCardsEl.classList.add('btn--hidden')
  fetch(`/cards`, { method: 'DELETE' })
    .then(() => {
      btnResetCardsEl.classList.remove('btn--hidden')
    })
}
btnResetCardsEl.addEventListener('click', resetCards)
