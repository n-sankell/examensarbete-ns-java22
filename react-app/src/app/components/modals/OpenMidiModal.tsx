import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { closeOpenMidiModal } from "../../actions/displayActions";
import { hideMidiErrors, hideMidiMessage, parseMidi } from "../../actions/midiActions";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../../store";
import "./OpenMidiModal.css";
import "./Modal.css";

interface DispatchProps {
    parseMidi: (request: string) => void;
    closeOpenMidiModal: () => void;
    hideMidiErrors: () => void;
    hideMidiMessage: () => void;
}
interface StateProps {
    displayParseMidiError: boolean;
    displayParseMidiSuccess: boolean;
    error: string | null;
}
interface CreateMidiModalProps extends StateProps, DispatchProps {}

const OpenMidiModal: React.FC<CreateMidiModalProps> = ( { error, parseMidi, closeOpenMidiModal, displayParseMidiError, displayParseMidiSuccess, hideMidiErrors, hideMidiMessage } ) => {
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const [fileString, setFileString] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [loadedFileName, setLoadedFileName] = useState<string>("");

    const closeModal = (): void => {
        closeOpenMidiModal();
        hideMidiErrors();
        hideMidiMessage();
        resetValues();
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (fileString !== null && fileString !== undefined) {
            parseMidi(fileString);
        }
    }

    const resetValues = (): void => {
        setFileString("");
        setFileName("");
        setFileLoaded(false);
    }
    
    useEffect((): void => {
    }, []);

    useEffect((): void => {
        if (displayParseMidiSuccess === true) {
            closeModal();
        } else {
            resetValues();
            hideMidiErrors();
        }
    }, [displayParseMidiSuccess]);
    
    return (<>
        <div className='overhang' onClick={ closeModal } />
        <div className='modal'>
        <div className='content-wrapper'>
        <div className="open-midi">
        <div className='title-container'><span className='title'>Open file</span></div>
        <form className="open-midi-form"
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
            <label htmlFor="input-add-file" className="open-file-input-label">
                { fileLoaded === true && loadedFileName !== undefined ? loadedFileName : "Choose a file" }
            </label>
        
            <div className="extra-space"></div>

            <input className="open-button" type="submit" value="Open file" disabled={ fileName === undefined || fileName === "" } />
            { displayParseMidiSuccess === true ? "" : "" }
            { displayParseMidiError === true ?  <span className="failure-message parse-midi-failure">{error}</span> : "" }
        </form>
        </div>
        </div>
        </div>
    </>);
}
const mapStateToProps = (state: RootState): StateProps => ({
    displayParseMidiError: state.midi.displayParseMidiError,
    displayParseMidiSuccess: state.midi.displayParseMidiSuccess,
    error: state.midi.error,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    parseMidi: bindActionCreators(parseMidi, dispatch),
    closeOpenMidiModal: bindActionCreators(closeOpenMidiModal, dispatch),
    hideMidiErrors: bindActionCreators(hideMidiErrors, dispatch),
    hideMidiMessage: bindActionCreators(hideMidiMessage, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(OpenMidiModal);