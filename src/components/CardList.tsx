import { useState, useEffect } from 'react';

type Time = { id: number; time: string; };
type Card = { id: number; title: string; body: string; times: Time[]; };

function nowForTimeInput() {
  const pad = (n: number) => String(n).padStart(2, '0');
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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
    setCards([...cards, { id: Date.now(), title: '', body: '', times: [{ id: Date.now(), time: nowForTimeInput() }] }]);
  }

  function removeCard(id: number) {
    setCards(cards.filter(card => card.id !== id));
  }

  function editCard(id: number, changes: Partial<Card>) {
    setCards(cards.map(card => card.id === id ? { ...card, ...changes } : card));
  }

  function addTime(cardId: number) {
    setCards(cards.map(card => card.id === cardId
      ? { ...card, times: [...card.times, { id: Date.now(), time: nowForTimeInput() }] }
      : card));
  }

  function removeTime(cardId: number, timeId: number) {
    setCards(cards.map(card => card.id === cardId
      ? { ...card, times: card.times.filter(time => time.id !== timeId) }
      : card));
  }

  function editTime(cardId: number, timeId: number, value: string) {
    setCards(cards.map(card => card.id === cardId
      ? { ...card, times: card.times.map(time => time.id === timeId ? { ...time, time: value } : time) }
      : card));
  }

  return (
    <div className="container">
      <div className="row">
      {cards.map(card => (
        <div className="card" key={card.id}>
          <button className="deleteCard" onClick={() => removeCard(card.id)}>X</button>
          <label>Medication</label>
          <input value={card.title} onChange={e => editCard(card.id, { title: e.target.value })} placeholder="Medication Name"/>
          <label>Time(s) to Take</label>
          {card.times.map(time => (
            <div className="time-row" key={time.id}>
              <input type="time" value={time.time} onChange={e => editTime(card.id, time.id, e.target.value)}/>
              <button className="delete" onClick={() => removeTime(card.id, time.id)}>X</button>
            </div>
          ))}
          <button onClick={() => addTime(card.id)}>Add Time</button>
        </div>
      ))}
      </div>
      <button onClick={addCard}>Add Medication</button>
    </div>
  );
}
