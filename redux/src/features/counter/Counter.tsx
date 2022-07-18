import React, { useState } from 'react';

// w komponentach używamy właśnie tych hookóch dla których potwierdziliśmy typ
import { useAppSelector, useAppDispatch } from '../../app/hooks';

// importujemy tak naprawde action makery które dzięki dispatchu wywołają odpowiednią funkcje reducera
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './counterSlice';
import styles from './Counter.module.css';

export function Counter() {

  // zapisujemy konkretny state, wydaje mi się że dzięki temu że użyliśmy useAppSelectorea to w 
  // CounterSlice możemy : export const selectCount = (state: RootState) => state.counter.value
  // a bez niego moglibyśmy tylko zrobić (state: RootState) => state.counter ale nie wiem XD
  const count = useAppSelector(selectCount);

  
  // do zmiennej dispatch zapisujemy dispatcha ze stora z tym że ten dispatch wie jakie dokładnie
  // akcje może porzeprowadzić
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  // zapisujemy wartość ze stata jako typ number a nie string
  // wcześniej jest stringiem bo jego wartość ustawia input który zawsze da stringa
  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          // dispatchujemy akcje
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          // ustawiamy state
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          className={styles.button}
          // dispatcujemy akcje która przyjmuje payload 
          // czyli typ payloadAction<number> w tym przypadku i przekazujemy mu zamienionego na
          // number stata
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          // dispatchujemy akcje asynchroniczną => dispatch nie może zawierać w sobie akcji
          // asynchronicznej dlatego tak naprawde używamy tutaj thunka który zamiast obiektu
          // akcji przyjmuje funkcje a ta funkcja wykonuje dispatcha
          onClick={() => dispatch(incrementAsync(incrementValue))}
        >
          Add Async
        </button>
        <button
          className={styles.button}
          // kolejna asynchroniczna akcja z dodatkowym warunkiem że dojdzie do aktualizacji stata
          // tylko jeżeli obecna wartość stata jest nieparzysta
          onClick={() => dispatch(incrementIfOdd(incrementValue))}
        >
          Add If Odd
        </button>
      </div>
    </div>
  );
}
