import { Dispatch, SetStateAction, useEffect } from 'react';
import { DeleteMidiRequest, Midi, MidiApi, Midis } from '../../generated/midi-api';
import "./Content.css";

type Props = {
    foods: Midis;
    showDeleteBox: boolean;
    setUpdate: Dispatch<SetStateAction<boolean>>;
}

const Content = (props: Props) => {
    const foodsApi = new MidiApi();
    const foods = props.foods.midis === undefined ? [] : props.foods.midis;
    const handleDeleteBoxClick = async (event: React.MouseEvent<HTMLDivElement>, food: Midi): Promise<void> => {
        
        const foodId = food.midiId === null ? "" : food.midiId as string;
        console.log(foodId);
        try {
            const requestObject: DeleteMidiRequest = { id: food.midiId ? food.midiId : "" };
            const response = await foodsApi.deleteMidi(requestObject);
            console.log(response);
            props.setUpdate(true);
        } catch (error) {
            console.error('Error deleting food: ' + error);
        }
    }

    useEffect((): void => {
    }, []);

    return (
    <div className="content">
        <h1 className='heading'>My favourite foods</h1>
        <div className='list-wrapper'>
            <ul className='ul-list'> { foods.map((food: Midi, index: number) => (
                <li key={index} className='list-item'>
                    {props.showDeleteBox === true ? 
                        <div className='deleteBox' onClick={ (e) => handleDeleteBoxClick(e, food) }>
                            <span className='delete-symbol'>X</span>
                        </div> : "" }
                    <div className="food-wrapper">
                        <div className='food'>
                            <span className='food-name'>{food.filename}</span>
                            <div className='food-rating-wrapper'>
                                <div className='food-rating-text'><span>Rating: </span></div>
                                <div className='food-rating-value'><span>{food.title}</span></div>
                            </div>
                        </div>
                    </div>
                </li>) ) }
            </ul>
        </div>
    </div>);
}

export default Content;