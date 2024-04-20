import { useEffect, useState } from 'react';
import { Midi, Midis, MidiApi, Configuration } from './generated/midi-api';
import Content from './app/components/Content';
import Header from './app/components/Header';
import './App.css';
import AddFoodModal from './app/components/AddFoodModal';
import { UserApi } from './generated/user-api';

function App() {
  const [content, setContent] = useState(<></>);
  const [doFetch, setDoFetch] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteBoxes, setShowDeleteBoxes] = useState<boolean>(false);
  const [midis, setMidis] = useState<Midis>({});
  const [token, setToken] = useState<string>("");

  const midiApi = new MidiApi(new Configuration({accessToken: token}));
  const userApi = new UserApi();

  async function fetchFoods(): Promise<void> {
    try {
      login();
      const midiResponse = await midiApi.getPublicMidis();
      setMidis(midiResponse);
      setContent(<Content foods={midiResponse} showDeleteBox={showDeleteBoxes} setUpdate={setDoFetch} midiApi={midiApi} token={token}/>)
      setDoFetch(false);
    } catch (error) {
      console.error('Error fetching foods: ' + error);
    }
  };

  async function login(): Promise<void> {
    try {
      const request = { userLoginRequest: {userIdentifier: "niklas", password: "niklasniklas"} };
      const loginResponse = await userApi.loginRaw(request);
      const rawToken = loginResponse.raw.headers.get("Authorization");
      const token = rawToken == null ? "" : rawToken.replace("Bearer ", "");
      console.log("Token: " + token);
      setToken(token);
    } catch (error) {
      console.error('Login failed: ' + error);
    }
  };
  
  useEffect((): void => {
  }, [content]);

  useEffect((): void => {
    <Content foods={midis} showDeleteBox={showDeleteBoxes} setUpdate={setDoFetch} midiApi={midiApi} token={token}/>
  }, [setShowDeleteBoxes]);

  useEffect((): void => {
    if (doFetch === true) {
      setDoFetch(false);
      fetchFoods();
    }
  }, [doFetch]);

  const addFoodModal = <AddFoodModal setUpdate={setDoFetch} setShowAddModal={setShowAddModal} midiApi={midiApi} token={token}/>

  return (
    <div className="App">
      <Header setShowAddModal={setShowAddModal} setShowEditModal={setShowEditModal} 
              setShowDeleteBoxes={setShowDeleteBoxes} showDeleteBoxes={showDeleteBoxes}
              foods={midis} setContent={setContent} setUpdate={setDoFetch}
              midiApi={midiApi} userApi={userApi} token={token}/>
      <main className="main">
        { content }
        { showAddModal ? addFoodModal : "" }
      </main>
    </div>
  );
}

export default App;
