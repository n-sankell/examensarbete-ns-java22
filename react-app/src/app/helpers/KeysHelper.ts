import { NoteType } from "../types/NoteType";
import { Key } from "../types/Key";
import { OctaveStartNote, octaves } from "./OctaveHelper";
import { notes } from "./NotesHelper";

const generateFullKeys = (): Key[] => {
    const keys: Key[] = [];

    octaves.forEach((octave: OctaveStartNote, index: number) => {
        let currentNote = octave.startNote;
        let keyIndex = octave.startNote + index * 2;
        notes.forEach((note: NoteType) => {
            keys.push( {
                index: keyIndex,
                midi: currentNote,
                name: note.name + octave.octave,
                note: note.name,
                isNatural: note.isNatural
            } );
            keyIndex++;
            if (note.name === 'B' || note.name === 'E') {
                keys.push( {
                    index: keyIndex,
                    midi: 0,
                    name: "ghostnote",
                    note: "ghostnote",
                    isNatural: false
                } );
                keyIndex++;
            }
            currentNote++;
        })
    });
    
    return keys;
}

export const keys: Key[] = generateFullKeys();