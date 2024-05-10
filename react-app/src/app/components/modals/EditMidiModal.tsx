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

    if (activeMidi !== null) {
    
    const [title, setTitle] = useState<string | undefined>(activeMidi.meta.title);
    const [artist, setArtist] = useState<string | undefined>(activeMidi.meta.artist);
    const [isPrivate, setIsPrivate] = useState<boolean | undefined>(activeMidi.meta.isPrivate);
    const [fileName, setFileName] = useState<string>(activeMidi.meta.filename);
    const [fileString, setFileString] = useState<string>(activeMidi.binary.midiFile);
    const [newFileLoaded, setNewFileLoaded] = useState<boolean>(false);

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
          setNewFileLoaded(true);
        };

        reader.readAsDataURL(file);
        setFileName(file.name == null ? "" : file.name);
    }
    const handleFileNameChange = (filenameEvent: any): void => {
        setFileName(filenameEvent.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const metaData = containsMetaChange() ? {
            isPrivate: isPrivate, 
            filename: fileName, 
            artist: artist, 
            title: title
        } : undefined;

        const binaryData = newFileLoaded === true && containsBinaryChange() ? {
            midiFile: fileString
        } : undefined;
        
        const requestObject: EditMidiRequest = { 
            id: activeMidi === null ? "" : activeMidi.meta.midiId,
            midiEditRequest: { 
                metadata: metaData, 
                binaryData: binaryData
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
        setNewFileLoaded(false);
    }

    const containsMetaChange = (): boolean => {
        const isEqual = fileName === activeMidi.meta.filename
            && title === activeMidi.meta.title
            && artist === activeMidi.meta.artist
            && isPrivate === activeMidi.meta.isPrivate;

        return !isEqual;
    }

    const containsBinaryChange = (): boolean => {
        const isEqual = fileString === activeMidi.binary.midiFile;
        return !isEqual;
    }
    
    useEffect((): void => {
    }, []);
    
    return (<>
        <div className='overhang' onClick={ closeClick } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className="edit-midi">
        <div className='title-container'><span className='title'>File info - edit file</span></div>
            <div className="info-container">
                <div className="file-info">
                    <div><span>Filename: </span><span>{ activeMidi.meta.filename }</span></div>
                    { activeMidi.meta.artist !== null ? <div><span>Artist: </span><span>{ activeMidi.meta.artist }</span></div> : "" }
                    { activeMidi.meta.title !== null ? <div><span>Title: </span><span>{ activeMidi.meta.title } </span></div> : "" }
                </div>
                    
            </div>
        
        <form className="edit-midi-form"
            onSubmit={ handleSubmit } >
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
            <input 
                onChange={ handleFileInputChange } 
                placeholder="Choose a file..." 
                className="input-add"
                type="file"
                accept=".mid"
                required={ false }
            />
            <input className="edit-button" type="submit" value="Save" disabled={ !containsMetaChange() && !containsBinaryChange() }/>
        </form>
        </div>
        </div>
        </div>
    </>);

    } else {
        console.error("Midi was not loaded properly");
        return (<><div><span>No file found</span></div></>);
    }
}
const mapStateToProps = (state: RootState): StateProps => ({
    activeMidi: state.midi.activeMidi,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    editMidi: bindActionCreators(editMidi, dispatch),
    closeEditMidiModal: bindActionCreators(closeEditMidiModal, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(EditMidiModal);