import { fetchPublicMidis, fetchUserMidis } from './app/actions/midiActions';
import { ThunkDispatch, bindActionCreators } from '@reduxjs/toolkit';
import { Midi, Midis, MidiWithData } from './generated/midi-api';
import CreateMidiModal from './app/components/modals/CreateMidiModal';
import CreateUserModal from './app/components/modals/CreateUserModal';
import MidiList from './app/components/MidiList';
import LoginModal from './app/components/modals/LoginModal';
import Header from './app/components/Header';
import { RootState } from './app/store';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import './App.css';
import Piano from './app/components/Piano/Piano';
import MidiVisualizer from './app/components/visualizer/MidiVisualizer';

interface DispatchProps {
  fetchPublicMidis: () => void;
  fetchUserMidis: () => void;
}
interface StateProps {
  loggedIn: boolean;
  userMidis: Midis | null;
  publicMidis: Midis | null;
  activeMidi: MidiWithData | null;
  showLoginModal: boolean;
  showCreateUserModal: boolean;
  showCreateMidiModal: boolean;
  showUserMidis: boolean;
  showPublicMidis: boolean;
  doFetch: boolean
}
interface AppProps extends StateProps, DispatchProps {}

const App: React.FC<AppProps> = ({ fetchPublicMidis, fetchUserMidis, loggedIn, userMidis, publicMidis, doFetch, 
  showLoginModal, showCreateUserModal, showCreateMidiModal, activeMidi, showUserMidis, showPublicMidis }) => {

  useEffect((): void => {
    fetchPublicMidis();
  }, []);

  useEffect((): void => {
  }, [publicMidis]);

  useEffect((): void => {
  }, [activeMidi]);

  useEffect(() => {
    if (loggedIn === true) {
      fetchUserMidis();
    }
    fetchPublicMidis();
  }, [loggedIn, doFetch]);

  useEffect(() => {
  }, [userMidis]);

  return (
    <div className="App">
      <Header />
      <div className='main-wrapper'>
        <main className="main">
          <MidiVisualizer />
          { showCreateMidiModal ? <CreateMidiModal /> : "" }
          { showLoginModal ? <LoginModal /> : "" }
          { showCreateUserModal ? <CreateUserModal /> : "" }
          { showUserMidis ? <MidiList privateFiles={ true } /> : "" }
          { showPublicMidis ? <MidiList privateFiles={ false } /> : "" }
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState): StateProps => ({
  loggedIn: state.user.loggedIn,
  publicMidis: state.midi.publicMidis,
  userMidis: state.midi.userMidis,
  activeMidi: state.midi.activeMidi,
  showLoginModal: state.display.showLoginModal,
  showCreateUserModal: state.display.showCreateUserModal,
  showCreateMidiModal: state.display.showCreateMidiModal,
  showPublicMidis: state.display.showPublicMidis,
  showUserMidis: state.display.showUserMidis,
  doFetch: state.midi.doFetchMidis,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
  fetchUserMidis: bindActionCreators(fetchUserMidis, dispatch),
  fetchPublicMidis: bindActionCreators(fetchPublicMidis, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
