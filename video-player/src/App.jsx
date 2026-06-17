import { useRef, useState } from "react";
import "./App.css";

const videos = [
  {
    title: "Vídeo 1",
    src: "/videos/video1.mp4",
  },
  {
    title: "Vídeo 2",
    src: "/videos/video2.mp4",
  },
  {
    title: "Vídeo 3",
    src: "/videos/video3.mp4",
  },
];

function App() {
  const videoRef = useRef(null);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Alterna entre reprodução e pausa do vídeo
  function playPause() {
    const video = videoRef.current;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  // Ajusta o volume do vídeo
  function changeVolume(e) {
    const value = Number(e.target.value);
    setVolume(value);
    videoRef.current.volume = value;
  }

  // Atualiza a barra de progresso do tempo atual do vídeo
  function updateProgress() {
    setProgress(videoRef.current.currentTime);
  }

  // Muda o tempo atual do vídeo quando o usuário arrasta a barra de progresso
  function changeTime(e) {
    const value = Number(e.target.value);
    videoRef.current.currentTime = value;
    setProgress(value);
  }

  // Avança ou retrocede o vídeo por um número de segundos
  function skipTime(seconds) {
    videoRef.current.currentTime += seconds;
  }

  // Vai para o próximo vídeo da lista (volta para o primeiro ao final)
  function nextVideo() {
    const next = (currentVideo + 1) % videos.length;
    setCurrentVideo(next);
    setIsPlaying(false);
  }

  // Vai para o vídeo anterior da lista (volta para o último se estiver no primeiro)
  function previousVideo() {
    const previous =
      currentVideo === 0 ? videos.length - 1 : currentVideo - 1;

    setCurrentVideo(previous);
    setIsPlaying(false);
  }

  // Seleciona um vídeo específico da lista
  function selectVideo(index) {
    setCurrentVideo(index);
    setIsPlaying(false);
  }

  // Formata o tempo em segundos para o formato MM:SS
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <main className="container">
      <h1>Player de Vídeo</h1>

      <video
        ref={videoRef}
        src={videos[currentVideo].src}
        width="700"
        onTimeUpdate={updateProgress}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
        onEnded={nextVideo}
      />

      <h2>{videos[currentVideo].title}</h2>

      <div className="controls">
        <button onClick={previousVideo}>⏮ Vídeo</button>
        <button onClick={() => skipTime(-10)}>⏪ 10s</button>
        <button onClick={playPause}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={() => skipTime(10)}>10s ⏩</button>
        <button onClick={nextVideo}>Vídeo ⏭</button>
      </div>

      <div className="progress">
        <span>{formatTime(progress)}</span>

        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          onChange={changeTime}
        />

        <span>{formatTime(duration)}</span>
      </div>

      <div className="volume">
        <label>Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={changeVolume}
        />
      </div>

      <section className="playlist">
        <h3>Lista de vídeos</h3>

        {videos.map((video, index) => (
          <button
            key={index}
            onClick={() => selectVideo(index)}
            className={currentVideo === index ? "active" : ""}
          >
            {video.title}
          </button>
        ))}
      </section>
    </main>
  );
}

export default App;