import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NoteType } from './NoteType'
import Key from './Key';

interface OctaveProps {
    octaveNumber: number;
    noteStartNumber: number;
    notes: NoteType[]
}

const Octave: React.FC<OctaveProps> = ( {notes, octaveNumber, noteStartNumber } ) => {
    let currentNumber = noteStartNumber;
    return (<div className='octave'>{ notes.map((note: NoteType) => {
        const element = <Key noteName={note.name + octaveNumber} noteNumber={currentNumber} isSharp={!note.isNatural} />;
        currentNumber++;
        return element;
    }) }
    </div>);
};

export default Octave;