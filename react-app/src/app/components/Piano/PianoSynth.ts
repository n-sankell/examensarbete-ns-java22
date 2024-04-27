import * as Tone from 'tone';

const activeNotes: Record<number, any> = {};

export const playNote = (note: number) => {
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
  }).toDestination();;
    activeNotes[note].triggerAttack(note);
  }
};

export const releaseNote = (note: number) => {
  if (activeNotes[note]) {
    activeNotes[note].triggerRelease();
    delete activeNotes[note];
  }
};