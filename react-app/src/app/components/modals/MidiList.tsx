import { DeleteMidiRequest, GetMidiRequest, Midi, MidiWithData, Midis } from '../../../generated/midi-api';
import { deleteMidi, fetchMidiAndData, fetchPublicMidis, fetchUserMidis, parseMidi } from '../../actions/midiActions';
import { closePublicMidis, closeUserMidis, displayEditMidiModal } from '../../actions/displayActions';
import { ThunkDispatch, bindActionCreators } from '@reduxjs/toolkit';
import UserSvg from '../../../assets/user-alt-1-svgrepo-com.svg';
import LoadSvg from '../../../assets/play-player-music-svgrepo-com.svg';
import DeleteSvg from '../../../assets/delete-2-svgrepo-com.svg';
import EditSvg from '../../../assets/edit-svgrepo-com.svg';
import { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import "./MidiList.css";
import "./Modal.css";

interface MidisLocalProps {
    privateFiles: boolean;
}
interface MidisStateProps {
    publicMidis: Midis | null;
    userMidis: Midis |null;
    activeMidi: MidiWithData | null;
    doFetchMidis: boolean;
}
interface MidisDispatchProps {
    fetchPublicMidis: () => void;
    fetchMidiAndData: (gerMidiRequest: GetMidiRequest) => void;
    deleteMidi: (deleteMidiRequest: DeleteMidiRequest) => void;
    closePublicMidis: () => void;
    closeUserMidis: () => void;
    showEditMidiModal: () => void;
    parseMidi: (request: string) => void;
} 
interface MidisProps extends MidisDispatchProps, MidisStateProps, MidisLocalProps {}

const MidiList: React.FC<MidisProps> = ({ publicMidis, userMidis, activeMidi, fetchPublicMidis, fetchMidiAndData, deleteMidi, 
    privateFiles, closeUserMidis, closePublicMidis, parseMidi, doFetchMidis, showEditMidiModal }) => {
    const [selectedMidiId, setSelectedMidiId] = useState<string>("");
    const [promptDelete, setPromptDelete] = useState<boolean>(false);
    const midis = privateFiles === true ? 
    userMidis !== null && userMidis.midis !== undefined ? userMidis.midis : [] :
    publicMidis !== null && publicMidis.midis !== undefined ? publicMidis.midis : [];

    const handleDeleteBoxClick = async (event: React.MouseEvent<HTMLDivElement>, midi: Midi): Promise<void> => {
        event.preventDefault();
        setPromptDelete(true);
    }
    const deleteClick = async (event: React.MouseEvent<HTMLButtonElement>, midi: Midi): Promise<void> => {
        event.preventDefault();
        const midiId = midi.midiId === null ? "" : midi.midiId as string;
        const requestObject: DeleteMidiRequest = { id: midiId };
        deleteMidi(requestObject);
        setSelectedMidiId("");
        // TODO: implement redux state for error?
        setPromptDelete(false);
    }
    const handleMidiClick = async (event: React.MouseEvent<HTMLDivElement>, midi: Midi): Promise<void> => {
        setPromptDelete(false);
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
        event.preventDefault();
        closeModal();
    }

    const handleEditBoxClick = (event: any, midiId: string): void => {
        event.preventDefault();
        showEditMidiModal();
    }

    const handleLoadBoxClick = (event: any): void => {
        event.preventDefault();
        if (activeMidi !== null && activeMidi.binary !== undefined) {
            parseMidi(activeMidi.binary.midiFile);
            closeModal();
        }
    }

    const closeModal = (): void => {
        setPromptDelete(false);
        if (privateFiles === true) {
            closeUserMidis();
        } else {
            closePublicMidis();
        }
    }

    useEffect((): void => {
        if (privateFiles === true) {
            fetchUserMidis();
        } else {
            fetchPublicMidis();
        }
    }, []);

    useEffect((): void => {
    }, [publicMidis, userMidis]);

    useEffect((): void => {
        if (doFetchMidis === true) {
            fetchUserMidis();
            fetchPublicMidis();
        }
    }, [doFetchMidis]);

    return (<>
    <div className='overhang' onClick={ handleCloseClick } />
    <div className='modal'>
    <div className='content-wrapper'>
    <div className="midi-list">
        <div className='title-container'><span className='title'> { privateFiles === true ? "Your personal midi files" : "Public midis" } </span></div>
        <div className='list-wrapper'>
            <ul className='ul-list'> { midis.map((midi: Midi, index: number) => (
                <li key={ index } className='list-item'>
                    <div className= { 'midis-wrapper' }>
                        <div className='midi' onClick={ (e) => handleMidiClick(e, midi) }>
                            <span className='midi-text-field'>{ midi.filename }</span>
                            { midi.title === null ? "" : <span className='midi-text-field'>{ midi.title }</span> }
                            { midi.artist === null ? "" : <span className='midi-text-field'>{ midi.artist }</span> }
                        </div>
                    </div>
                    { midi.userMidi === false || privateFiles === true ? "" : <img src={ UserSvg } className='user-symbol'/> }
                    { midi.midiId === selectedMidiId ? <> 

                    <div className={ midi.userMidi === false || privateFiles === true ? 'select-wing' : 'select-wing'}>
                        <div className='load-box'>
                            <img src={ LoadSvg } className='load-symbol' onClick={ (e) => handleLoadBoxClick(e) } />
                        </div>
                        { midi.userMidi === true ? <>
                        <div className='delete-box'>
                            <img src={ DeleteSvg } className='delete-symbol' onClick={ (e) => handleDeleteBoxClick(e, midi) } />

                        </div> 
                        <div className='edit-box'>
                            <img src={ EditSvg } className='edit-symbol' onClick={ (e) => handleEditBoxClick(e, midi.midiId) }></img>
                        </div> </> : "" } 
                        </div>
                        { promptDelete === true ? 
                                <div className='delete-prompt'>
                                    <span>Delete midi file?</span>
                                    <div className='prompt-buttons'>
                                        <button className='prompt-button' onClick={ (e) => deleteClick(e, midi) }>Yes</button>
                                        <button className='prompt-button' onClick={ () => setPromptDelete(false) }>No</button>
                                    </div>
                                </div> : "" } 
                        </> : "" }
                </li>) ) }
            </ul>
        </div>
    </div>
    </div>
    </div>
    </>);
}

const mapStateToProps = (state: RootState): MidisStateProps => ({
    publicMidis: state.midi.publicMidis,
    userMidis: state.midi.userMidis,
    activeMidi: state.midi.activeMidi,
    doFetchMidis: state.midi.doFetchMidis,
  });

  const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): MidisDispatchProps => ({
    fetchPublicMidis: bindActionCreators(fetchPublicMidis, dispatch),
    fetchMidiAndData: bindActionCreators(fetchMidiAndData, dispatch),
    deleteMidi: bindActionCreators(deleteMidi, dispatch),
    closePublicMidis: bindActionCreators(closePublicMidis, dispatch),
    closeUserMidis: bindActionCreators(closeUserMidis, dispatch),
    showEditMidiModal: bindActionCreators(displayEditMidiModal, dispatch),
    parseMidi: bindActionCreators(parseMidi, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(MidiList);