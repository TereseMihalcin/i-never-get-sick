import { useState, useEffect } from 'react';

type Card = { id: number; title: string; body: string };

export default function CardList() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cards');
    if (saved) setCards(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  function addCard() {
    setCards([...cards, { id: Date.now(), title: 'New card', body: '' }]);
  }

  function removeCard(id: number) {
    setCards(cards.filter(card => card.id !== id));
  }

  function editCard(id: number, changes: Partial<Card>) {
    setCards(cards.map(card => card.id === id ? { ...card, ...changes } : card));
  }

  return (
    <div>
      {cards.map(card => (
        <div key={card.id}>
          <input value={card.title} onChange={e => editCard(card.id, { title: e.target.value })} />
          <button onClick={() => removeCard(card.id)}>Remove</button>
        </div>
      ))}
      <button onClick={addCard}>Add Card</button>
    </div>
  );
}
