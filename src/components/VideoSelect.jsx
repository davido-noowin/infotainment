import videoLinksObject from "../assets/videoLinks";
import "./styles/VideoSelect.css";

export default function VideoSelect(props) {
  const videoOptions = videoLinksObject.map((video) => {
    return (
      <option
        value={video.videoID}
        key={video.ID}
      >
        {video.title}
      </option>
    );
  });

  return (
    <div className="video-selector">
      <select name="video" onChange={props.handleSelect} defaultValue={props.focusedVideoID}>
        <option value="" disabled>
          --Please choose a video--
        </option>
        {videoOptions}
      </select>
    </div>
  );
}
