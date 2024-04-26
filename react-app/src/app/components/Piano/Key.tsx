import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

interface KeyProps {
  noteNumber: number;
  noteName: string;
  isSharp: boolean;
}

const Key: React.FC<KeyProps> = ({ noteNumber, isSharp, noteName }) => {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const keyClassName = isSharp ? 'black-key' : 'white-key';

    const onPress = (note: number, pressed: boolean): void => {
        setIsPressed(pressed);
    }

    useEffect(() => {
    }, [isPressed])

    return (
    <div className={`${isPressed ? `pressed-${keyClassName}` : keyClassName}`} 
        onMouseDown={() => onPress(noteNumber, true)} 
        onMouseUp={() => onPress(noteNumber, false)}>
            { isSharp ? "" : <span className='note-name'>{noteName}</span> }
    </div>
  );
};

export default Key;
