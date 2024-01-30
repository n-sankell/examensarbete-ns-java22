import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FoodsApi } from "../../generated";
import { AddFoodRequest } from "../../generated";
import "./AddFoodModal.css";

type Props = {
    setUpdate: Dispatch<SetStateAction<boolean>>;
    setShowAddModal: Dispatch<SetStateAction<boolean>>;
}

const AddFoodModal = (props: Props) => {
    const [initialNumber] = useState<number>();
    const foodsApi = new FoodsApi();
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
            const requestObject: AddFoodRequest = { food: { name: foodName, rating: Number.parseFloat(foodRating) } };
            const response = await foodsApi.addFood(requestObject);
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