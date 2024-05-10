import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeCreateMidiModal, closeEditMidiModal } from "../../actions/displayActions";
import { EditMidiRequest, MidiWithData } from "../../../generated/midi-api";
import { editMidi } from "../../actions/midiActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./EditMidiModal.css";
import "./Modal.css";

interface DispatchProps {
    editMidi: (editMidiRequest: EditMidiRequest) => void;
    closeEditMidiModal: () => void;
}
interface StateProps {
    activeMidi: MidiWithData | null;
}
interface EditMidiModalProps extends StateProps, DispatchProps {}

const EditMidiModal: React.FC<EditMidiModalProps> = ( { editMidi, closeEditMidiModal, activeMidi } ) => {
    const [title, setTitle] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(true);
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const [fileString, setFileString] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const closeClick = (): void => {
        closeEditMidiModal();
        resetValues();
    }
    const handleTitleChange = (titleEvent: any): void => {
        setTitle(titleEvent.target.value);
    }
    const handleArtistChange = (artistEvent: any): void => {
        setArtist(artistEvent.target.value);
    }
    const handlePrivateChange = (privateEvent: any): void => {
        if (isPrivate) {
            setIsPrivate(false);
        } else {
            setIsPrivate(true);
        }
    }
    const handleFileInputChange = (fileEvent: any): void => {
        const file = fileEvent.target.files[0];
        if (!file) return;
        const reader = new FileReader();
    
        reader.onloadend = (): void => {
          const fileString = reader.result == null ? "" : reader.result as string;
          const base64String = fileString.split(",")[1];
          setFileString(base64String);
          setFileLoaded(true);
        };

        reader.readAsDataURL(file);
        setFileName(file.name == null ? "" : file.name);
    }
    const handleFileNameChange = (filenameEvent: any): void => {
        setFileName(filenameEvent.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        
        const requestObject: EditMidiRequest = { 
            id: activeMidi === null ? "" : activeMidi.meta.midiId,
            midiEditRequest: { 
                metadata: {
                    isPrivate: isPrivate, 
                    filename: fileName, 
                    artist: artist === "" ? undefined : artist, 
                    title: title === "" ? undefined : title,
                 }, 
                binaryData: {
                    midiFile: fileString
                }
            }
        };
        editMidi(requestObject)
        resetValues();
        closeEditMidiModal();
    }

    const resetValues = (): void => {
        setTitle("");
        setArtist("");
        setIsPrivate(true);
        setFileString("");
        setFileName("");
        setFileLoaded(false);
    }
    
    useEffect((): void => {
    }, []);
    
    return (<>
        <div className='overhang' onClick={ closeClick } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className="edit-midi">
            <div className="info-container">
                <span className='title'>File info</span>
                { activeMidi !== null ? <>
                    <span>Filename: { activeMidi.meta.filename }</span>
                    { activeMidi.meta.artist !== null ? <span>Artist: { activeMidi.meta.artist } </span> : "" }
                    { activeMidi.meta.title !== null ? <span>Title: { activeMidi.meta.title } </span> : "" }
                    </> : ""
                }
            </div>
        
        <form className="edit-midi-form"
            onSubmit={ handleSubmit } >
            <input 
                onChange={ handleFileInputChange } 
                placeholder="Choose a file..." 
                className="input-add"
                type="file"
                accept=".mid"
                required={ true }
            />
            { fileLoaded ? <>
            <input
                onChange={ handleTitleChange } 
                placeholder="Title..." 
                className="input-add"
                value={ title }
                maxLength={ 200 }
                required={ false }
            />
            <input
                onChange={ handleArtistChange } 
                placeholder="Artist..." 
                className="input-add"
                value={ artist }
                maxLength={ 200 }
                required={ false }
            />
            <input
                onChange={ handleFileNameChange }
                className="input-add"
                value={ fileName }
                maxLength={ 100 }
                required={ true } 
            /> 
            <div className="checkbox-wrapper">
                <input
                    id ="checkbox-id"
                    onChange={ handlePrivateChange }
                    className="input-box"
                    type="checkbox"
                    checked={ isPrivate }
                    required={ false }
                ></input>
                <label htmlFor="checkbox-id" className="box-label">Private</label>
            </div>
            </> : "" }
            <input className="edit-button" type="submit" value="Save" />
        </form>
        </div>
        </div>
        </div>
    </>);
}
const mapStateToProps = (state: RootState): StateProps => ({
    activeMidi: state.midi.activeMidi,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    editMidi: bindActionCreators(editMidi, dispatch),
    closeEditMidiModal: bindActionCreators(closeEditMidiModal, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(EditMidiModal);