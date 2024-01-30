import { Dispatch, MouseEventHandler, SetStateAction, useEffect } from 'react';
import { DeleteFoodRequest, Food, FoodToJSON, Foods, FoodsApi } from '../../generated';
import "./Content.css";

type Props = {
    foods: Foods;
    showDeleteBox: boolean;
    setUpdate: Dispatch<SetStateAction<boolean>>;
}

const Content = (props: Props) => {
    const foodsApi = new FoodsApi();
    const foods = props.foods.foods === undefined ? [] : props.foods.foods;
    const handleDeleteBoxClick = async (event: React.MouseEvent<HTMLDivElement>, food: Food): Promise<void> => {
        
        const foodId = food.id === null ? "" : food.id as string;
        console.log(foodId);
        try {
            const requestObject: DeleteFoodRequest = { id: food.id ? food.id : "" };
            const response = await foodsApi.deleteFood(requestObject);
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
            <ul className='ul-list'> { foods.map((food: Food, index) => (
                <li key={index} className='list-item'>
                    {props.showDeleteBox === true ? 
                        <div className='deleteBox' onClick={ (e) => handleDeleteBoxClick(e, food) }>
                            <span className='delete-symbol'>X</span>
                        </div> : "" }
                    <div className="food-wrapper">
                        <div className='food'>
                            <span className='food-name'>{food.name}</span>
                            <div className='food-rating-wrapper'>
                                <div className='food-rating-text'><span>Rating: </span></div>
                                <div className='food-rating-value'><span>{food.rating}</span></div>
                            </div>
                        </div>
                    </div>
                </li>) ) }
            </ul>
        </div>
    </div>);
}

export default Content;