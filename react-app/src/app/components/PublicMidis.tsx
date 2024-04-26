import { DeleteMidiRequest, GetMidiRequest, Midi, MidiWithData, Midis } from '../../generated/midi-api';
import { deleteMidi, fetchMidiAndData, fetchPublicMidis } from '../actions/midiActions';
import { ReactComponent as UserSvg } from '../../assets/user-alt-1-svgrepo-com.svg';
import { ThunkDispatch, bindActionCreators } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store';
import "./PublicMidis.css";

interface StateProps {
    publicMidis: Midis | null;
    activeMidi: MidiWithData | null;
} 
interface DispatchProps {
    fetchPublicMidis: () => void;
    fetchMidiAndData: (gerMidiRequest: GetMidiRequest) => void;
    deleteMidi: (deleteMidiRequest: DeleteMidiRequest) => void;
} 
interface PublicMidiListProps extends DispatchProps, StateProps {}

const PublicMidiList: React.FC<PublicMidiListProps> = ({ publicMidis, activeMidi, fetchPublicMidis, fetchMidiAndData, deleteMidi }) => {
    const [selectedMidiId, setSelectedMidiId] = useState<string>();
    const midis = publicMidis !== null && publicMidis.midis !== undefined ? publicMidis.midis : [];

    const handleDeleteBoxClick = async (event: React.MouseEvent<HTMLDivElement>, midi: Midi): Promise<void> => {
        const midiId = midi.midiId === null ? "" : midi.midiId as string;
        const requestObject: DeleteMidiRequest = { id: midiId };
        deleteMidi(requestObject);
        fetchPublicMidis();

    }
    const handleMidiClick = async (event: React.MouseEvent<HTMLDivElement>, midi: Midi): Promise<void> => {
        if (selectedMidiId === midi.midiId as string) {
            setSelectedMidiId("");
        } else {
            setSelectedMidiId(midi.midiId as string);
            const midiId = midi.midiId === null ? "" : midi.midiId as string;
            const activeId = activeMidi === null ? "" : activeMidi.meta?.midiId as string;
            if (midiId !== activeId) {
                const fetchRequest: GetMidiRequest = { id: midiId };
                fetchMidiAndData(fetchRequest);
            }
        }
    }

    useEffect((): void => {
    }, []);

    useEffect((): void => {
    }, [publicMidis]);

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
                        { midi.userMidi === false ? "" : <UserSvg className='user-symbol'/> }
                    <div className= { midi.userMidi === true ? 'user-midis-wrapper' : 'midis-wrapper' }>
                        <div className='midi' onClick={ (e) => handleMidiClick(e, midi) }>
                            <span className='midi-text-field'>{ midi.filename }</span>
                            { midi.title === null ? "" : <span className='midi-text-field'>{ midi.title }</span> }
                            { midi.artist === null ? "" : <span className='midi-text-field'>{ midi.artist }</span> }
                        </div>
                    </div>
                    
                </li>) ) }
            </ul>
        </div>
    </div>);
}

const mapStateToProps = (state: RootState): StateProps => ({
    publicMidis: state.midi.publicMidis,
    activeMidi: state.midi.activeMidi,
  });

  const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    fetchPublicMidis: bindActionCreators(fetchPublicMidis, dispatch),
    fetchMidiAndData: bindActionCreators(fetchMidiAndData, dispatch),
    deleteMidi: bindActionCreators(deleteMidi, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(PublicMidiList);