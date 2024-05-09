import { fetchPublicMidis, fetchUserMidis } from './app/actions/midiActions';
import { ThunkDispatch, bindActionCreators } from '@reduxjs/toolkit';
import { Midis, MidiWithData } from './generated/midi-api';
import CreateMidiModal from './app/components/modals/CreateMidiModal';
import CreateUserModal from './app/components/modals/CreateUserModal';
import MidiList from './app/components/modals/MidiList';
import LoginModal from './app/components/modals/LoginModal';
import Header from './app/components/header/Header';
import { RootState } from './app/store';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import MidiVisualizer from './app/components/visualizer/MidiVisualizer';
import EditUserModal from './app/components/modals/EditUserModal';
import './App.css';
import EditMidiModal from './app/components/modals/EditMidiModal';

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
  showEditUserModal: boolean;
  showUserMidis: boolean;
  showPublicMidis: boolean;
  showEditMidiModal: boolean;
  doFetch: boolean
}
interface AppProps extends StateProps, DispatchProps {}

const App: React.FC<AppProps> = ({ fetchPublicMidis, fetchUserMidis, loggedIn, userMidis, publicMidis, doFetch, showEditMidiModal, 
  showLoginModal, showCreateUserModal, showCreateMidiModal, activeMidi, showUserMidis, showPublicMidis, showEditUserModal }) => {

  useEffect((): void => {
    fetchPublicMidis();
  }, []);

  useEffect((): void => {
  }, [publicMidis, activeMidi, userMidis]);

  useEffect(() => {
    if (loggedIn === true) {
      fetchUserMidis();
    }
    fetchPublicMidis();
  }, [loggedIn, doFetch]);

  return (
    <div className="App">
      <Header />
      <div className='main-wrapper'>
        <main className="main">
          <MidiVisualizer />
          { showCreateMidiModal ? <CreateMidiModal /> : "" }
          { showEditMidiModal ? <EditMidiModal /> : "" }
          { showLoginModal ? <LoginModal /> : "" }
          { showCreateUserModal ? <CreateUserModal /> : "" }
          { showEditUserModal ? <EditUserModal /> : "" }
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
  showEditUserModal: state.display.showEditUserModal,
  showCreateMidiModal: state.display.showCreateMidiModal,
  showEditMidiModal: state.display.showEditMidiModal,
  showPublicMidis: state.display.showPublicMidis,
  showUserMidis: state.display.showUserMidis,
  doFetch: state.midi.doFetchMidis,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
  fetchUserMidis: bindActionCreators(fetchUserMidis, dispatch),
  fetchPublicMidis: bindActionCreators(fetchPublicMidis, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
