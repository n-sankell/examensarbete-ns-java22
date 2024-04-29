export const OCTAVE_START: number = -2;
export const OCTAVE_END: number = 8;
export const OCTAVE_STEPS: number = 12;
export const MIDI_START: number = 0;
export const MIDI_END: number = 127;

export type OctaveStartNote = {
    octave: number,
    startNote: number
}

export const octaves: OctaveStartNote[] = [
    {
        octave: OCTAVE_START,
        startNote: MIDI_START
    },
    {
        octave: OCTAVE_START + 1,
        startNote: OCTAVE_STEPS
    },
    {
        octave: OCTAVE_START + 2,
        startNote: OCTAVE_STEPS * 2
    },
    {
        octave: OCTAVE_START + 3,
        startNote: OCTAVE_STEPS * 3
    },
    {
        octave: OCTAVE_START + 4,
        startNote: OCTAVE_STEPS * 4
    },
    {
        octave: OCTAVE_START + 5,
        startNote: OCTAVE_STEPS * 5
    },
    {
        octave: OCTAVE_START + 6,
        startNote: OCTAVE_STEPS * 6
    },
    {
        octave: OCTAVE_START + 7,
        startNote: OCTAVE_STEPS * 7
    },
    {
        octave: OCTAVE_START + 8,
        startNote: OCTAVE_STEPS * 8
    },
    {
        octave: OCTAVE_START + 9,
        startNote: OCTAVE_STEPS * 9
    },
    {
        octave: OCTAVE_START + 10,
        startNote: OCTAVE_STEPS * 10
    }
]
