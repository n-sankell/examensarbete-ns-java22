import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DeleteMidiRequest, GetMidiRequest, Midi, MidiApi, MidiWithData, Midis } from '../../generated/midi-api';
import "./PublicMidis.css";

type Props = {
    midis: Midis;
    showDeleteBox: boolean;
    setUpdate: Dispatch<SetStateAction<boolean>>;
    setActiveMidi: Dispatch<SetStateAction<MidiWithData>>;
    midiApi: MidiApi;
    token: string;
}

const PublicMidis = (props: Props) => {
    const [selectedMidiId, setSelectedMidiId] = useState<string>();
    const midis = props.midis.midis === undefined ? [] : props.midis.midis;

    const handleDeleteBoxClick = async (event: React.MouseEvent<HTMLDivElement>, midi: Midi): Promise<void> => {
        const midiId = midi.midiId === null ? "" : midi.midiId as string;
        try {
            const requestObject: DeleteMidiRequest = { id: midiId };
            await props.midiApi.deleteMidi(requestObject);
            props.setUpdate(true);
        } catch (error) {
            console.error('Error deleting midi: ' + error);
        }
    }
    const handleMidiClick = async (event: React.MouseEvent<HTMLDivElement>, midi: Midi): Promise<void> => {
        if (selectedMidiId === midi.midiId as string) {
            setSelectedMidiId("");
        } else {
            setSelectedMidiId(midi.midiId as string);
            const midiId = midi.midiId === null ? "" : midi.midiId as string;
            const fetchRequest: GetMidiRequest = { id: midiId };
            await props.midiApi.getMidi(fetchRequest)
                .then(data => props.setActiveMidi(data))
                .catch(error => console.log(error));
        }
    }

    useEffect((): void => {
    }, []);

    return (
    <div className="content">
        <h1 className='heading'>Public midis</h1>
        <div className='list-wrapper'>
            <ul className='ul-list'> { midis.map((midi: Midi, index: number) => (
                <li key={ index } className='list-item'>
                    { midi.midiId === selectedMidiId ? <>
                        <div className='load-box'>
                            <span className='load-symbol'>L</span>
                        </div>
                        { midi.userMidi === true ? <>
                        <div className='delete-box' onClick={ (e) => handleDeleteBoxClick(e, midi) } >
                            <span className='delete-symbol'>X</span>
                        </div> 
                        <div className='edit-box' onClick={ (e) => handleDeleteBoxClick(e, midi) } >
                            <span className='edit-symbol'>E</span>
                        </div> </> : "" } </> : "" }
                    <div className= { midi.userMidi === true ? 'user-midis-wrapper' : 'midis-wrapper' }>
                        <div className='midi' onClick={ (e) => handleMidiClick(e, midi) }>
                            <span className='midi-text-field'>{ midi.filename }</span>
                            { midi.title === null ? "" : <span className='midi-text-field'>{ midi.title }</span> }
                            { midi.artist === null ? "" : <span className='midi-text-field'>{ midi.artist }</span> }
                            { midi.userMidi === false ? "" : <span className='user-symbol'>U</span> }
                        </div>
                    </div>
                </li>) ) }
            </ul>
        </div>
    </div>);
}

export default PublicMidis;