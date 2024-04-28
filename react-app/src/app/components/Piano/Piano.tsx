import React, { useEffect } from 'react';
import Octave from './Octave';
import { notes } from './NoteType';
import './Piano.css';
import { setPianoReady } from '../../actions/pianoActions';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface PianoStateProps {
  pianoReady: boolean;
}
interface PianoDispatchProps {
  setPianoReady: (pianoReady: boolean) => void;
}
interface PianoProps extends PianoStateProps, PianoDispatchProps {}

const Piano: React.FC<PianoProps> = ( { pianoReady, setPianoReady } ) => {

  useEffect(() => {    
  }, [pianoReady]);

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    setPianoReady(true);
  }

  const handleMouseUp = (event: any) => {
    event.preventDefault();
    setPianoReady(false);
  }

  const octaveRange = range(-2, 8);
  let currentNote = 0;

  return (<div className='piano-wrapper'>
    <div className="piano" onMouseDown={(event) => handleMouseDown(event)} onMouseUp={(event) => handleMouseUp(event)}>
      { octaveRange.map((ocNum: number) => {
        const octave = <Octave key={ ocNum } octaveNumber={ ocNum } noteStartNumber={ currentNote } notes={ notes } ></Octave>;
        currentNote += notes.length;
        return octave;
  })}
  </div>
  </div>);
};

const range = (min: number, max: number) => Array(max - min + 1).fill(0).map((_, i) => min + i);

const mapStateToProps = (state: RootState): PianoStateProps => ({
  pianoReady: state.piano.pianoReady,
});

const mapDispatchToProps = (dispatch: Dispatch): PianoDispatchProps => ({
  setPianoReady: bindActionCreators(setPianoReady, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Piano);
