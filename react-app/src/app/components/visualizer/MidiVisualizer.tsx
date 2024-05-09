import * as Tone from 'tone';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { select } from 'd3';
import { MidiJSON, TrackJSON } from '@tonejs/midi';
import { connect as reduxConnect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { MidiWrapper } from '../../types/MidiWrapper';
import { NoteJSON } from '@tonejs/midi/dist/Note';
import { TempoEvent } from '@tonejs/midi/dist/Header';
import { pauseMidi, playMidi, setCurrentTrack } from '../../actions/visualizerActions';
import useWindowSize, { WindowSize } from '../../util/WindowSize';
import { Key } from '../../types/Key';
import { keys } from '../../helpers/KeysHelper';
import { playNote, releaseNote } from '../../synths/InteractiveSynth';
import { debounce } from '../../util/Debouncer';
import { NoteData } from '../../types/NoteData';
import { KeyData } from '../../types/KeyData';
import './MidiVisualizer.css';
import { noteOffsetPosition, noteWidth } from '../../helpers/NotesPositionHelper';

interface VisualizerStateProps {
    parsedMidi: MidiWrapper;
    midiIsPlaying: boolean;
    currentTrack: number;
}
interface VisualizerDispatchProps {
    playMidi: () => void;
    pauseMidi: () => void;
    setCurrentTrack: (track: number) => void;
}
interface VisualizerProps extends VisualizerDispatchProps, VisualizerStateProps {}

const MidiVisualizer: React.FC<VisualizerProps> = ( { parsedMidi, midiIsPlaying, playMidi, pauseMidi, currentTrack, setCurrentTrack } ) => {

    const windowSize: WindowSize = useWindowSize();
    const svgWidth = windowSize.width - 4;
    const svgHeight = windowSize.height - 64;
    const scrollHeight = svgHeight - 200;
    const minXScroll = svgWidth / 2 - svgWidth / 8;
    const maxXScroll = -svgWidth + -svgWidth / 2;
    let noteAmount = 2;
    let maxYScroll = -svgWidth * noteAmount;
    let transportPosition = 0;
    let part: Tone.Part | null = null;
    let loopIntervalId: any | null = null;
    let isPlaying = false;
    let mouseDown = false;
    let noteData: NoteData[] = [];
    let keyData: KeyData[];
    let initialXScroll = -svgWidth + svgWidth / 3;
    let initialYScroll = scrollHeight / 2;
    const synthsRef = useRef<any[]>([]);

    const updateNotePositions = () => {
        const activeNotes: string[] = [];
        const currentTime = Tone.Transport.seconds * 500;

        setTimeout(() => {
            if (isPlaying === true) {
                noteData.forEach(({ note, initialX, rect }) => {
                    if (note && typeof note.ticks !== 'undefined' && parsedMidi.midi !== null) {
                        let noteStartTime = 0;
                        let beatsPerMinute = 110;
          
                        parsedMidi.midi.header.tempos.forEach((tempoEvent: TempoEvent) => {
                            if (tempoEvent.ticks <= note.ticks && parsedMidi.midi !== null) {
                                beatsPerMinute = tempoEvent.bpm;
                                noteStartTime =
                                (note.ticks / parsedMidi.midi.header.ppq) * (60 / beatsPerMinute) * 500; 
                            }
                        });
          
                        const yPosition = Math.max(noteStartTime - currentTime, maxYScroll * 10);
                        if (isNaN(yPosition)) {
                            console.error('NaN yPosition:', { note, currentTime, noteStartTime, initialYScroll });
                        }
          
                        rect.attr('y', yPosition).attr('x', initialX);
                    
                        if (yPosition < -200 && yPosition > -200 - note.duration * 350) {
                            activeNotes.push(note.name);
                        }
                    }
                });

                keyData.forEach((key: KeyData) => { 
                    if (activeNotes.includes(key.key.name) || key.isPlaying === true) {
                        key.pianoKey.attr('fill', key.key.isNatural ? 'red' : 'orange');
                    } else {
                        key.pianoKey.attr('fill', key.key.isNatural ? 'ghostwhite' : 'darkslategray');
                    }
                });
            }
            requestAnimationFrame(debouncedUpdate);
        }, 1); 
    }

    const debouncedUpdate = debounce(updateNotePositions, 1);

    const startPlayback = async () => {
        if (!isPlaying) {
            Tone.Transport.start();

            isPlaying = true;
            playMidi();

            loopIntervalId = setInterval(() => {
                updateNotePositions();
            }, 1000 / 16);

            await Tone.start().then(() => {
                if (parsedMidi.midi !== null) {
                    parsedMidi.midi.tracks.forEach((track: TrackJSON, index: number) => {
                        synthsRef.current.push(new Tone.PolySynth().toDestination());
                        const synth = synthsRef.current[index];
                        part = new Tone.Part((time, event) => {
                            time = transportPosition === 0 ? time + 0.5 : time;
                            const { note, velocity, duration } = event;
                            synth.triggerAttackRelease(note, duration, time, velocity);
                        }, track.notes.map((note: NoteJSON) => ({
                            time: `+${note.time}`,
                            duration: note.duration,
                            note: note.name,
                            velocity: note.velocity || 0.8
                        }))).start(0, transportPosition);
                    });
                }
            });
        }
    };

    const pausePlayback = () => {
        Tone.Transport.pause();

        transportPosition = Tone.Transport.seconds;

        Tone.Transport.clear(0);

        while (synthsRef.current.length) {
            const synth = synthsRef.current.shift();
            synth.releaseAll();
            synth.disconnect();
        }

        isPlaying = false;
        pauseMidi();
    }

    const playButtonClick = async () => {
        if (!isPlaying) {
            startPlayback();
        } else {
            pausePlayback();
        }
    }

    const visualizeData = async () => {
        const svg = d3.select('#midi-visualization')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .style('border', '2px solid darkgray')
            .style('overflow', 'hidden')
            .on("mouseover", function() {
                d3.select(this)
                    .style("cursor", "grab"); 
            });
        const scrollContainer = svg.append('g')
            .attr('transform', 'translate(0, 0)')
            .attr('width', svgWidth)
            .attr('height', scrollHeight);
        const keyboardContainer = svg.append('g')
            .attr('transform', 'translate(0, 0)')
            .attr('width', svgWidth)
            .attr('height', 200);

        const createKeyboard = (initialX: number): void => {
            keyData = keys.filter((filter: Key ) => filter.name !== 'ghostnote' ).map((key: Key) => {
                let isPlaying: boolean = false;
                const xPosition = key.isNatural ? 25 : 25;
                const pianoKey = keyboardContainer.append('rect')
                    .attr('height', key.isNatural ? 200 : 130)
                    .attr('width', key.isNatural ? 50 : 25)
                    .attr('fill', isPlaying ? key.isNatural ? 'red' : 'orange' : key.isNatural ? 'ghostwhite' : 'darkslategray')
                    .attr('y', key.isNatural ? 0 : 0 + 70)
                    .attr('x', key.isNatural ? key.index * xPosition - 350 : key.index * xPosition - 350 + 12)
                    .attr('ry', "4")
                    .attr('stroke', "darkslategray")
                    .on('mouseenter', function () {
                        d3.select(this)
                            .style('cursor', 'pointer')
                            .attr('fill', key.isNatural ? 'gray' : 'darkgray')
                            .append('title')
                            .text(key.name);
                        if (mouseDown === true) {
                            isPlaying = true;
                            d3.select(this)
                                .attr('fill', key.isNatural ? 'red' : 'orange')
                                .style('cursor', 'grab');
                            playNote(key.name);
                        }
                    })
                    .on('mouseout', function () {
                        isPlaying = false;
                        d3.select(this)
                            .attr('fill', key.isNatural ? 'ghostwhite' : 'darkslategray')
                            .select('title').remove();
                        releaseNote(key.name);
                    })
                    .on('mousedown', function () {
                        isPlaying = true;
                        d3.select(this)
                            .attr('fill', key.isNatural ? 'red' : 'orange')
                            .style('cursor', 'grab');
                            mouseDown = true;
                        playNote(key.name);
                    })
                    .on('mouseup', function () {
                        isPlaying = false;
                        d3.select(this)
                            .attr('fill', key.isNatural ? 'ghostwhite' : 'darkslategray')
                            .style('cursor', 'pointer');
                        releaseNote(key.name);
                        mouseDown = false;
                    }) as d3.Selection<SVGRectElement, Key, HTMLElement, any>;

                if (key.isNatural) {
                    pianoKey.lower();
                }
                
                keyboardContainer.attr('transform', `translate(${initialX}, ${0})`);

                return {
                    key,
                    pianoKey,
                    isPlaying,
                };
            });
        };
    
        const createStaticTimeline = (midiData: MidiJSON) => {
            const indexes: number[] = keys.map((key: Key) => key.midi);
            const notes = midiData.tracks[currentTrack].notes;
            let minX = -1;
            let maxX = -1;
            if (notes.length > 0) {
                minX = indexes.indexOf(notes[0].midi) * 25;
                maxX = indexes.indexOf(notes[0].midi) * 25;
            }
            noteData = notes.map((note: NoteJSON) => {
                const dur = note.duration === 0 ? 0.1 : note.duration;
                const xOffset = noteOffsetPosition(note.name);
                const width = noteWidth(note.name);
                const xPos = indexes.indexOf(note.midi) * 25 + xOffset;
                console.log(xOffset);
                console.log(width);
                const rect = scrollContainer.append('rect')
                    .attr('height', dur * 350)
                    .attr('width', width)
                    .attr('fill', note.name.length === 3 ? 'orange' : 'red')
                    .attr('y', note.ticks / 2)
                    .attr('x', xPos)
                    .attr('ry', "4")
                    .attr('stroke', "darkslategray")
                    .on('mouseover', function () {
                        d3.select(this)
                            .attr('fill', note.name.length === 3 ? 'lightyellow' : 'yellow')
                            .append('title')
                            .text(note.name)
                            .style('cursor', 'pointer');
                    })
                    .on('mousedown', function () {
                        playNote(note.name);
                        d3.select(this)
                            .style('cursor', 'grab');
                    })
                    .on('mouseout', function () {
                        releaseNote(note.name);
                        d3.select(this)
                            .attr('fill', note.name.length === 3 ? 'orange' : 'red')
                            .select('title').remove();
        
                    }) as d3.Selection<SVGRectElement, NoteJSON, HTMLElement, any>;
                rect.lower();
                const initialX = xPos;
                if (xPos < minX) {
                    minX = xPos;
                }
                if (xPos > maxX) {
                    maxX = xPos;
                }
        
                return {
                    note,
                    rect,
                    initialX,
                };
            });
            if (minX > -1 && maxX > -1) {
                const xDifferance = maxX / 2 + minX / 2;
                scrollX = xDifferance / 2 -svgWidth;
            }
        
            scrollContainer.attr('transform', `translate(${initialXScroll}, ${initialYScroll})`);
        };

        if (parsedMidi.midi !== null) {
            noteAmount = parsedMidi.midi.tracks[currentTrack].notes.length;
            createStaticTimeline(parsedMidi.midi);
        }
        createKeyboard(initialXScroll);

        maxYScroll = -svgWidth * noteAmount;

        svg.on('wheel', (event) => {
            let delta = event.deltaY;
            if (isPlaying === true && delta !== 0) {
                pausePlayback();
            }
            if (event.deltaMode === 1) {
                delta = delta * 20;
            } else if (event.deltaMode === 2) {
                delta = delta * 400;
            }
        
            const transformAttr = scrollContainer.attr('transform');
        
            if (transformAttr) {
                const matchTransform = transformAttr.match(/translate\((.*?),(.*?)\)/);
                const currentXScroll = +((matchTransform && matchTransform[1]) || initialXScroll);
                const currentYScroll = +((matchTransform && matchTransform[2]) || initialYScroll);
                const newScrollY = Math.max(currentYScroll + delta, maxYScroll);
                scrollContainer.attr('transform', `translate(${currentXScroll}, ${newScrollY})`);
            }
        });

        const keyboardScrollHandler = (event : any) => {
            event.preventDefault();
            if (event.deltaX !== 0) {
                const transformAttr = keyboardContainer.attr('transform');
        
                if (transformAttr) {
                    const matchTransform = transformAttr.match(/translate\((.*?),(.*?)\)/);
                    let currentXScroll = +((matchTransform && matchTransform[1]) || initialXScroll);
                    let currentYScroll = +((matchTransform && matchTransform[2]) || initialYScroll);
                    let newScrollX = Math.max(currentXScroll - event.deltaX, maxXScroll);
                    newScrollX = Math.min(minXScroll, newScrollX);
                    
                    scrollContainer.attr('transform', `translate(${newScrollX}, ${currentYScroll + scrollHeight / 2})`);
                    keyboardContainer.attr('transform', `translate(${newScrollX}, ${0})`);
                }
            }
        };
        
        keyboardContainer.on('wheel', keyboardScrollHandler);

        const dragHandler: any = d3.drag()
        .on('start', function (event) {
            select(this).attr('data-start-x', event.x);
            select(this).attr('data-start-y', event.y);
            if (isPlaying === true) {
                pausePlayback();
            }
        })
        .on('drag', function (event) {
            const deltaX = event.x - +d3.select(this).attr('data-start-x');
            const deltaY = event.y - +d3.select(this).attr('data-start-y');
    
            const transformAttr = scrollContainer.attr('transform');
    
            if (transformAttr) {
                const matchTransform = transformAttr.match(/translate\((.*?),(.*?)\)/);
                const currentXScroll = +((matchTransform && matchTransform[1]) || initialXScroll);
                const currentYScroll = +((matchTransform && matchTransform[2]) || initialYScroll);
                let newScrollX = Math.max(currentXScroll + deltaX, maxXScroll);
                newScrollX = Math.min(minXScroll, newScrollX);
                const newScrollY = Math.max(currentYScroll + deltaY, maxYScroll);
                
                scrollContainer.attr('transform', `translate(${newScrollX}, ${newScrollY})`);
                keyboardContainer.attr('transform', `translate(${newScrollX}, ${0})`);
    
                select(this).attr('data-start-x', event.x);
                select(this).attr('data-start-y', event.y);
            }
        });

        scrollContainer.call(dragHandler);

        const startButton = document.getElementById("startButton");

        if (startButton) {
            startButton.addEventListener('click', playButtonClick );
        }
    };

    const cleanup = () => {
        d3.select('#midi-visualization').selectAll('*').remove();
        pauseMidi();

        Tone.Transport.stop();
        Tone.Transport.clear(0);
        Tone.Transport.position = 0;
        Tone.Transport.seconds = 0;
        Tone.Transport.ticks = 0;
        while (synthsRef.current.length) {
            const synth = synthsRef.current.shift();
            synth.releaseAll();
            synth.disconnect();
        }
        transportPosition = 0;
        isPlaying = false;
    }

    useEffect(() => {
        cleanup();
        visualizeData();
        return () => { 
            startPlayback(); 
        }
    }, [parsedMidi]);

return (<>
        <div className='viz-wrapper'>
            <div id="midi-visualization">
            </div>
        </div>
    </>);
};

const mapStateToProps = (state: RootState): VisualizerStateProps => ({
    parsedMidi: state.midi.parsedMidi,
    midiIsPlaying: state.visualizer.midiIsPlaying,
    currentTrack: state.visualizer.currentTrack,
});

const mapDispatchToProps = (dispatch: Dispatch): VisualizerDispatchProps => ({
    playMidi: bindActionCreators(playMidi, dispatch),
    pauseMidi: bindActionCreators(pauseMidi, dispatch),
    setCurrentTrack: bindActionCreators(setCurrentTrack, dispatch),
});

export default reduxConnect(mapStateToProps, mapDispatchToProps)(MidiVisualizer);
