const cardsTpl = Handlebars.compile(document.querySelector('#tpl-cards').innerHTML)

fetch('http://localhost:3000/decks')
  .then(response => response.json())
  .then(decks => {
    decks.forEach(deckId => {
      const option = document.createElement('option')
      option.text = deckId
      document.querySelector('select').add(option, null)
    })
  })

document.querySelector('#btnLoad').addEventListener('click', () => {
  const deckId = document.querySelector('#deckId').value
  const nbCards = document.querySelector('#nbCards').value
  const cardIds = Array.from({length: nbCards}, (v, k) => k)

  document.querySelector('.cards').innerHTML = cardsTpl({cards: cardIds.map(cardId => ({cardId, deckId}))})
})

const flipCard = (cardId) => {
  const cardEl = document.querySelector(`#card-${cardId}`)
  const isRecto = cardEl.dataset.face === 'recto'
  cardEl.dataset.face = isRecto ? 'verso' : 'recto'
}
