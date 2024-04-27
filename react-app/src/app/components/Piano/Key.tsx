import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import { setKeyPressed, setKeyReleased } from '../../actions/pianoActions';
import { bindActionCreators } from '@reduxjs/toolkit';
import { playNote, releaseNote } from './PianoSynth';

interface LocalKeyProps {
    noteNumber: number;
    noteName: string;
    isSharp: boolean;
}
interface KeyStateProps {
    isPressed: boolean;
}
interface KeyDispatchProps {
    keyPress: (noteNumber: number) => void;
    keyRelease: (noteNumber: number) => void;
}
interface KeyProps extends LocalKeyProps, KeyStateProps, KeyDispatchProps {}

const Key: React.FC<KeyProps> = ({ noteNumber, isSharp, noteName, keyPress, keyRelease, isPressed }) => {
    const [play, setPlay] = useState<boolean>(false);
    const keyClassName = isSharp ? 'black-key' : 'white-key';
    const handleKeyPress = (event: any) => {
        setPlay(true);
        event.preventDefault();
        keyPress(noteNumber);
        playNote(noteNumber);
    }
    const handleKeyRelease = (event: any) => {
        event.preventDefault();
        keyRelease(noteNumber);
        releaseNote(noteNumber);
        setPlay(false);
    }
    const handleKeyOut = (event: any) => {
        event.preventDefault();
        keyRelease(noteNumber);
        releaseNote(noteNumber);
    }

    const handleKeyOver = (event: any) => {
        event.preventDefault();
        if (play) {
            keyPress(noteNumber);
            playNote(noteNumber);
        }
    }

    useEffect(() => {
    }, [isPressed])

    return (
        <div className={`${isPressed ? `pressed-${keyClassName}` : keyClassName}`} 
            onMouseDown={(event) => handleKeyPress(event)} 
            onMouseLeave={(event) => handleKeyOut(event)}
            onMouseUp={(event) => handleKeyRelease(event)}
            onMouseEnter={(event) => handleKeyOver(event)}>
                { isSharp ? "" : <span className='note-name'>{noteName}</span> }
        </div>);
};

const mapStateToProps = (state: RootState, props: LocalKeyProps): KeyStateProps => ({
    isPressed: state.piano[props.noteNumber] || false,
});

const mapDispatchToProps = (dispatch: Dispatch): KeyDispatchProps => ({
    keyPress: bindActionCreators(setKeyPressed, dispatch),
    keyRelease: bindActionCreators(setKeyReleased, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Key);
