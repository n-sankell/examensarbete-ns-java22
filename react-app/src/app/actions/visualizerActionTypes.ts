export const SET_CURRENT_TRACK = 'SET_CURRENT_TRACK';
export const PLAY_MIDI = 'PLAY_MIDI';
export const PAUSE_MIDI = 'PAUSE_MIDI';

interface SetCurrentTrackAction {
    type: typeof SET_CURRENT_TRACK;
    payload: number;
}
interface PlayMidiAction {
    type: typeof PLAY_MIDI;
}
interface PauseMidiAction {
    type: typeof PAUSE_MIDI;
}


export type VisualizerAction = 
    | SetCurrentTrackAction
    | PlayMidiAction
    | PauseMidiAction;

export interface VisualizerState {
    currentTrack: number;
    midiIsPlaying: boolean;
}