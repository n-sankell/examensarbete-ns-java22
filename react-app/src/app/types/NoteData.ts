import { NoteJSON } from "@tonejs/midi/dist/Note";

export type NoteData = {
    note: NoteJSON;
    rect: d3.Selection<SVGRectElement, NoteJSON, HTMLElement, any>;
    initialX: number;
}