import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeEditMidiModal } from "../../actions/displayActions";
import { EditMidiRequest, MidiWithData } from "../../../generated/midi-api";
import { editMidi, hideMidiErrors, hideMidiMessage } from "../../actions/midiActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import downArrowSvg from "../../../assets/down-arrow-svgrepo-com.svg";
import "./EditMidiModal.css";
import "./Modal.css";

interface DispatchProps {
    editMidi: (editMidiRequest: EditMidiRequest) => void;
    closeEditMidiModal: () => void;
    hideMidiErrors: () => void;
    hideMidiMessage: () => void;
}
interface StateProps {
    activeMidi: MidiWithData | null;
    displayEditMidiSuccess: boolean;
    displayEditMidiError: boolean;
    error: string | null;
}
interface EditMidiModalProps extends StateProps, DispatchProps {}

const EditMidiModal: React.FC<EditMidiModalProps> = ( { error, editMidi, closeEditMidiModal, activeMidi, hideMidiErrors, hideMidiMessage, displayEditMidiError, displayEditMidiSuccess } ) => {

    if (activeMidi !== null) {
    
    const [title, setTitle] = useState<string | undefined>(activeMidi.meta.title);
    const [artist, setArtist] = useState<string | undefined>(activeMidi.meta.artist);
    const [isPrivate, setIsPrivate] = useState<boolean | undefined>(activeMidi.meta.isPrivate);
    const [fileName, setFileName] = useState<string>(activeMidi.meta.filename);
    const [fileString, setFileString] = useState<string>(activeMidi.binary.midiFile);
    const [newFileLoaded, setNewFileLoaded] = useState<boolean>(false);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [showFileForm, setShowFileForm] = useState<boolean>(false);
    const [useNewFilename, setUseNewFilename] = useState<boolean>(false);
    const [newFileName, setNewFilename] = useState<string>("");
    let oldFileName: string = activeMidi.meta.filename;

    const closeModal = (): void => {
        closeEditMidiModal();
        hideMidiErrors();
        hideMidiMessage();
        resetValues();
    }
    const handleTitleChange = (titleEvent: any): void => {
        hideMidiErrors();
        hideMidiMessage();
        if (titleEvent.target.value === "") {
            setTitle(undefined);
        } else {
            setTitle(titleEvent.target.value);
        }
    }
    const handleArtistChange = (artistEvent: any): void => {
        hideMidiErrors();
        hideMidiMessage();
        if (artistEvent.target.value === "") {
            setArtist(undefined);
        } else {
            setArtist(artistEvent.target.value);
        }
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
          setNewFileLoaded(true);
        };

        reader.readAsDataURL(file);
        setNewFilename(file.name == null ? "" : file.name);
        if (useNewFilename === true) {
            setFileName(file.name == null ? "" : file.name);
        }
    }
    const handleFileNameChange = (filenameEvent: any): void => {
        hideMidiErrors();
        hideMidiMessage();
        setFileName(filenameEvent.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const metaData = containsMetaChange() ? {
            isPrivate: isPrivate, 
            filename: fileName, 
            artist: artist === "" ? undefined : artist, 
            title: title === "" ? undefined : title
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
        editMidi(requestObject);
    }

    const resetValues = (): void => {
        setTitle("");
        setArtist("");
        setIsPrivate(true);
        setFileString("");
        setFileName("");
        setNewFileLoaded(false);
    }
    const resetValuesToBase = (): void => {
        setTitle(activeMidi.meta.title);
        setArtist(activeMidi.meta.artist);
        setIsPrivate(activeMidi.meta.isPrivate);
        setFileString(activeMidi.binary.midiFile);
        setFileName(activeMidi.meta.filename);
        oldFileName = activeMidi.binary.midiFile;
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

    const handleShowFileInput = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();
        if (showFileForm === true) {
            setShowFileForm(false);
        } else {
            setShowFileForm(true);
        }
    }

    const handleShowEditInput = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        event.preventDefault();
        if (showEditForm === true) {
            setShowEditForm(false);
        } else {
            setShowEditForm(true);
        }
    }

    const handleUseNewFilename = (event: any): void => {
        hideMidiErrors();
        hideMidiMessage();
        if (useNewFilename) {
            setUseNewFilename(false);
            setFileName(oldFileName);
        } else {
            setUseNewFilename(true);
            if (newFileLoaded === true) {
                setFileName(newFileName);
            }
        }
    }
    
    useEffect((): void => {
    }, []);

    useEffect((): void => {
        if (displayEditMidiSuccess === true) {
            resetValuesToBase();
        }
    }, [displayEditMidiError, displayEditMidiSuccess, activeMidi]);
    
    return (<>
        <div className='overhang' onClick={ closeModal } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className={`edit-midi`}>
        <div className='title-container'><span className='title'>File info - Edit file</span></div>
            <div className="info-container">
                <div className="file-info">
                    <div className="info-row">
                        <span className="left-span">Filename: </span>
                        <span className="right-span">{ activeMidi.meta.filename }</span>
                    </div>
                    { activeMidi.meta.artist !== undefined ? 
                    <div className="info-row">
                        <span className="left-span">Artist: </span>
                        <span className="right-span">{ activeMidi.meta.artist }</span>
                    </div> : "" }
                    { activeMidi.meta.title !== undefined ? 
                    <div className="info-row">
                        <span className="left-span">Title: </span>
                        <span className="right-span">{ activeMidi.meta.title } </span>
                    </div> : "" }
                    <div className="info-row">
                        <span className="left-span">Created: </span>
                        <span className="right-span">{ activeMidi.meta.dateCreated }</span>
                    </div>
                    <div className="info-row">
                        <span className="left-span">Last edited: </span>
                        <span className="right-span">{ activeMidi.meta.dateEdited }</span>
                    </div>
                    <div className="info-row">
                        <span className="left-span">Public file: </span>
                        <span className="right-span">{ activeMidi.meta.isPrivate === undefined || activeMidi.meta.isPrivate === true ? "No" : "Yes"}</span>
                    </div>
                </div>                    
            </div>

        <form className="edit-midi-form"
            onSubmit={ handleSubmit } >
                { showFileForm === true || showEditForm === true ? 
                <input className="edit-button" type="submit" value="Save" 
            disabled={ !containsMetaChange() && !containsBinaryChange() }/>
            : "" }
            { displayEditMidiSuccess === true ? <span className="success-message edit-midi-success">Changes saved!</span> : "" }
            { displayEditMidiError === true ?  <span className="failure-message edit-midi-failure">{error}</span> : "" }
            <div className="show-file-edit-fields" onClick={ (event)=> handleShowEditInput(event) }>
                <div className="divider">
                    <div className="divider-left"><div className="divider-line"></div><div className="divider-bottom"></div></div>
                    <div className="divider-middle">
                        <img className={`expand-arrow ${showEditForm ? 'expand-arrow-expanded' : ''}`} src={ downArrowSvg }></img>
                        <span className="divider-text">Edit info</span>
                    </div>
                    <div className="divider-right"><div className="divider-line"></div><div className="divider-bottom"></div></div>
                </div>
            </div>
            <div className={`edit-meta-container ${showEditForm ? 'edit-meta-container-expanded' : ''}`}>
            <div className="input-row">
            <input
                onChange={ handleTitleChange } 
                placeholder="Title..." 
                className="input-edit"
                value={ title }
                maxLength={ 200 }
                required={ false }
            />
            <input
                onChange={ handleArtistChange } 
                placeholder="Artist..." 
                className="input-edit"
                value={ artist }
                maxLength={ 200 }
                required={ false }
            />
            </div>
            <div className="input-row">
            <input
                onChange={ handleFileNameChange }
                className="input-edit"
                value={ fileName }
                maxLength={ 100 }
                required={ true } 
            /> 
            <div className="checkbox-edit-wrapper">
            <div>
            <label className="switch">
                <input 
                    id="slider-checkbox"
                    onChange={ handlePrivateChange }
                    className="hidden-checkbox"
                    type="checkbox" 
                    checked={ isPrivate }
                    required={ false }
                />
                <span className="slider"></span>
                </label>
                <label htmlFor="slider-checkbox" className="box-edit-label">Private</label>
            </div>
            </div>
            </div>
            </div>

            <div className="show-file-edit-fields" onClick={ (event)=> handleShowFileInput(event) }>
            <div className="divider">
                <div className="divider-left"><div className="divider-line"></div><div className="divider-bottom"></div></div>
                <div className="divider-file-middle">
                    <img className={`expand-arrow ${showFileForm ? 'expand-arrow-expanded' : ''}`} src={ downArrowSvg }></img>
                    <span className="divider-text">Change midi file</span>
                </div>
                <div className="divider-right"><div className="divider-line"></div><div className="divider-bottom"></div></div>
            </div>
            </div>

            <div className={`edit-binary-container ${ showFileForm ? 'edit-binary-container-expanded' : ''}`}>
            <div className="input-row">
            <input 
                id="input-edit-file"
                onChange={ handleFileInputChange } 
                placeholder="Choose a file..." 
                className="input-edit-file"
                type="file"
                accept=".mid"
                required={ false }
            />
            <label htmlFor="input-edit-file" className="edit-file-input-label">
                { newFileLoaded === false ? "Choose a file" : newFileName }
            </label>
            <div className="checkbox-edit-wrapper">
            <label className="switch">
                <input 
                    id="slider-file-checkbox"
                    onChange={ handleUseNewFilename }
                    className="hidden-checkbox"
                    type="checkbox" 
                    checked={ useNewFilename }
                    required={ false }
                />
                <span className="slider"></span>
                </label>
                <label htmlFor="slider-file-checkbox" className="box-edit-label">Use new filename</label>
                </div>
            </div>    
            </div>
            
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
    displayEditMidiError: state.midi.displayEditMidiError,
    displayEditMidiSuccess: state.midi.displayEditMidiSuccess,
    error: state.midi.error,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    editMidi: bindActionCreators(editMidi, dispatch),
    closeEditMidiModal: bindActionCreators(closeEditMidiModal, dispatch),
    hideMidiErrors: bindActionCreators(hideMidiErrors, dispatch),
    hideMidiMessage: bindActionCreators(hideMidiMessage, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(EditMidiModal);