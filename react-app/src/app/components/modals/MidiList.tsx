import { DeleteMidiRequest, GetMidiRequest, Midi, MidiWithData, Midis } from '../../../generated/midi-api';
import { deleteMidi, fetchMidiAndData, fetchPublicMidis, fetchUserMidis, parseMidi } from '../../actions/midiActions';
import { closePublicMidis, closeUserMidis } from '../../actions/displayActions';
import { ThunkDispatch, bindActionCreators } from '@reduxjs/toolkit';
import UserSvg from '../../../assets/user-alt-1-svgrepo-com.svg';
import LoadSvg from '../../../assets/music-stream-player-svgrepo-com.svg';
import DeleteSvg from '../../../assets/delete-2-svgrepo-com.svg';
import EditSvg from '../../../assets/edit-svgrepo-com.svg';
import { useEffect, useState } from 'react';
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
    parseMidi: (request: string) => void;
} 
interface MidisProps extends MidisDispatchProps, MidisStateProps, MidisLocalProps {}

const MidiList: React.FC<MidisProps> = ({ publicMidis, userMidis, activeMidi, fetchPublicMidis, fetchMidiAndData, deleteMidi, 
    privateFiles, closeUserMidis, closePublicMidis, parseMidi, doFetchMidis }) => {
    const [selectedMidiId, setSelectedMidiId] = useState<string>("");
    const midis = privateFiles === true ? 
    userMidis !== null && userMidis.midis !== undefined ? userMidis.midis : [] :
    publicMidis !== null && publicMidis.midis !== undefined ? publicMidis.midis : [];

    const handleDeleteBoxClick = async (event: React.MouseEvent<HTMLDivElement>, midi: Midi): Promise<void> => {
        const midiId = midi.midiId === null ? "" : midi.midiId as string;
        const requestObject: DeleteMidiRequest = { id: midiId };
        deleteMidi(requestObject);
        setSelectedMidiId("");
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
        event.preventDefault();
        closeModal();
    }

    const handleEditBoxClick = (event: any, midiId: string): void => {
        event.preventDefault();
        console.log("Edit click! " + midiId);
    }

    const handleLoadBoxClick = (event: any): void => {
        event.preventDefault();
        if (activeMidi !== null && activeMidi.binary !== undefined) {
            parseMidi(activeMidi.binary.midiFile);
            closeModal();
        }
    }

    const closeModal = (): void => {
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
    <div className='midi-list'>
    <div className="content">
        <h1 className='heading'> { privateFiles === true ? "User midis" : "Public midis" } </h1>
        <div className='list-wrapper'>
            <ul className='ul-list'> { midis.map((midi: Midi, index: number) => (
                <li key={ index } className='list-item'>
                    { midi.midiId === selectedMidiId ? <> 
                    <div className={ midi.userMidi === false || privateFiles === true ? 'select-wing' : 'user-select-wing'}>
                        <div className='load-box'>
                            <img src={LoadSvg} className='load-symbol' onClick={ (e) => handleLoadBoxClick(e) } />
                        </div>
                        { midi.userMidi === true ? <>
                        <div className='delete-box'>
                            <img src={DeleteSvg} className='delete-symbol' onClick={ (e) => handleDeleteBoxClick(e, midi) } />
                        </div> 
                        <div className='edit-box'>
                            <img src={EditSvg} className='edit-symbol' onClick={ (e) => handleEditBoxClick(e, midi.midiId) }></img>
                        </div> </> : "" } </div> </> : "" }
                        { midi.userMidi === false || privateFiles === true ? "" : <img src={UserSvg} className='user-symbol'/> }
                    <div className= {  midi.userMidi === false || privateFiles === true ?  'midis-wrapper' : 'user-midis-wrapper' }>
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
    parseMidi: bindActionCreators(parseMidi, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(MidiList);