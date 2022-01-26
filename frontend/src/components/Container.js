import { useState, useCallback } from "react";
import { Card } from "./Card";
import update from "immutability-helper";
const style = {
  width: "100%",
};
export const Container = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        text: "Filter",
      },
      {
        id: 2,
        text: "Phaser",
      },
      {
        id: 3,
        text: "Delay",
      },
      {
        id: 4,
        text: "Reverb",
      },
      {
        id: 5,
        text: "Compressor",
      },
    ]);
    const moveCard = useCallback(
      (dragIndex, hoverIndex) => {
        const dragCard = cards[dragIndex];
        setCards(
          update(cards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragCard],
            ],
          })
        );
      },
      [cards]
    );
    const renderCard = (card, index) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      );
    };
    return (
      <>
        <div style={style} >{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    );
  }
};
