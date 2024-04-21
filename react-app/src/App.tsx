import { Configuration as MidiConfiguration } from './generated/midi-api';
import { Configuration as UserConfiguration } from './generated/user-api';
import { Midis, MidiApi } from './generated/midi-api';
import { UserApi } from './generated/user-api';
import { useEffect, useState } from 'react';
import CreateMidiModal from './app/components/CreateMidiModal';
import Content from './app/components/Content';
import Header from './app/components/Header';
import './App.css';
import CreateUserModal from './app/components/CreateUserModal';
import LoginModal from './app/components/LoginModal';

function App() {
  const [content, setContent] = useState(<></>);
  const [doFetch, setDoFetch] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteBoxes, setShowDeleteBoxes] = useState<boolean>(false);
  const [midis, setMidis] = useState<Midis>({});
  const [token, setToken] = useState<string>("");

  const midiApi = new MidiApi(new MidiConfiguration({accessToken: token}));
  const userApi = new UserApi(new UserConfiguration({accessToken: token}));

  async function fetchMidis(): Promise<void> {
    try {
      const midiResponse = await midiApi.getPublicMidis();
      setMidis(midiResponse);
      setContent(<Content foods={midiResponse} showDeleteBox={showDeleteBoxes} setUpdate={setDoFetch} midiApi={midiApi} token={token}/>)
      setDoFetch(false);
    } catch (error) {
      console.error('Error fetching midis: ' + error);
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
      fetchMidis();
    }
  }, [doFetch]);

  const addFoodModal = <CreateMidiModal setUpdate={setDoFetch} setShowAddModal={setShowAddModal} midiApi={midiApi} token={token}/>
  const createUserModal = <CreateUserModal setUpdate={setDoFetch} setShowCreateUserModal={setShowCreateUserModal} userApi={userApi} setToken={setToken}/>
  const loginModal = <LoginModal setUpdate={setDoFetch} setShowLoginModal={setShowLoginModal} userApi={userApi} setToken={setToken}/>

  return (
    <div className="App">
      <Header setShowAddModal={setShowAddModal} setShowEditModal={setShowEditModal} 
              setShowDeleteBoxes={setShowDeleteBoxes} showDeleteBoxes={showDeleteBoxes}
              midis={midis} setContent={setContent} setUpdate={setDoFetch}
              midiApi={midiApi} userApi={userApi} token={token} setShowCreateUserModal={setShowCreateUserModal}
              setToken={setToken} setShowLoginModal={setShowLoginModal} />
      <main className="main">
        { content }
        { showAddModal ? addFoodModal : "" }
        { showLoginModal ? loginModal : "" }
        { showCreateUserModal ? createUserModal : "" }
      </main>
    </div>
  );
}

export default App;
