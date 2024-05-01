import { DeleteMidiRequest, GetMidiRequest, Midi, MidiWithData, Midis } from '../../generated/midi-api';
import { deleteMidi, fetchMidiAndData, fetchPublicMidis } from '../actions/midiActions';
import { closePublicMidis, closeUserMidis } from '../actions/displayActions';
import { ThunkDispatch, bindActionCreators } from '@reduxjs/toolkit';
import UserSvg from '../../assets/user-alt-1-svgrepo-com.svg';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store';
import "./MidiList.css";

interface MidisLocalProps {
    privateFiles: boolean;
}
interface MidisStateProps {
    publicMidis: Midis | null;
    userMidis: Midis |null;
    activeMidi: MidiWithData | null;
}
interface MidisDispatchProps {
    fetchPublicMidis: () => void;
    fetchMidiAndData: (gerMidiRequest: GetMidiRequest) => void;
    deleteMidi: (deleteMidiRequest: DeleteMidiRequest) => void;
    closePublicMidis: () => void;
    closeUserMidis: () => void;
} 
interface MidisProps extends MidisDispatchProps, MidisStateProps, MidisLocalProps {}

const MidiList: React.FC<MidisProps> = ({ publicMidis, userMidis, activeMidi, fetchPublicMidis, fetchMidiAndData, deleteMidi, 
    privateFiles, closeUserMidis, closePublicMidis }) => {
    const [selectedMidiId, setSelectedMidiId] = useState<string>();
    const midis = privateFiles === true ? 
    userMidis !== null && userMidis.midis !== undefined ? userMidis.midis : [] :
    publicMidis !== null && publicMidis.midis !== undefined ? publicMidis.midis : [];

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
    const handleCloseClick = (event: any):void => {
        if (privateFiles === true) {
            closeUserMidis();
        } else {
            closePublicMidis();
        }
    }

    useEffect((): void => {
    }, []);

    useEffect((): void => {
    }, [publicMidis, userMidis]);

    return (
    <div className="content">
        <h1 className='heading'> { privateFiles === true ? "User midis" : "Public midis" } </h1>
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
                        { midi.userMidi === false || privateFiles === true ? "" : <img src={UserSvg} className='user-symbol'/> }
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
        <div className='list-close-button' onClick={(event) => handleCloseClick(event)}><span>X</span></div>
    </div>);
}

const mapStateToProps = (state: RootState): MidisStateProps => ({
    publicMidis: state.midi.publicMidis,
    userMidis: state.midi.userMidis,
    activeMidi: state.midi.activeMidi,
  });

  const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): MidisDispatchProps => ({
    fetchPublicMidis: bindActionCreators(fetchPublicMidis, dispatch),
    fetchMidiAndData: bindActionCreators(fetchMidiAndData, dispatch),
    deleteMidi: bindActionCreators(deleteMidi, dispatch),
    closePublicMidis: bindActionCreators(closePublicMidis, dispatch),
    closeUserMidis: bindActionCreators(closeUserMidis, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(MidiList);