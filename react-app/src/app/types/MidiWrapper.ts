import { MidiJSON } from "@tonejs/midi"

export type MidiWrapper = {
    midi: MidiJSON | null;
}

export const defaultMidi: MidiWrapper = {
    midi: null
}