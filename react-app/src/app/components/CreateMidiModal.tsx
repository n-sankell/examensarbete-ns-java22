import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CreateMidiRequest } from "../../generated/midi-api";
import { MidiApi } from "../../generated/midi-api";
import "./CreateMidiModal.css";

type Props = {
    setUpdate: Dispatch<SetStateAction<boolean>>;
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
    midiApi: MidiApi;
    token: string;
}

const CreateMidiModal = (props: Props) => {
    const [title, setTitle] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(true);
    const [fileLoaded, setFileLoaded] = useState<boolean>(false);
    const [fileString, setFileString] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const closeClick = (): void => {
        resetValues();
        props.setShowAddModal(false);
    }
    const handleTitleChange = (titleEvent: any) => {
        setTitle(titleEvent.target.value);
    }
    const handleArtistChange = (artistEvent: any) => {
        setArtist(artistEvent.target.value);
    }
    const handlePrivateChange = (privateEvent: any) => {
        if (isPrivate) {
            setIsPrivate(false);
        } else {
            setIsPrivate(true);
        }
    }
    const handleFileInputChange = (fileEvent: any) => {
        const file = fileEvent.target.files[0];
        if (!file) return;
        const reader = new FileReader();
    
        reader.onloadend = () => {
          const fileString = reader.result == null ? "" : reader.result as string;
          const base64String = fileString.split(",")[1];
          setFileString(base64String);
          setFileLoaded(true);
        };

        reader.readAsDataURL(file);
        setFileName(file.name == null ? "" : file.name);
    }
    const handleFileNameChange = (filenameEvent: any) => {
        setFileName(filenameEvent.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const requestObject: CreateMidiRequest = { 
                midiCreateRequest: { 
                    isPrivate: isPrivate, 
                    filename: fileName, 
                    artist: artist === "" ? undefined : artist, 
                    title: title === "" ? undefined : title,
                    midiFile: fileString
                 } };
            const response = await props.midiApi.createMidiRaw(requestObject);
            console.log(response);
            resetValues();
            props.setUpdate(true);
            props.setShowAddModal(false);
        } catch (error) {
            console.error('Error creating midi ' + error);
        }
    }

    const resetValues = () => {
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
    </>);
}

export default CreateMidiModal;