import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../store';
import { setKeyPressed, setKeyReleased } from '../../actions/pianoActions';
import { bindActionCreators } from '@reduxjs/toolkit';

interface KeyProps {
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

const Key: React.FC<KeyProps & KeyStateProps & KeyDispatchProps> = ({ noteNumber, isSharp, noteName, keyPress, keyRelease, isPressed }) => {
    const keyClassName = isSharp ? 'black-key' : 'white-key';

    useEffect(() => {
    }, [isPressed])

    return (
        <div className={`${isPressed ? `pressed-${keyClassName}` : keyClassName}`} 
            onMouseDown={() => keyPress(noteNumber)} 
            onMouseUp={() => keyRelease(noteNumber)}>
                { isSharp ? "" : <span className='note-name'>{noteName}</span> }
        </div>);
};

const mapStateToProps = (state: RootState, props: KeyProps): KeyStateProps => ({
    isPressed: state.piano[props.noteNumber] || false,
});

const mapDispatchToProps = (dispatch: Dispatch): KeyDispatchProps => ({
    keyPress: bindActionCreators(setKeyPressed, dispatch),
    keyRelease: bindActionCreators(setKeyReleased, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Key);
