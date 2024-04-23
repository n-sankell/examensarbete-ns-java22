import { Dispatch, SetStateAction, useEffect } from 'react';
import { DeleteMidiRequest, Midi, MidiApi, Midis } from '../../generated/midi-api';
import "./PublicMidis.css";

type Props = {
    midis: Midis;
    userMidis: Midis;
    showDeleteBox: boolean;
    setUpdate: Dispatch<SetStateAction<boolean>>;
    midiApi: MidiApi;
    token: string;
}

const PublicMidis = (props: Props) => {
    const midis = props.midis.midis === undefined ? [] : props.midis.midis;
    const userMidis = props.userMidis.midis === undefined ? [] : props.userMidis.midis;
    const handleDeleteBoxClick = async (event: React.MouseEvent<HTMLDivElement>, midi: Midi): Promise<void> => {
        
        const midiId = midi.midiId === null ? "" : midi.midiId as string;
        try {
            const requestObject: DeleteMidiRequest = { id: midiId };
            await props.midiApi.deleteMidiRaw(requestObject);
            props.setUpdate(true);
        } catch (error) {
            console.error('Error deleting midi: ' + error);
        }
    }

    useEffect((): void => {
    }, []);

    const isUserMidi = (midi: Midi) => {
        let match: boolean = false;
        userMidis.forEach((m: Midi) => {
            if (m.midiId === midi.midiId) {
                match = true;
            }
        });
        return match;
    }

    return (
    <div className="content">
        <h1 className='heading'>Public midis</h1>
        <div className='list-wrapper'>
            <ul className='ul-list'> { midis.map((midi: Midi, index: number) => (
                <li key={index} className='list-item'>
                    { props.showDeleteBox === true && isUserMidi(midi) ? 
                        <div className='delete-box' onClick={ (e) => handleDeleteBoxClick(e, midi) }>
                            <span className='delete-symbol'>X</span>
                        </div> : "" }
                    <div className="midis-wrapper">
                        <div className='midi'>
                            <span className='midi-text-field'>{midi.filename}</span>
                            { midi.title == null ? "" : <span className='midi-text-field'>{midi.title}</span> }
                            { midi.artist == null ? "" : <span className='midi-text-field'>{midi.artist}</span> }
                        </div>
                    </div>
                </li>) ) }
            </ul>
        </div>
    </div>);
}

export default PublicMidis;