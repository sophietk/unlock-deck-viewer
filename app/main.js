const cardsTpl = Handlebars.compile(document.querySelector('#tpl-cards').innerHTML)

fetch('/decks')
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
  document.querySelectorAll('.card.js-deck-card').forEach(cardEl => {
    const cardId = cardEl.dataset.id
    cardEl.addEventListener('click', event => flipOrZoom(deckId, cardId, event))
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

const flipOrZoom = (deckId, cardId, event) => {
  event.stopPropagation()
  const cardEl = event.currentTarget
  if (cardEl.dataset.face === 'recto') {
    flip(cardId)
  } else {
    zoom(deckId, cardId, 'verso')
  }
}

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
const zoomedImageEl = modalZoomEl.querySelector('img')

const zoom = (deckId, cardId, face) => {
  zoomedImageEl.src = `http://localhost:3000/decks/${deckId}/cards/${cardId}/${face}`
  const isRotated = !!localStorage.getItem(`${zoomedImageEl.src},rotate`)
  zoomedImageEl.classList.toggle('rotate', isRotated)
  modalZoomEl.querySelector('.modal-body').style.overflowY = isRotated ? 'initial' : 'auto'
  modalZoomEl.classList.add('active')
}

const closeZoom = event => {
  event.preventDefault()
  modalZoomEl.classList.remove('active')
}
modalZoomEl.addEventListener('click', closeZoom)
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeZoom(event)
  }
})

const rotateZoom = event => {
  event.stopPropagation()
  zoomedImageEl.classList.toggle('rotate')
  localStorage.setItem(`${zoomedImageEl.src},rotate`, zoomedImageEl.classList)
  const isRotated = zoomedImageEl.classList.contains('rotate')
  modalZoomEl.querySelector('.modal-body').style.overflowY = isRotated ? 'initial' : 'auto'
}
modalZoomEl.querySelector('[data-action="rotate"]').addEventListener('click', rotateZoom)
window.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    rotateZoom(event)
  }
})

const toggleFullscreen = event => {
  event.preventDefault()
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
document.querySelector('#btnFullscreen').addEventListener('click', toggleFullscreen)
