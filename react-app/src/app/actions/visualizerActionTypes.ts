export const SET_CURRENT_TRACK = 'SET_CURRENT_TRACK';
export const PLAY_MIDI = 'PLAY_MIDI';
export const PAUSE_MIDI = 'PAUSE_MIDI';
export const SET_VOLUME = 'SET_VOLUME';

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

interface SetVolumeAction {
    type: typeof SET_VOLUME;
    payload: number;
}

export type VisualizerAction = 
    | SetCurrentTrackAction
    | PlayMidiAction
    | PauseMidiAction
    | SetVolumeAction;

export interface VisualizerState {
    currentTrack: number;
    midiIsPlaying: boolean;
    volume: number;
}