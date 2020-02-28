import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Board.css';
import CardPile from './CardPile';
import { v4 as uuid} from 'uuid';
import axios from 'axios';

function Board() {
  const [deckId, setDeckId] = useState(null);
  const [cardsArray, setCardsArray] = useState([]);
  const [currentlyDrawing, setCurrentlyDrawing] = useState(false);
  const timerId = useRef();

  useEffect(() => {
    async function fetchDeck() {
      const deckResult = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/"
      )
      setDeckId(deckResult.data.deck_id);
    }
    fetchDeck();
  }, []);

  const drawCard = useCallback(() => {
    async function fetchCard() {
      const cardResult = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      if(cardResult.data.cards[0]) {
        const newCard = {
          value: `${cardResult.data.cards[0].value} of ${cardResult.data.cards[0].suit}`,
          id: uuid()
        };
        setCardsArray(oldCardsArray => [...oldCardsArray, newCard]); 
      } else {
        alert("There are no cards left to draw");
        setCurrentlyDrawing(previous => !previous);
      }
    }
    fetchCard();
  },[setCardsArray, setCurrentlyDrawing, deckId]);

  const toggleDraw = () => {
    setCurrentlyDrawing(previous => !previous);
  }

  useEffect(() => {
    if(currentlyDrawing) {
      timerId.current = setInterval(() => {
        drawCard();
      }, 100);
      return () => {
        clearInterval(timerId.current);
      };
    }
  }, [drawCard, currentlyDrawing])

  let htmlAfterDraw = (
    <div>
      <button onClick={ toggleDraw } >{currentlyDrawing ? "Stop Drawing" : "Start Drawing"}</button>
      <CardPile cardsArray={cardsArray} />
    </div>
  )

  return (
    <div>
      {deckId ? htmlAfterDraw : <h1>Creating Deck...</h1>}
    </div>
  );
}

export default Board;