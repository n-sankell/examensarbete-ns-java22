import { NoteType, notes } from "./NoteType";
import { OctaveStartNote, octaves } from "./OctaveHelper";

export type Key = {
    midi: number,
    name: string,
    note: string,
    isNatural: boolean
}

const generateFullKeys = (): Key[] => {
    const keys: Key[] = [];

    octaves.forEach((octave: OctaveStartNote) => {
        let currentNote = octave.startNote;
        notes.forEach((note: NoteType) => {
            keys.push( {
                midi: currentNote,
                name: note.name + octave.octave,
                note: note.name,
                isNatural: note.isNatural
            } );
            currentNote++;
        })
    });
    
    return keys;
}

export const keys: Key[] = generateFullKeys();