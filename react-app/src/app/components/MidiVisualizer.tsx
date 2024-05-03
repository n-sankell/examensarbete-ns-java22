import { useEffect } from 'react';
import * as d3 from 'd3';
import { select } from 'd3';
import * as Tone from 'tone';
import { MidiJSON, TrackJSON } from '@tonejs/midi';
import Piano from './Piano/Piano';
import { connect as reduxConnect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { setKeyPressed, setKeyReleased } from '../actions/pianoActions';
import { RootState } from '../store';
import { MidiWrapper } from '../types/MidiWrapper';
import { NoteJSON } from '@tonejs/midi/dist/Note';
import { TempoEvent } from '@tonejs/midi/dist/Header';
import './MidiVisualizer.css';

interface NoteData {
    note: NoteJSON;
    rect: d3.Selection<SVGRectElement, NoteJSON, HTMLElement, any>;
    initialX: number;
}
const svgWidth = 1300;
const svgHeight = 1000;

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
}
interface VisualizerDispatchProps {
    keyPress: (noteNumber: number) => void;
    keyRelease: (noteNumber: number) => void;
}
interface VisualizerProps extends VisualizerDispatchProps, VisualizerStateProps {}

const MidiVisualizer: React.FC<VisualizerProps> = ( { keyPress, keyRelease, parsedMidi } ) => {

    useEffect(() => {
        d3.select('#midi-visualization').selectAll('*').remove();
        const fetchAndVisualizeData = async () => {
        try {
            const synths: any[] = [];

            const svg = d3.select('#midi-visualization')
                .append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .style('border', '1px solid black');

            const scrollContainer = svg.append('g')
                .attr('transform', 'translate(0, 0)')
                .attr('width', svgWidth)
                .attr('height', svgHeight);

            const initialXScroll = -svgWidth;
            const initialYScroll = -svgHeight / 2;
            const maxXScroll = -svgWidth * 2;
            const maxYScroll = -svgHeight * 2;
            const scaleFlip = `scale(-1, 1)`
            let noteData: NoteData[];
            let isPlaying = false;

            const createStaticTimeline = (midiData: MidiJSON) => {
                noteData = midiData.tracks[0].notes.map((note: NoteJSON, index: number) => {
                    const dur = note.duration === 0 ? 0.1 : note.duration;
                    const rect = scrollContainer.append('rect')
                        .attr('height', dur * 750)
                        .attr('width', 10)
                        .attr('fill', note.name.length === 3 ? 'lightblue' : 'blue')
                        .attr('y', note.ticks)
                        .attr('x', note.midi * 10)
                        .on('mouseover', function (event) {
                            d3.select(this)
                                .attr('fill', note.name.length === 3 ? 'lightyellow' : 'yellow')
                                .append('title')
                                .text(index + " - " + note.name);
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
            
                scrollContainer.attr('transform', `translate(${initialXScroll}, ${initialYScroll}) rotate(180 ${svgWidth / 2} ${svgHeight / 2}) ${scaleFlip}`);
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
                    scrollContainer.attr('transform', `translate(${currentXScroll}, ${newScrollY}) rotate(180 ${svgWidth / 2} ${svgHeight / 2}) ${scaleFlip}`);
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
                    scrollContainer.attr('transform', `translate(${newScrollX}, ${newScrollY}) rotate(180 ${svgWidth / 2} ${svgHeight / 2}) ${scaleFlip}`);
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
                    if (!isPlaying) {
                    Tone.Transport.start();
                    await Tone.Transport.cancel(0);
                    loopIntervalId = setInterval(() => {
                        updateNotePositions();
                    }, 1000 / 16);
                    
                    await Tone.start().then(() => {
                        const playing = e.detail;
                        if (playing && parsedMidi.midi !== null) {
                            const now = Tone.now() + 0.5;
                            const displayOffset = now - 6;
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
                                Tone.Transport.schedule(() => keyPress(note.midi), note.time + now);
                                synth.triggerRelease(note.name, note.time + now + dur);
                                Tone.Transport.schedule(() => keyRelease(note.midi), note.time + now + dur);
                            });
                        });
                        } else {
                            while (synths.length) {
                                const synth = synths.shift();
                                synth.disconnect();
                            }
                        }
                        isPlaying = true;
                    });
                } else {
                    Tone.Transport.pause();
                    if (loopIntervalId) {
                        clearInterval(loopIntervalId);
                      }
                    isPlaying = false;
                }
            });
            }

        } catch (error) {
            console.error('Error reading or parsing MIDI data:', error);
        }
        };

        fetchAndVisualizeData();
    
    }, [parsedMidi]);

    const readFile = (filePath: string): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onprogress = (event) => console.log('Reading progress:', event.loaded, 'bytes read');
                reader.onload = (event) => {
                if (event.target) {
                    resolve(event.target.result as ArrayBuffer);
                } else {
                    reject(new Error('FileReader event target is null'));
                }
            };

            reader.onerror = (error) => {
                reject(error);
            };
    
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch file. Status code: ${response.status}`);
                    }
                    return response.blob();
                })
            .then(blob => reader.readAsArrayBuffer(blob))
            .catch(error => reject(error));
        });
    };

return (<>
        <div className='viz-wrapper'>
            { parsedMidi.midi !== null ? <button id='startButton'>Start midi</button> : "" }
            <div id="midi-visualization">
            </div>
            <Piano />
        </div>
    </>);
};

const mapStateToProps = (state: RootState): VisualizerStateProps => ({
    parsedMidi: state.midi.parsedMidi,
});

const mapDispatchToProps = (dispatch: Dispatch): VisualizerDispatchProps => ({
    keyPress: bindActionCreators(setKeyPressed, dispatch),
    keyRelease: bindActionCreators(setKeyReleased, dispatch),
});

export default reduxConnect(mapStateToProps, mapDispatchToProps)(MidiVisualizer);
