import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MidiApi } from "../../generated/midi-api";
import { CreateMidiRequest } from "../../generated/midi-api";
import "./AddFoodModal.css";

type Props = {
    setUpdate: Dispatch<SetStateAction<boolean>>;
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
    midiApi: MidiApi;
}

const AddFoodModal = (props: Props) => {
    const [initialNumber] = useState<number>();
    const [foodName, setFoodName] = useState<string>("");
    const [foodRating, setFoodRating] = useState<string>("");

    const closeClick = (): void => {
        props.setShowAddModal(false);
    }
    const handleFoodNameChange = (foodNameEvent: any) => {
        setFoodName(foodNameEvent.target.value);
    }
    const handleFoodRatingChange = (foodRatingEvent: any) => {
        setFoodRating(foodRatingEvent.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const requestObject: CreateMidiRequest = { 
                midiCreateRequest: { 
                    isPrivate: false, 
                    filename: "coolartist-goodsong", 
                    artist: "coolartist", 
                    title: "goodsong",
                    midiFile: "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"
                 } };
            const response = await props.midiApi.createMidiRaw(requestObject);
            console.log(response);
            props.setUpdate(true);
            setFoodName("");
            setFoodRating("");
        } catch (error) {
            console.error('Error fetching foods');
        }
    }
    
    useEffect((): void => {
    }, []);
    
    return (<>
        <div className='overhang' onClick={closeClick} />
        <div className='addFoodModal'>
        <div className="add-food">
        <h3 className='h3-title'>Add a yummy food</h3>
        <form className="add-food-form"
            onSubmit={handleSubmit} >
            <input
                onChange={handleFoodNameChange} 
                placeholder="Type a food name..." 
                className="input-add"
                value={foodName}
                maxLength={20}
                required={true} 
            />
            <input 
                onChange={handleFoodRatingChange} 
                placeholder="Choose a rating..." 
                className="input-add"
                type="number"
                value={foodRating}
                min="1" max="10" step="0.5"
                required={true} 
            />
            <input className="add-button" type="submit" value="Add food" />
        </form>
        </div>
        </div>
    </>);
}

export default AddFoodModal;