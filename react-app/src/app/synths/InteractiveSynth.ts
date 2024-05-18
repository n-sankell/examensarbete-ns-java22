import * as Tone from 'tone';

const activeNotes: Record<string, Tone.Synth> = {};

export const playNote = (note: string) => {
  if (!activeNotes[note]) {
    activeNotes[note] = new Tone.Synth({
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
    activeNotes[note].triggerAttack(note);
  }
};

export const releaseNote = (note: string) => {
  if (activeNotes[note]) {
    activeNotes[note].triggerRelease();
    activeNotes[note].disconnect();
    delete activeNotes[note];
  }
};