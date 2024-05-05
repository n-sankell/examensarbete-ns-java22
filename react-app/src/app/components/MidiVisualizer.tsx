import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { select } from 'd3';
import * as Tone from 'tone';
import { MidiJSON, TrackJSON } from '@tonejs/midi';
import { connect as reduxConnect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { MidiWrapper } from '../types/MidiWrapper';
import { NoteJSON } from '@tonejs/midi/dist/Note';
import { TempoEvent } from '@tonejs/midi/dist/Header';
import { pauseMidi, playMidi, setCurrentTrack } from '../actions/visualizerActions';
import useWindowSize, { WindowSize } from './WindowSize';
import { keys, Key } from './Piano/KeysHelper';
import './MidiVisualizer.css';
import { playNote, releaseNote } from './Piano/PianoSynth';

interface NoteData {
    note: NoteJSON;
    rect: d3.Selection<SVGRectElement, NoteJSON, HTMLElement, any>;
    initialX: number;
}

type DebouncedFunction<F extends (...args: any[]) => any> = (...args: Parameters<F>) => void;

function debounce<F extends (...args: any[]) => any>(func: F, delay: number): DebouncedFunction<F> {
    let timeoutId: ReturnType<typeof setTimeout>;

        return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
        const context = this;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(function () {
            func.apply(context, args);
        }, delay);
    };
}

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

    const keyboardRef = useRef<HTMLDivElement>(null);
    const windowSize: WindowSize = useWindowSize();
    const svgWidth = windowSize.width - 4;
    const svgHeight = windowSize.height - 64;

    useEffect(() => {
        d3.select('#midi-visualization').selectAll('*').remove();
        const visualizeData = async () => {
        try {
            const synths: any[] = [];

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
                .attr('height', svgHeight);

        
            const createKeyboard = (): void => {
                keys.forEach((key: Key) => {
                    const xPosition = key.isNatural ? 15 : 15;
                    const pianoKey = scrollContainer.append('rect')
                        .attr('height', key.isNatural ? 200 : 150)
                        .attr('width', key.isNatural ? 30 : 20)
                        .attr('fill', key.isNatural ? 'ghostwhite' : 'darkslategray')
                        .attr('y', key.isNatural ? 0 : 50)
                        .attr('x', key.midi * xPosition - svgWidth / 4)
                        .style('border', '2px solid darkgray')
                        .style('border-radius', '10 10 10 10')
                        .on('mouseenter', function () {
                            d3.select(this)
                                .attr('fill', key.isNatural ? 'gray' : 'darkgray')
                                .append('title')
                                .text(key.name)
                                .style('cursor', 'pointer');
                        })
                        .on('mouseout', function () {
                            d3.select(this)
                                .attr('fill', key.isNatural ? 'ghostwhite' : 'darkslategray')
                                .select('title').remove();
                            releaseNote(key.name);
                        })
                        .on('mousedown', function () {
                            d3.select(this)
                                .attr('fill', key.isNatural ? 'red' : 'orange');
                            playNote(key.name);
                        })
                        .on('mouseup', function () {
                            console.log("mouse up!");
                            d3.select(this)
                                .attr('fill', key.isNatural ? 'ghostwhite' : 'darkslategray');
                            releaseNote(key.name);
                        }) as d3.Selection<SVGRectElement, Key, HTMLElement, any>;
                });
            };
            createKeyboard();
        
            const initialXScroll = -svgWidth;
            const initialYScroll = svgHeight / 2;
            const maxXScroll = -svgWidth * 2;
            const maxYScroll = -svgHeight * 2;
            let noteData: NoteData[];
            //let isPlaying = false;

            const createStaticTimeline = (midiData: MidiJSON) => {
                noteData = midiData.tracks[currentTrack].notes.map((note: NoteJSON, index: number) => {
                    const dur = note.duration === 0 ? 0.1 : note.duration;
                    const rect = scrollContainer.append('rect')
                        .attr('height', dur * 750)
                        .attr('width', 10)
                        .attr('fill', note.name.length === 3 ? 'lightblue' : 'blue')
                        .attr('y', note.ticks)
                        .attr('x', note.midi * 10)
                        .on('mouseover', function () {
                            d3.select(this)
                                .attr('fill', note.name.length === 3 ? 'lightyellow' : 'yellow')
                                .append('title')
                                .text(note.name)
                                .style('cursor', 'pointer');
                        })
                        .on('mouseout', function () {
                            d3.select(this)
                                .attr('fill', note.name.length === 3 ? 'lightblue' : 'blue')
                                .select('title').remove();
            
                        }) as d3.Selection<SVGRectElement, NoteJSON, HTMLElement, any>;
                    const initialX = note.midi * 10;
            
                    return {
                        note,
                        rect,
                        initialX,
                    };
                });
            
                scrollContainer.attr('transform', `translate(${0}, ${initialYScroll})`);
            };
            if (parsedMidi.midi !== null) {
                createStaticTimeline(parsedMidi.midi);
            }

            svg.on('wheel', (event) => {
                let delta = event.deltaY;

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

            const dragHandler: any = d3.drag()
            .on('start', function (event) {
                select(this).attr('data-start-x', event.x);
                select(this).attr('data-start-y', event.y);
            })
            .on('drag', function (event) {
                const deltaX = event.x - +d3.select(this).attr('data-start-x');
                const deltaY = event.y - +d3.select(this).attr('data-start-y');

                const transformAttr = scrollContainer.attr('transform');
            
                if (transformAttr) {
                    const matchTransform = transformAttr.match(/translate\((.*?),(.*?)\)/);
                    const currentXScroll = +((matchTransform && matchTransform[1]) || initialXScroll);
                    const currentYScroll = +((matchTransform && matchTransform[2]) || initialYScroll);
                    const newScrollX = Math.max(currentXScroll + deltaX, maxXScroll);
                    const newScrollY = Math.max(currentYScroll + deltaY, maxYScroll);
                    scrollContainer.attr('transform', `translate(${newScrollX}, ${newScrollY})`);
                }
                select(this).attr('data-start-x', event.x);
                select(this).attr('data-start-y', event.y);
            });

            scrollContainer.call(dragHandler);
            const updateNotePositions = () => {
                
                const currentTime = Tone.Transport.seconds * 1000;
                setTimeout(() => {
                  noteData.forEach(({ note, initialX, rect }) => {
                    if (note && typeof note.ticks !== 'undefined' && parsedMidi.midi !== null) {
                        let noteStartTime = 0;
                        let beatsPerMinute = 120;
              
                        parsedMidi.midi.header.tempos.forEach((tempoEvent: TempoEvent) => {
                        if (tempoEvent.ticks <= note.ticks && parsedMidi.midi !== null) {
                                beatsPerMinute = tempoEvent.bpm;
                                noteStartTime =
                                (note.ticks / parsedMidi.midi.header.ppq) * (60 / beatsPerMinute) * 1000 -
                                svgHeight / 2 + 500; 
                            }
                        });
              
                        const yPosition = Math.max(noteStartTime - currentTime, maxYScroll * 10);
                        if (isNaN(yPosition)) {
                                console.error('NaN yPosition:', { note, currentTime, noteStartTime, initialYScroll });
                            }
              
                        rect.attr('y', yPosition).attr('x', initialX);
              
                    }
                });
                requestAnimationFrame(debouncedUpdate);
                }, 1);
            };

            const debouncedUpdate = debounce(updateNotePositions, 1);
            const startButton = document.getElementById("startButton");
            let loopIntervalId: any | null = null;
            if (startButton) {
                startButton.addEventListener('click', async (e) => {
                    if (!midiIsPlaying) {
                    Tone.Transport.start();
                    await Tone.Transport.cancel(0);
                    loopIntervalId = setInterval(() => {
                        updateNotePositions();
                    }, 1000 / 16);
                    
                    await Tone.start().then(() => {
                        const playing = e.detail;
                        if (playing && parsedMidi.midi !== null) {
                            const now = Tone.now() + 0.5;
                            parsedMidi.midi.tracks.forEach((track: TrackJSON) => {
                                const synth = new Tone.PolySynth(Tone.Synth, {
                                    envelope: {
                                        attack: 0.02,
                                        decay: 0.1,
                                        sustain: 0.3,
                                        release: 1,
                                    },
                                }).toDestination();
                            synths.push(synth);
                            track.notes.forEach((note: NoteJSON) => {
                                const dur = note.duration === 0 ? 0.1 : note.duration;
                                synth.triggerAttack(note.name, note.time + now, note.velocity);
                                synth.triggerRelease(note.name, note.time + now + dur);
                            });
                        });
                        } else {
                            while (synths.length) {
                                const synth = synths.shift();
                                synth.disconnect();
                            }
                        }
                        playMidi();
                    });
                } else {
                    Tone.Transport.pause();
                    if (loopIntervalId) {
                        clearInterval(loopIntervalId);
                      }
                    pauseMidi();
                }
            });
            }

        } catch (error) {
            console.error('Error reading or parsing MIDI data:', error);
        }
        };
        
        visualizeData();
    
    }, [parsedMidi]);

return (<>
        <div className='viz-wrapper'>
            <div id="midi-visualization">
            </div>
            {
                <div ref={keyboardRef}></div>
            }
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
