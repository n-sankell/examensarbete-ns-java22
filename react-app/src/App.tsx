import { Configuration as MidiConfiguration } from './generated/midi-api';
import { User, Configuration as UserConfiguration } from './generated/user-api';
import { Midis, MidiApi, MidiWithData } from './generated/midi-api';
import { UserApi } from './generated/user-api';
import { useEffect, useState } from 'react';
import CreateMidiModal from './app/components/CreateMidiModal';
import PublicMidis from './app/components/PublicMidis';
import Header from './app/components/Header';
import CreateUserModal from './app/components/CreateUserModal';
import LoginModal from './app/components/LoginModal';
import './App.css';

function App() {
  const [content, setContent] = useState(<></>);
  const [doFetch, setDoFetch] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [midis, setMidis] = useState<Midis>({});
  const [userMidis, setUserMidis] = useState<Midis>({});
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [activeMidi, setActiveMidi] = useState<MidiWithData>({});

  const midiApi = new MidiApi(new MidiConfiguration({accessToken: token}));
  const userApi = new UserApi(new UserConfiguration({accessToken: token}));

  async function fetchMidis(): Promise<void> {
    try {
      const midiResponse = await midiApi.getPublicMidis();
      setMidis(midiResponse);
      setContent(<PublicMidis midis={midiResponse} setUpdate={setDoFetch} midiApi={midiApi} token={token} 
        setActiveMidi={setActiveMidi} activeMidi={activeMidi} />)
      setDoFetch(false);
    } catch (error) {
      console.error('Error fetching midis: ' + error);
    }
  };

  async function fetchUserMidis(): Promise<void> {
    try {
      const midiResponse = await midiApi.getUserMidis();
      setUserMidis(midiResponse);
      setContent(<PublicMidis midis={midis} setUpdate={setDoFetch} midiApi={midiApi} token={token} 
        setActiveMidi={setActiveMidi} activeMidi={activeMidi} />)
      setDoFetch(false);
    } catch (error) {
      console.error('Error fetching user midis: ' + error);
    }
  };

  useEffect((): void => {
    if (loggedIn === true) {
      fetchUserMidis();
    } else {
      setUser(undefined);
      setUserMidis({});
      setToken("");
    }
    setDoFetch(true);
  }, [loggedIn]);

  useEffect((): void => {
  }, [content]);

  useEffect((): void => {
    console.log("Active midi: " + activeMidi.binary?.midiFile);
    setContent(<PublicMidis midis={midis} setUpdate={setDoFetch} midiApi={midiApi} token={token} 
      setActiveMidi={setActiveMidi} activeMidi={activeMidi} />)
  }, [activeMidi]);

  useEffect((): void => {
    if (doFetch === true) {
      setDoFetch(false);
      fetchMidis();
    }
  }, [doFetch]);

  const addFoodModal = <CreateMidiModal setUpdate={setDoFetch} setShowAddModal={setShowAddModal} midiApi={midiApi} token={token} />
  const createUserModal = 
  <CreateUserModal setUpdate={setDoFetch} setShowCreateUserModal={setShowCreateUserModal} userApi={userApi} 
                  setToken={setToken} setLoggedIn={setLoggedIn} />
  const loginModal = 
    <LoginModal setUpdate={setDoFetch} setShowLoginModal={setShowLoginModal} userApi={userApi} 
                setToken={setToken} setLoggedIn={setLoggedIn} setUser={setUser} />

  return (
    <div className="App">
      <Header setShowAddModal={setShowAddModal} setShowEditModal={setShowEditModal} setUserMidis={setUserMidis}
              setActiveMidi={setActiveMidi} midis={midis} userMidis={userMidis} setContent={setContent} setUpdate={setDoFetch} 
              midiApi={midiApi} userApi={userApi} token={token} setShowCreateUserModal={setShowCreateUserModal} user={user}
              setToken={setToken} setShowLoginModal={setShowLoginModal} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
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
