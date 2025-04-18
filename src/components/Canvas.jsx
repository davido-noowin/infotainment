import "./styles/Canvas.css";

export default function Canvas(props) {
  const videoID = props.videoID;
  const youtubeEmbedURL = "https://www.youtube.com/embed/";
  const queryString =
    "?start=777&autoplay=1&loop=1&mute=1&color=white&controls=0&playsinline=1&rel=0&enablejsapi=1&playlist=";
  let finalVideoURL = youtubeEmbedURL + videoID + queryString + videoID;

  return (
    <main seamless="seamless">
      <iframe
        id={props.id}
        ref={props.ref}
        src={finalVideoURL}
        className="canvas"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </main>
  );
}
