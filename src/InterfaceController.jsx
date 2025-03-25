import DateTimeWeather from './components/DateTimeWeather'
import UIBar from './components/UIBar'
import MusicBar from './components/MusicBar'
import { FullScreen, useFullScreenHandle } from "react-full-screen"

export default function InterfaceController() {
    const handle = useFullScreenHandle();
    return (
        <>
            <FullScreen handle={handle}>
                <DateTimeWeather />
                <MusicBar />
                <UIBar handleFullscreen={handle}/>
            </FullScreen>
        </>
    )
}