import React from 'react';
import './CardPile.css';
import Card from './Card'

function CardPile({ cardsArray }) {
  return (
    <div>
      {cardsArray.map(card => (
        <Card key={card.id} value={card.value} />
      ))}
    </div>
  )
}

export default CardPile;