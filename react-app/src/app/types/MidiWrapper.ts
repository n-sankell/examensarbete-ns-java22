import { Midi } from "@tonejs/midi"

export type MidiWrapper = {
    midi: Midi;
}

export const defaultMidi: MidiWrapper = {
    midi: new Midi()
}