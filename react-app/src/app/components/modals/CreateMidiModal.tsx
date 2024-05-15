import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeCreateMidiModal } from "../../actions/displayActions";
import { CreateMidiRequest } from "../../../generated/midi-api";
import { createMidi, hideMidiErrors, hideMidiMessage } from "../../actions/midiActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./CreateMidiModal.css";
import "./Modal.css";

interface DispatchProps {
    createMidi: (createMidiRequest: CreateMidiRequest) => void;
    closeCreateMidiModal: () => void;
    hideMidiErrors: () => void;
    hideMidiMessage: () => void;
}
interface StateProps {
    displayCreateMidiError: boolean;
    displayCreateMidiSuccess: boolean;
    error: string | null;
}
interface CreateMidiModalProps extends StateProps, DispatchProps {}

const CreateMidiModal: React.FC<CreateMidiModalProps> = ( { error, createMidi, closeCreateMidiModal, displayCreateMidiError, displayCreateMidiSuccess, hideMidiErrors, hideMidiMessage } ) => {
    const [title, setTitle] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(true);
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const [fileString, setFileString] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [addMore, setAddMore] = useState<boolean>(false);
    const [loadedFileName, setLoadedFileName] = useState<string>("");

    const closeModal = (): void => {
        closeCreateMidiModal();
        hideMidiErrors();
        hideMidiMessage();
        resetValues();
    }
    const handleTitleChange = (titleEvent: any): void => {
        hideMidiErrors();
        hideMidiMessage();
        setTitle(titleEvent.target.value);
    }
    const handleArtistChange = (artistEvent: any): void => {
        hideMidiErrors();
        hideMidiMessage();
        setArtist(artistEvent.target.value);
    }
    const handlePrivateChange = (privateEvent: any): void => {
        hideMidiErrors();
        hideMidiMessage();
        if (isPrivate) {
            setIsPrivate(false);
        } else {
            setIsPrivate(true);
        }
    }
    const handleFileInputChange = (fileEvent: any): void => {
        hideMidiErrors();
        hideMidiMessage();
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
        setLoadedFileName(file.name === undefined ? "" : file.name);
        setFileName(file.name === undefined ? "" : file.name);
    }
    const handleFileNameChange = (filenameEvent: any): void => {
        hideMidiErrors();
        hideMidiMessage();
        setFileName(filenameEvent.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        
        const requestObject: CreateMidiRequest = { 
            midiCreateRequest: { 
                isPrivate: isPrivate, 
                filename: fileName,
                artist: artist === "" ? undefined : artist, 
                title: title === "" ? undefined : title,
                midiFile: fileString
            }
        };
        createMidi(requestObject);
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

    useEffect((): void => {
    }, [displayCreateMidiError]);

    useEffect((): void => {
        if (displayCreateMidiSuccess === true && addMore === false) {
            closeModal();
        } else {
            resetValues();
            hideMidiErrors();
        }
    }, [displayCreateMidiSuccess]);
    
    return (<>
        <div className='overhang' onClick={ closeModal } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className="add-midi">
        <div className='title-container'><span className='title'>Upload new file</span></div>
        <form className="add-midi-form"
            onSubmit={ handleSubmit } >
            <input 
                onChange={ handleFileInputChange } 
                placeholder="Choose a file..." 
                className="input-add-file"
                id="input-add-file"
                type="file"
                accept=".mid"
                required={ true }
            />
            <label htmlFor="input-add-file" className="add-file-input-label">
                { fileLoaded === true && loadedFileName !== undefined ? loadedFileName : "Choose a file" }
            </label>
            { fileLoaded ? <>
                <div className="divider">
                <div className="divider-left"><div className="divider-line"></div><div className="divider-bottom"></div></div>
                <div className="divider-file-middle">
                    <span className="divider-text">File info</span>
                </div>
                <div className="divider-right"><div className="divider-line"></div><div className="divider-bottom"></div></div>
            </div>
            <div className="input-row">
            <div className="extra-space"></div>
            <input
                onChange={ handleTitleChange } 
                placeholder="Title..." 
                className="input-add"
                value={ title }
                maxLength={ 200 }
                required={ false }
            />
            </div>
            <div className="input-row">
            <input
                onChange={ handleArtistChange } 
                placeholder="Artist..." 
                className="input-add"
                value={ artist }
                maxLength={ 200 }
                required={ false }
            />
            </div>
            <div className="input-row">
            <input
                onChange={ handleFileNameChange }
                className="input-add"
                value={ fileName !== undefined ? fileName : "" }
                maxLength={ 100 }
                required={ true } 
            /> 
            </div>
            <div className="input-row">
            <div className="checkbox-wrapper">
            <label className="switch">
                <input
                    id ="checkbox-id"
                    onChange={ handlePrivateChange }
                    className="input-box"
                    type="checkbox"
                    checked={ isPrivate }
                    required={ false }
                />
                <span className="slider"></span>
                </label>
                <label htmlFor="checkbox-id" className="box-label">Private</label>
            </div>
            </div>
            </> : "" }
            <input className="add-button" type="submit" value="Create midi" disabled={ fileName === undefined || fileName === "" } />
            { displayCreateMidiSuccess === true ? "" : "" }
            { displayCreateMidiError === true ?  <span className="failure-message create-midi-failure">{error}</span> : "" }
        </form>
        </div>
        </div>
        </div>
    </>);
}
const mapStateToProps = (state: RootState): StateProps => ({
    displayCreateMidiError: state.midi.displayCreateMidiError,
    displayCreateMidiSuccess: state.midi.displayCreateMidiSuccess,
    error: state.midi.error,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    createMidi: bindActionCreators(createMidi, dispatch),
    closeCreateMidiModal: bindActionCreators(closeCreateMidiModal, dispatch),
    hideMidiErrors: bindActionCreators(hideMidiErrors, dispatch),
    hideMidiMessage: bindActionCreators(hideMidiMessage, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateMidiModal);