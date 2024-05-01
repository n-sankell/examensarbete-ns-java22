import React, { useEffect } from 'react';
import { RootState } from '../../store';
import { connect } from 'react-redux';
import { NoteType } from './NoteType';
import Key from './Key';

interface LocalOctaveProps {
    octaveNumber: number;
    noteStartNumber: number;
    notes: NoteType[];
}
interface OctaveStateProps {
    pianoReady: boolean;
}
interface OctaveProps extends LocalOctaveProps, OctaveStateProps {}

const Octave: React.FC<OctaveProps> = ( {notes, octaveNumber, noteStartNumber, pianoReady } ) => {

    useEffect(() => {
    }, [pianoReady]);

    let current: number = noteStartNumber;
    return (<div className='octave'>{ notes.map((note: NoteType) => {
        const noteName: string = note.name + octaveNumber;
        const element = <Key key={ current } noteName={ noteName } noteNumber={ current } isSharp={ !note.isNatural } />;
        current++;
        return element;
    }) }
    </div>);
};

const mapStateToProps = (state: RootState): OctaveStateProps => ({
    pianoReady: state.piano.pianoReady,
  });

export default connect(mapStateToProps, null)(Octave);