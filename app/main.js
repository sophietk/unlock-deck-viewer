const cardsTpl = Handlebars.compile(document.querySelector('#tpl-cards').innerHTML)

fetch('http://localhost:3000/decks')
  .then(response => response.json())
  .then(decks => {
    decks.forEach(({ id, name }) => {
      const option = document.createElement('option')
      option.value = id
      option.text = name
      document.querySelector('select').add(option, null)
    })
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
})

const flip = (cardId) => {
  const cardEl = document.querySelector(`#card-${cardId}`)
  const isRecto = cardEl.dataset.face === 'recto'
  cardEl.dataset.face = isRecto ? 'verso' : 'recto'
}

const zoom = (deckId, cardId) => {
  const modal = document.querySelector('#modal-zoom')
  modal.querySelector('img').src = `http://localhost:3000/decks/${deckId}/cards/${cardId}/verso`
  modal.classList.add('active')
}

const closeZoom = () => {
  document.querySelector('#modal-zoom').classList.remove('active')
}
document.querySelector('#modal-zoom').addEventListener('click', closeZoom)

const discard = (cardId) => {
  const cardEl = document.querySelector(`#card-${cardId}`)
  cardEl.classList.add('discarded')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
