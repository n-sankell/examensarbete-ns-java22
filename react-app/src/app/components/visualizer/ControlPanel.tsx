import { ThunkDispatch, bindActionCreators } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { setVolume } from "../../actions/visualizerActions";
import { connect } from "react-redux";
import PlaySvg from '../../../assets/play-player-music-svgrepo-com.svg';
import PauseSvg from '../../../assets/pause-circle-svgrepo-com.svg';

interface DispatchProps {
    setVolume: (volume: number) => void;
}
interface StateProps {
    midiIsPlaying: boolean;
    volume: number;
}
interface ControlPanelProps extends StateProps, DispatchProps {}

const ControlPanel: React.FC<ControlPanelProps> = ( { volume, setVolume, midiIsPlaying } ) => {

    const handleVolumeChange = (event: any) => {
        const volumeValue = event.target.value;
        setVolume(volumeValue);
    };
    
    return ( 
        <div className="control-panel"> 
            <img 
                src={ midiIsPlaying === false ? PlaySvg : PauseSvg } 
                id='startButton' 
                className={ midiIsPlaying === false ? 'play-icon' : 'pause-icon' } >
            </img>
            <input
                type="range"
                min="-60"
                max="0"
                step="1"
                value={volume}
                onChange={handleVolumeChange}
            />
        </div>
     )
}

const mapStateToProps = (state: RootState): StateProps => ({
    midiIsPlaying: state.visualizer.midiIsPlaying,
    volume: state.visualizer.volume,
});
  
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, any>): DispatchProps => ({
    setVolume: bindActionCreators(setVolume, dispatch),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);