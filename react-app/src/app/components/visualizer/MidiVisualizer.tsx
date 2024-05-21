import * as Tone from 'tone';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { select } from 'd3';
import { MidiJSON, TrackJSON } from '@tonejs/midi';
import { connect as reduxConnect } from 'react-redux';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { RootState } from '../../store';
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
import { noteOffsetPosition, noteWidth } from '../../helpers/NotesPositionHelper';
import { keyboardHeight, naturalKeyHeight, naturalKeyWidth, sharpKeyHeight, sharpKeyWidth, durationHeight, xPosSpacing } from '../../helpers/VisualizationHelper';
import { MidiWrapper } from '../../types/MidiWrapper';
import './MidiVisualizer.css';

interface VisualizerStateProps {
    parsedMidi: MidiWrapper;
    midiIsPlaying: boolean;
    currentTrack: number;
    volumeValue: number;
}
interface VisualizerDispatchProps {
    playMidi: () => void;
    pauseMidi: () => void;
    setCurrentTrack: (track: number) => void;
}
interface VisualizerProps extends VisualizerDispatchProps, VisualizerStateProps {}

const MidiVisualizer: React.FC<VisualizerProps> = ( { parsedMidi, midiIsPlaying, volumeValue, playMidi, pauseMidi, currentTrack, setCurrentTrack } ) => {

    const windowSize: WindowSize = useWindowSize();
    const svgWidth: number = windowSize.width - 4;
    const svgHeight: number = windowSize.height - 64;
    const scrollHeight: number = svgHeight - keyboardHeight;
    const minXScroll: number = svgWidth / 2 - svgWidth / 8;
    const maxXScroll: number = -svgWidth + -svgWidth / 2;
    let noteAmount: number= 2;
    let maxYScroll: number = -svgWidth * noteAmount;
    let transportPosition = 0;
    let part: Tone.Part | null = null;
    let loopIntervalId: any | null = null;
    let isPlaying: boolean = false;
    let mouseDown: boolean = false;
    let noteData: NoteData[] = [];
    let keyData: KeyData[];
    let initialXScroll: number = -svgWidth + svgWidth / 3;
    let initialYScroll: number = scrollHeight / 2;
    const scrollOffset = useRef<number>(0);
    let transportOffset: number = 0;
    const synthsRef = useRef<Tone.PolySynth[]>([]);
    const volumeRef = useRef<number>(volumeValue);
    const midiRef = useRef<MidiWrapper>( { midi: null } );

    const updateNotePositions = () => {
        if (isPlaying === true) {
            const activeNotes: string[] = [];
            const currentTime = Tone.Transport.seconds * durationHeight;

            setTimeout(() => {
                noteData.forEach(({ note, initialX, rect }) => {
                    if (note && typeof note.ticks !== 'undefined' && parsedMidi.midi !== null) {
                        let noteStartTime = 0;
                        let beatsPerMinute = 110;
                        let magicNumber = 5.1;
          
                        parsedMidi.midi.header.tempos.forEach((tempoEvent: TempoEvent) => {
                            if (tempoEvent.ticks <= note.ticks && parsedMidi.midi !== null) {
                                beatsPerMinute = tempoEvent.bpm;
                                noteStartTime =
                                ((note.ticks - scrollOffset.current * magicNumber) / parsedMidi.midi.header.ppq) * (60 / beatsPerMinute) * durationHeight; 
                            }
                        });
          
                        const yPosition = Math.max(noteStartTime - currentTime + 100 + scrollOffset.current, maxYScroll * 10);
                        if (isNaN(yPosition)) {
                            console.error('NaN yPosition:', { note, currentTime, noteStartTime, initialYScroll });
                        }
          
                        rect.attr('y', yPosition);
                    
                        if (yPosition < -scrollHeight/2 - -keyboardHeight - scrollOffset.current && yPosition > (-scrollHeight/2 - -keyboardHeight - scrollOffset.current) - note.duration * durationHeight) {
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
            
                requestAnimationFrame(debouncedUpdate);
            }, 1); 
        }
    }

    const debouncedUpdate = debounce(updateNotePositions, 1);

    const startPlayback = async () => {
        if (!isPlaying) {

            Tone.Transport.start();

            loopIntervalId = setInterval(() => {
                if (isPlaying) {
                    updateNotePositions();
                }
            }, 1000 / 16);
            
            isPlaying = true;
            playMidi();

            await Tone.start().then(() => {
                if (parsedMidi.midi !== null) {
                    parsedMidi.midi.tracks.forEach((track: TrackJSON, index: number) => {
                        const synth: Tone.PolySynth = new Tone.PolySynth().toDestination();
                        const volume: Tone.Volume = new Tone.Volume(volumeRef.current).toDestination();
                        synth.connect(volume);
                        synth.volume.value = volumeRef.current;
                        
                        synthsRef.current.push( synth );
                        part = new Tone.Part((time, event) => {
                            time = transportPosition === 0 ? time + 0.5 : time + 0.5;
                            const { note, velocity, duration } = event;
                            synth.triggerAttackRelease(note, duration, time, velocity);
                        }, track.notes.map((note: NoteJSON) => ({
                            time: `+${note.time}`,
                            duration: note.duration,
                            note: note.name,
                            velocity: note.velocity || 0.8
                        })))
                        .start(0, transportPosition);
                    });
                }
            });
        }
    };

    const yPositionToTransportTime = (yPosition: number, beatsPerMinute: number, ppq: number) => {
        const noteStartTime = yPosition / durationHeight;
        const transportTime = noteStartTime - ((scrollOffset.current / (-scrollOffset.current*0.0012))) / durationHeight;
        return transportTime < 0 ? 0 : transportTime;
    };

    const pausePlayback = () => {
        Tone.Transport.pause();

        transportPosition = Tone.Transport.seconds;
        Tone.Transport.clear(0);

        while (synthsRef.current.length) {
            const synth = synthsRef.current.shift();
            if (synth !== undefined) {
                synth.releaseAll();
                synth.disconnect();
            }   
        }

        isPlaying = false;
        pauseMidi();

    }

    const playButtonClick = () => {
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
            .attr('height', keyboardHeight);

        const createKeyboard = (initialX: number): void => {
            keyData = keys.filter((filter: Key ) => filter.name !== 'ghostnote' ).map((key: Key) => {
                let isPlaying: boolean = false;
                const pianoKey = keyboardContainer.append('rect')
                    .attr('height', key.isNatural ? naturalKeyHeight : sharpKeyHeight)
                    .attr('width', key.isNatural ? naturalKeyWidth : sharpKeyWidth)
                    .attr('fill', isPlaying ? key.isNatural ? 'red' : 'orange' : key.isNatural ? 'ghostwhite' : 'darkslategray')
                    .attr('y', key.isNatural ? 0 : naturalKeyHeight - sharpKeyHeight)
                    .attr('x', key.isNatural ? key.index * xPosSpacing - 350 : key.index * xPosSpacing - 350 + 12)
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
                minX = indexes.indexOf(notes[0].midi) * xPosSpacing;
                maxX = indexes.indexOf(notes[0].midi) * xPosSpacing;
            }
            noteData = notes.map((note: NoteJSON) => {
                const dur = note.duration === 0 ? 0.1 : note.duration;
                const xOffset = noteOffsetPosition(note.name);
                const width = noteWidth(note.name);
                const xPos = indexes.indexOf(note.midi) * xPosSpacing + xOffset;
                
                const rect = scrollContainer.append('rect')
                    .attr('height', dur * durationHeight)
                    .attr('width', width)
                    .attr('fill', note.name.length === 3 ? 'orange' : 'red')
                    .attr('y', note.ticks / 1.5)
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
                scrollX = -svgWidth / 2 - xDifferance / xDifferance;
            }
        
            scrollContainer.attr('transform', `translate(${scrollX}, ${initialYScroll})`);
        };

        if (parsedMidi.midi !== null) {
            noteAmount = parsedMidi.midi.tracks[currentTrack].notes.length;
            createStaticTimeline(parsedMidi.midi);
            createKeyboard(scrollX);
        } else {
            createKeyboard(initialXScroll);
        }

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

                scrollOffset.current += delta;

                if (parsedMidi.midi !== null && delta !== 0) {
                    const transportTime = yPositionToTransportTime(-newScrollY, parsedMidi.midi.header.tempos[0].bpm, parsedMidi.midi.header.ppq);
                    transportPosition = transportTime;
                    Tone.Transport.clear(0);
                    Tone.Transport.seconds = transportPosition;
                    Tone.Transport.pause();
                }
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
                    
                    scrollContainer.attr('transform', `translate(${newScrollX}, ${currentYScroll + scrollOffset.current + scrollHeight / 2})`);
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
            if (synth !== undefined) {
                synth.releaseAll();
                synth.disconnect();
            }
        }
        transportPosition = 0;
        isPlaying = false;
    }

    useEffect(() => {
        midiRef.current = parsedMidi;
        cleanup();
        visualizeData();
        return () => {
            startPlayback();
        }
    }, [parsedMidi]);

    useEffect(() => {
        volumeRef.current = volumeValue;
        if (synthsRef.current.length > 0) {
            synthsRef.current.forEach(( synth ) => {
                synth.volume.value = volumeValue;
            });
        }
    }, [volumeValue]);

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
    volumeValue: state.visualizer.volume,
});

const mapDispatchToProps = (dispatch: Dispatch): VisualizerDispatchProps => ({
    playMidi: bindActionCreators(playMidi, dispatch),
    pauseMidi: bindActionCreators(pauseMidi, dispatch),
    setCurrentTrack: bindActionCreators(setCurrentTrack, dispatch),
});

export default reduxConnect(mapStateToProps, mapDispatchToProps)(MidiVisualizer);
