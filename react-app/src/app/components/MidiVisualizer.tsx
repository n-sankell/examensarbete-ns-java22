import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { select } from 'd3';
import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import './MidiVisualizer.css';
import Piano from './Piano/Piano';
import { connect as reduxConnect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { setKeyPressed, setKeyReleased } from '../actions/pianoActions';
import { RootState } from '../store';
import { MidiWithData } from '../../generated/midi-api';
import { MidiWrapper } from '../types/MidiWrapper';

interface MidiNote {
    name: string;
    midi: number;
    time: number;
    ticks: number;
    duration: number;
    velocity: number;
}

interface NoteData {
    note: MidiNote;
    rect: d3.Selection<SVGRectElement, MidiNote, HTMLElement, any>;
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
    const executedFlag = useRef<boolean>(false);
    useEffect(() => {
        if (executedFlag.current === false) { 
        const fetchAndVisualizeData = async () => {
        try {
            const filePath = 'Farmor-loop.mid';
            const tetris: string = "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";
            const midiData: ArrayBuffer = base64ToArrayBuffer(tetris);
            //const parsedMidi = new Midi(midiData);
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

            const createStaticTimeline = () => {
                noteData = parsedMidi.midi.tracks[0].notes.map((note: MidiNote, index: number) => {
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
            
                        }) as d3.Selection<SVGRectElement, MidiNote, HTMLElement, any>;
                    const initialX = note.midi * 10;
            
                    return {
                        note,
                        rect,
                        initialX,
                    };
                });
            
                scrollContainer.attr('transform', `translate(${initialXScroll}, ${initialYScroll}) rotate(180 ${svgWidth / 2} ${svgHeight / 2}) ${scaleFlip}`);
            };
            createStaticTimeline();

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
            let isFirstUpdate = true;
            const updateNotePositions = () => {
                
                const currentTime = Tone.Transport.seconds * 1000;
                setTimeout(() => {
                  noteData.forEach(({ note, initialX, rect }) => {
                    if (note && typeof note.ticks !== 'undefined') {
                        let noteStartTime = 0;
                        let beatsPerMinute = 120;
              
                        parsedMidi.midi.header.tempos.forEach((tempoEvent) => {
                        if (tempoEvent.ticks <= note.ticks) {
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
                        if (playing && parsedMidi) {
                            const now = Tone.now() + 0.5;
                            const displayOffset = now - 6;
                            parsedMidi.midi.tracks.forEach((track: any) => {
                                const synth = new Tone.PolySynth(Tone.Synth, {
                                    envelope: {
                                        attack: 0.02,
                                        decay: 0.1,
                                        sustain: 0.3,
                                        release: 1,
                                    },
                                }).toDestination();
                            synths.push(synth);
                            track.notes.forEach((note: MidiNote) => {
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
        executedFlag.current = true;
    }
    }, [parsedMidi]);

    const playTone = (note: any) => {
        const synth = new Tone.PolySynth(Tone.Synth, {
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 1,
            },
        }).toDestination();
        synth.triggerAttackRelease(
            note.name,
            note.duration,
            Tone.now(),
            note.velocity
        )
    }
  
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

    function base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
    
        for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    
        return bytes.buffer;
    }

return (<><div className='viz-wrapper'>
        <button id='startButton'>Start midi</button>
        <div id="midi-visualization">
            {}
            <Piano />
        </div>
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
