import { Key } from "./Key";

export type KeyData = {
    key: Key;
    pianoKey: d3.Selection<SVGRectElement, Key, HTMLElement, any>;
    isPlaying: boolean;
}