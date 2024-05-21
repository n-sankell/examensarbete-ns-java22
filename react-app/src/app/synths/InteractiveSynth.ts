import * as Tone from 'tone';

const polySynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: "amsawtooth"
  },
  envelope: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.3,
    release: 1,
  },
}).toDestination();

const activeNotes = new Set<string>();

export const playNote = (note: string) => {
  if (!activeNotes.has(note)) {
    activeNotes.add(note);
    polySynth.triggerAttack(note);
  }
};

export const releaseNote = (note: string) => {
  if (activeNotes.has(note)) {
    polySynth.triggerRelease(note);
    activeNotes.delete(note);
  }
};
