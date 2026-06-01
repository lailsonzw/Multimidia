"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

const musics = [
  {
    title: "A Morte do Autotune - Matuee",
    cover: "/Capa morte do autotune.webp",
    file: "/Matuê - A Morte do Autotune.mp3",
  },
  {
    title: "De Peça em Peça - Matuê",
    cover: "/Capa.jpg",
    file: "/Matuê - De Peça em Peça feat. Knust & Chris Mc - 30PRAUM (youtube).mp3",
  },
];

const styles = {
  container: { minHeight: "100vh", background: "#111", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Arial" } as CSSProperties,
  player: { width: "350px", background: "#1f1f1f", padding: "25px", borderRadius: "20px", boxShadow: "0 0 20px rgba(0,0,0,0.5)" } as CSSProperties,
  img: { borderRadius: "15px", marginTop: "20px", width: "100%" } as CSSProperties,
  title: { textAlign: "center", marginTop: "15px", color: "#00ff88" } as CSSProperties,
  section: { marginTop: "25px" } as CSSProperties,
  flexCenter: { display: "flex", justifyContent: "center", gap: "15px", marginBottom: "15px" } as CSSProperties,
  flexRow: { display: "flex", justifyContent: "center", gap: "10px" } as CSSProperties,
  timeFlex: { display: "flex", justifyContent: "space-between", marginTop: "5px" } as CSSProperties,
  playlistItem: (isActive: boolean): CSSProperties => ({
    padding: "10px", marginTop: "10px", borderRadius: "10px", cursor: "pointer",
    background: isActive ? "#00ff88" : "#2c2c2c", color: isActive ? "black" : "white",
    fontWeight: isActive ? "bold" : "normal", transition: "0.3s",
  }),
};

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentMusic, setCurrentMusic] = useState(0); // Índice da música atual na playlist
  const [isPlaying, setIsPlaying] = useState(false); // Se o áudio está tocando
  const [volume, setVolume] = useState(1); // Volume (0 a 1)
  const [currentTime, setCurrentTime] = useState(0); // Tempo atual de reprodução em segundos
  const [duration, setDuration] = useState(0); // Duração total da música em segundos

  const music = musics[currentMusic];
  
  // Formata o tempo em minutos:segundos (ex: 2:30)
  const formatTime = (time: number) => `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, "0")}`;

  // Alterna entre play e pause - se estiver tocando, pausa; se estiver pausado, toca
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Altera a posição de reprodução da música para o tempo especificado
  const handleAudioTime = (value: number) => {
    if (audioRef.current) audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  // Controla o volume do áudio (de 0 a 1)
  const handleVolume = (value: number) => {
    if (audioRef.current) audioRef.current.volume = value;
    setVolume(value);
  };

  // Navega pela playlist - offset -1 vai para música anterior, +1 vai para próxima
  const changeMusic = (offset: number) => setCurrentMusic((currentMusic + offset + musics.length) % musics.length);

  // Hook que monitora o progresso da música - atualiza o tempo atual e duração total
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    audio.addEventListener("timeupdate", updateTime);
    return () => audio.removeEventListener("timeupdate", updateTime);
  }, []);

  // Hook que reproduz automaticamente a música quando muda de track, se o player está tocando
  useEffect(() => {
    if (audioRef.current && isPlaying) audioRef.current.play();
  }, [currentMusic]);

  return (
    <div style={styles.container}>
      <div style={styles.player}>
        <h1 style={{ textAlign: "center" }}>🎵 Player de Áudio</h1>
        <img src={music.cover} alt={music.title} style={styles.img} />
        <h2 style={styles.title}>{music.title}</h2>
        <audio ref={audioRef} src={music.file} />

        <div style={styles.section}>
          <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => handleAudioTime(Number(e.target.value))} style={{ width: "100%" }} />
          <div style={styles.timeFlex}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.flexCenter}>
            <button onClick={() => changeMusic(-1)}>⏮</button>
            <button onClick={togglePlayPause}>{isPlaying ? "⏸" : "▶"}</button>
            <button onClick={() => changeMusic(1)}>⏭</button>
          </div>
          <div style={styles.flexRow}>
            <button onClick={() => audioRef.current && (audioRef.current.currentTime -= 10)}>⏪ 10s</button>
            <button onClick={() => audioRef.current && (audioRef.current.currentTime += 10)}>10s ⏩</button>
          </div>
        </div>

        <div style={styles.section}>
          <p>Volume: {Math.round(volume * 100)}%</p>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => handleVolume(Number(e.target.value))} style={{ width: "100%" }} />
        </div>

        <div style={styles.section}>
          <h3>Playlist</h3>
          {musics.map((item, index) => (
            <div key={index} onClick={() => setCurrentMusic(index)} style={styles.playlistItem(currentMusic === index)}>
              🎶 {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}