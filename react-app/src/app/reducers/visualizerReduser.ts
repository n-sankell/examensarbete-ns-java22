import { PAUSE_MIDI, PLAY_MIDI, SET_CURRENT_TRACK, SET_VOLUME, VisualizerAction, VisualizerState } from "../actions/visualizerActionTypes";

const initialState: VisualizerState = {
    currentTrack: 0,
    midiIsPlaying: false,
    volume: -12,
};

const visualizerReducer = (state = initialState, action: VisualizerAction) => {
    switch(action.type) {
        case SET_CURRENT_TRACK:
            return {
                ...state,
                currentTrack: action.payload,
            }
        case PLAY_MIDI:
            return {
                ...state,
                midiIsPlaying: true,
            }
        case PAUSE_MIDI:
            return {
                ...state,
                midiIsPlaying: false,
            }
        case SET_VOLUME:
            return {
                ...state,
                volume: action.payload,
            }
        default:
            return state;
    }
}

export default visualizerReducer;