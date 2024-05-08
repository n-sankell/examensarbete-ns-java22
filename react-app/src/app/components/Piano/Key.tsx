import React, { SetStateAction, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import { setKeyPressed, setKeyReleased, setPianoReady } from '../../actions/pianoActions';
import { bindActionCreators } from '@reduxjs/toolkit';
import { playNote, releaseNote } from '../../synths/InteractiveSynth';

interface LocalKeyProps {
    noteNumber: number;
    noteName: string;
    isSharp: boolean;
}
interface KeyStateProps {
    isPressed: boolean;
    pianoReady: boolean;
}
interface KeyDispatchProps {
    keyPress: (noteNumber: number) => void;
    keyRelease: (noteNumber: number) => void;
}
interface KeyProps extends LocalKeyProps, KeyStateProps, KeyDispatchProps {}

const Key: React.FC<KeyProps> = ({ noteNumber, isSharp, noteName, keyPress, keyRelease, isPressed, pianoReady }) => {
    const keyClassName = isSharp ? 'black-key' : 'white-key';
    const handleKeyPress = (event: any) => {
        event.preventDefault();
        keyPress(noteNumber);
        playNote(noteName);
    }
    const handleKeyRelease = (event: any) => {
        event.preventDefault();
        keyRelease(noteNumber);
        releaseNote(noteName);
    }
    const handleKeyOut = (event: any) => {
        event.preventDefault();
        keyRelease(noteNumber);
        releaseNote(noteName);
    }
    const handleKeyOver = (event: any) => {
        event.preventDefault();
        if (pianoReady === true) {
            keyPress(noteNumber);
            playNote(noteName);
        }
    }

    useEffect(() => {
    }, [isPressed, pianoReady]);

    return (
        <div className={`${isPressed ? `pressed-${keyClassName}` : keyClassName}`} 
            onMouseDown={(event) => handleKeyPress(event)} 
            onMouseOut={(event) => handleKeyOut(event)}
            onMouseUp={(event) => handleKeyRelease(event)}
            onMouseEnter={(event) => handleKeyOver(event)}>
                { isSharp ? "" : <span className='note-name'>{noteName}</span> }
        </div>);
};

const mapStateToProps = (state: RootState, props: LocalKeyProps): KeyStateProps => ({
    isPressed: state.piano[props.noteNumber] || false,
    pianoReady: state.piano.pianoReady,
});

const mapDispatchToProps = (dispatch: Dispatch): KeyDispatchProps => ({
    keyPress: bindActionCreators(setKeyPressed, dispatch),
    keyRelease: bindActionCreators(setKeyReleased, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Key);
