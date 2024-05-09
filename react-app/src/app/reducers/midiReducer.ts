import { MidiState, MidiAction, FETCH_USER_MIDIS_REQUEST, FETCH_USER_MIDIS_SUCCESS, FETCH_USER_MIDIS_FAILURE,
    FETCH_PUBLIC_MIDIS_REQUEST, FETCH_PUBLIC_MIDIS_SUCCESS, FETCH_PUBLIC_MIDIS_FAILURE, FETCH_MIDI_DATA_SUCCESS, 
    FETCH_MIDI_DATA_FAILURE, DELETE_MIDI_REQUEST, DELETE_MIDI_SUCCESS, DELETE_MIDI_FAILURE, CREATE_MIDI_FAILURE,
    CREATE_MIDI_REQUEST, CREATE_MIDI_SUCCESS, PARSE_MIDI_REQUEST, PARSE_MIDI_FAILURE, PARSE_MIDI_SUCCESS, 
	EDIT_MIDI_FAILURE, EDIT_MIDI_SUCCESS, EDIT_MIDI_REQUEST} from '../actions/midiActionTypes';
import { defaultMidi } from '../types/MidiWrapper';

const initialState: MidiState = {
  	doFetchMidis: false,
  	loading: false,
  	publicMidis: null,
  	userMidis: null,
  	activeMidi: null,
  	error: null,
  	displayPublicMidiFetchError: false,
  	displayPrivateMidiFetchError: false,
  	displayCreateMidiError: false,
  	displayDeleteMidiError: false,
  	parsedMidi: defaultMidi,
};

const midiReducer = (state = initialState, action: MidiAction): MidiState => {
  	switch (action.type) {
    	case FETCH_PUBLIC_MIDIS_REQUEST:
    	case FETCH_USER_MIDIS_REQUEST:
    	case CREATE_MIDI_REQUEST:
    	case DELETE_MIDI_REQUEST:
		case EDIT_MIDI_REQUEST:
      		return {
        		...state,
        		doFetchMidis: false,
      	  		loading: true,
      		};
    	case FETCH_USER_MIDIS_SUCCESS:
      		return {
        		...state,
	        	doFetchMidis: false,
    	    	userMidis: action.payload,
        		loading: false,
      		};
    	case FETCH_PUBLIC_MIDIS_SUCCESS:
      		return {
		        ...state,
		        doFetchMidis: false,
        		publicMidis: action.payload,
        		loading: false,
      		};
    	case FETCH_USER_MIDIS_FAILURE:
    	case FETCH_PUBLIC_MIDIS_FAILURE:
    	case FETCH_MIDI_DATA_FAILURE:
    	case CREATE_MIDI_FAILURE:
    	case DELETE_MIDI_FAILURE:
		case EDIT_MIDI_FAILURE:
        	return {
            	...state,
        	    doFetchMidis: false,
            	loading: false,
            	error: action.payload,
        	};
	    case FETCH_MIDI_DATA_SUCCESS:
    	case CREATE_MIDI_SUCCESS:
		case EDIT_MIDI_SUCCESS:
        	return {
            	...state,
    	        doFetchMidis: true,
        	    loading: false,
            	activeMidi: action.payload,
        	};
    	case DELETE_MIDI_SUCCESS:
        	return {
    	        ...state,
    	        doFetchMidis: true,
				activeMidi: null,
    	        loading: false,
        	};
    	case PARSE_MIDI_REQUEST:
			return {
				...state,
			};
		case PARSE_MIDI_FAILURE:
			return {
				...state,
				error: action.payload,
			};
		case PARSE_MIDI_SUCCESS:
			return {
				...state,
				parsedMidi: action.payload,
			};
    	default:
    		return state;
  	}
};

export default midiReducer;