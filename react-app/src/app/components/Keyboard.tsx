import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import useWindowSize from './WindowSize';

interface MidiKeyboardProps {
    forwardedRef: React.RefObject<HTMLElement>;
}

const MidiKeyboard: React.FC<MidiKeyboardProps> = ({ forwardedRef }) => {
    const keyboardRef = useRef<HTMLDivElement>(null);
    const windowWidth = useWindowSize().width;

    useEffect(() => {
        if (!keyboardRef.current) return;

        const svg = d3.select(keyboardRef.current);
        
        const keyWidth = 40;
        const keyHeight = 200;
        const naturalKeyWidth = keyWidth * 0.8;
        const naturalKeyHeight = keyHeight * 0.6;

        const MIDI_START = 0;
        const MIDI_END = 127;

        svg.selectAll('rect')
            .data([...Array(MIDI_END - MIDI_START + 1).keys()])
            .enter()
            .append('rect')
            .attr('x', (_, i) => i * keyWidth)
            .attr('y', (_, i) => (i % 12 >= 5 ? 0 : keyHeight * 0.4))
            .attr('width', (_, i) => (i % 12 >= 5 ? naturalKeyWidth : keyWidth))
            .attr('height', (_, i) => (i % 12 >= 5 ? naturalKeyHeight : keyHeight))
            .attr('fill', (_, i) => (i % 12 >= 5 ? 'white' : 'black'))
            .attr('stroke', 'black')
            .attr('stroke-width', '1');

        svg.attr('width', keyWidth * (MIDI_END - MIDI_START + 1))
            .attr('height', keyHeight);

    }, []);

    useEffect(() => {
        if (forwardedRef.current && keyboardRef.current) {
            forwardedRef.current.appendChild(keyboardRef.current);
        }
    }, [forwardedRef]);

    return (
        <div ref={keyboardRef} style={{ width: '100%', height: '100%' }}>
            {/* Content will be dynamically added here */}
        </div>
    );
};

export default MidiKeyboard;
