import videoLinksObject from "../assets/videoLinks";
import "./VideoSelect.css";

export default function VideoSelect(props) {
  const videoOptions = videoLinksObject.map((video) => {
    return (
      <option
        value={video.videoID}
        key={video.ID}
        selected={props.focusedVideoID === video.videoID ? true : false}
      >
        {video.title}
      </option>
    );
  });

  return (
    <div className="video-selector">
      <select name="video" onChange={props.handleSelect}>
        <option value="" disabled>
          --Please choose a video--
        </option>
        {videoOptions}
      </select>
    </div>
  );
}
