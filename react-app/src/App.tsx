import { useEffect, useState } from 'react';
import { Foods, FoodsApi } from './generated';
import Content from './app/components/Content';
import Header from './app/components/Header';
import './App.css';
import AddFoodModal from './app/components/AddFoodModal';

const foodsApi = new FoodsApi();

function App() {
  const [content, setContent] = useState(<></>);
  const [doFetch, setDoFetch] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteBoxes, setShowDeleteBoxes] = useState<boolean>(false);
  const [foods, setFoods] = useState<Foods>({});

  async function fetchFoods(): Promise<void> {
    try {
      const foodsResponse = await foodsApi.getFoods();
      setFoods(foodsResponse);
      setContent(<Content foods={foodsResponse} showDeleteBox={showDeleteBoxes} setUpdate={setDoFetch}/>)
      setDoFetch(false);
    } catch (error) {
      console.error('Error fetching foods: ' + error);
    }
  };
  
  useEffect((): void => {
  }, [content]);

  useEffect((): void => {
    <Content foods={foods} showDeleteBox={showDeleteBoxes} setUpdate={setDoFetch}/>
  }, [setShowDeleteBoxes]);

  useEffect((): void => {
    if (doFetch === true) {
      setDoFetch(false);
      fetchFoods();
    }
  }, [doFetch]);

  const addFoodModal = <AddFoodModal setUpdate={setDoFetch} setShowAddModal={setShowAddModal} />

  return (
    <div className="App">
      <Header setShowAddModal={setShowAddModal} setShowEditModal={setShowEditModal} 
              setShowDeleteBoxes={setShowDeleteBoxes} showDeleteBoxes={showDeleteBoxes}
              foods={foods} setContent={setContent} setUpdate={setDoFetch}/>
      <main className="main">
        { content }
        { showAddModal ? addFoodModal : "" }
      </main>
    </div>
  );
}

export default App;
