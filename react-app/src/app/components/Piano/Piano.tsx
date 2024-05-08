import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { setPianoReady } from '../../actions/pianoActions';
import { OctaveStartNote, octaves } from '../../helpers/OctaveHelper';
import React, { useEffect } from 'react';
import { RootState } from '../../store';
import { connect } from 'react-redux';
import { notes } from '../../types/NoteType';
import Octave from './Octave';
import './Piano.css';

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

  return (<div className='piano-wrapper'>
    <div className="piano" onMouseDown={(event) => handleMouseDown(event)} onMouseUp={(event) => handleMouseUp(event)}>
      { octaves.map((o: OctaveStartNote) => 
        <Octave key={ o.octave } octaveNumber={ o.octave } noteStartNumber={ o.startNote } notes={ notes } ></Octave>
  )}
  </div>
  </div>);
};

const mapStateToProps = (state: RootState): PianoStateProps => ({
  pianoReady: state.piano.pianoReady,
});

const mapDispatchToProps = (dispatch: Dispatch): PianoDispatchProps => ({
  setPianoReady: bindActionCreators(setPianoReady, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Piano);
