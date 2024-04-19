import { useEffect, useState } from 'react';
import { Midi, Midis, MidiApi } from './generated/midi-api';
import Content from './app/components/Content';
import Header from './app/components/Header';
import './App.css';
import AddFoodModal from './app/components/AddFoodModal';
import { UserApi } from './generated/user-api';

const midiApi = new MidiApi();
const userApi = new UserApi();

function App() {
  const [content, setContent] = useState(<></>);
  const [doFetch, setDoFetch] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteBoxes, setShowDeleteBoxes] = useState<boolean>(false);
  const [foods, setFoods] = useState<Midis>({});
  const [token, setToken] = useState<string>("");

  async function fetchFoods(): Promise<void> {
    try {
      login();
      const foodsResponse = await midiApi.getPublicMidis();
      setFoods(foodsResponse);
      setContent(<Content foods={foodsResponse} showDeleteBox={showDeleteBoxes} setUpdate={setDoFetch} midiApi={midiApi}/>)
      setDoFetch(false);
    } catch (error) {
      console.error('Error fetching foods: ' + error);
    }
  };

  async function login(): Promise<void> {
    try {
      const request = { userLoginRequest: {userIdentifier: "niklas", password: "niklasniklas"} };
      const loginResponse = await userApi.loginRaw(request);
      const token = loginResponse.raw.headers.get("Authorization");
      console.log(token);
      setToken(token == null ? "" : token);
    } catch (error) {
      console.error('Login failed: ' + error);
    }
  };
  
  useEffect((): void => {
  }, [content]);

  useEffect((): void => {
    <Content foods={foods} showDeleteBox={showDeleteBoxes} setUpdate={setDoFetch} midiApi={midiApi}/>
  }, [setShowDeleteBoxes]);

  useEffect((): void => {
    if (doFetch === true) {
      setDoFetch(false);
      fetchFoods();
    }
  }, [doFetch]);

  const addFoodModal = <AddFoodModal setUpdate={setDoFetch} setShowAddModal={setShowAddModal} midiApi={midiApi} />

  return (
    <div className="App">
      <Header setShowAddModal={setShowAddModal} setShowEditModal={setShowEditModal} 
              setShowDeleteBoxes={setShowDeleteBoxes} showDeleteBoxes={showDeleteBoxes}
              foods={foods} setContent={setContent} setUpdate={setDoFetch}
              midiApi={midiApi} userApi={userApi}/>
      <main className="main">
        { content }
        { showAddModal ? addFoodModal : "" }
      </main>
    </div>
  );
}

export default App;
