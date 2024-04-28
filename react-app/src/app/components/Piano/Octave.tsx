import React from 'react';
import { NoteType } from './NoteType'
import Key from './Key';

interface OctaveProps {
    octaveNumber: number;
    noteStartNumber: number;
    notes: NoteType[]
}

const Octave: React.FC<OctaveProps> = ( {notes, octaveNumber, noteStartNumber } ) => {
    let current: number = noteStartNumber;
    return (<div className='octave'>{ notes.map((note: NoteType) => {
        const noteName: string = note.name + octaveNumber;
        const element = <Key key={ current } noteName={ noteName } noteNumber={ current } isSharp={ !note.isNatural } />;
        current++;
        return element;
    }) }
    </div>);
};

export default Octave;