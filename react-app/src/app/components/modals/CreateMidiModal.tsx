import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeCreateMidiModal } from "../../actions/displayActions";
import { CreateMidiRequest } from "../../../generated/midi-api";
import { createMidi } from "../../actions/midiActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./CreateMidiModal.css";
import "./Modal.css";

interface DispatchProps {
    createMidi: (createMidiRequest: CreateMidiRequest) => void;
    closeCreateMidiModal: () => void;
}
interface StateProps {
    displayCreateMidiError: boolean;
}
interface CreateMidiModalProps extends StateProps, DispatchProps {}

const CreateMidiModal: React.FC<CreateMidiModalProps> = ( { createMidi, closeCreateMidiModal, displayCreateMidiError } ) => {
    const [title, setTitle] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(true);
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const [fileString, setFileString] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const closeClick = (): void => {
        closeCreateMidiModal();
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
        
        const requestObject: CreateMidiRequest = { 
            midiCreateRequest: { 
                isPrivate: isPrivate, 
                filename: fileName, 
                artist: artist === "" ? undefined : artist, 
                title: title === "" ? undefined : title,
                midiFile: fileString
            }
        };
        createMidi(requestObject)
        resetValues();
        //TODO: add option to add more?
        closeCreateMidiModal();
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
        <div className='overhang' onClick={closeClick} />
        <div className='modal'>
        <div className='addMidiModal'>
        <div className="add-midi">
        <h3 className='h3-title'>Add new midi file</h3>
        <form className="add-midi-form"
            onSubmit={handleSubmit} >
            <input 
                onChange={handleFileInputChange} 
                placeholder="Choose a file..." 
                className="input-add"
                type="file"
                accept=".mid"
                required={true}
            />
            { fileLoaded ? <>
            <input
                onChange={handleTitleChange} 
                placeholder="Title..." 
                className="input-add"
                value={title}
                maxLength={200}
                required={false}
            />
            <input
                onChange={handleArtistChange} 
                placeholder="Artist..." 
                className="input-add"
                value={artist}
                maxLength={200}
                required={false}
            />
            <input
                onChange={handleFileNameChange}
                className="input-add"
                value={fileName}
                maxLength={100}
                required={true} 
            /> 
            <div className="checkbox-wrapper">
                <input
                    id ="checkbox-id"
                    onChange={handlePrivateChange}
                    className="input-box"
                    type="checkbox"
                    checked={isPrivate}
                    required={false}
                ></input>
                <label htmlFor="checkbox-id" className="box-label">Private</label>
            </div>
            </> : "" }
            <input className="add-button" type="submit" value="Create midi" />
        </form>
        </div>
        </div>
        </div>
    </>);
}
const mapStateToProps = (state: RootState): StateProps => ({
    displayCreateMidiError: state.midi.displayCreateMidiError,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    createMidi: bindActionCreators(createMidi, dispatch),
    closeCreateMidiModal: bindActionCreators(closeCreateMidiModal, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateMidiModal);