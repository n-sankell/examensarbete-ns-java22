import React from 'react';
import Octave from './Octave';
import { notes } from './NoteType';
import './Piano.css';

const Piano: React.FC = () => {
  const octaveRange = range(-2, 8);
  let currentNote = 0;

  return (<div className='piano-wrapper'>
    <div className="piano">{ octaveRange.map((number: number) => {
      const octave = <Octave octaveNumber={number} noteStartNumber={currentNote} notes={ notes } ></Octave>;
      currentNote += notes.length;
      return octave;
  })}
  </div>
  </div>);
};

const range = (min: number, max: number) => Array(max - min + 1).fill(0).map((_, i) => min + i);

export default Piano;
