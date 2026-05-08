"use client";

import { useRef, useState } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(1);

  // Função para tocar o áudio
  const playAudio = () => {
    audioRef.current?.play();
  };

  // Função para pausar o áudio
  const pauseAudio = () => {
    audioRef.current?.pause();
  };

  // Função para alterar o volume
  const changeVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>Player de Áudio</h1>

      {/* Capa da música */}
      <img
        src="/capa.jpg"
        alt="Capa da música"
        width="250"
        style={{ borderRadius: "10px" }}
      />

      <h2>Peça em Peça - Matuê</h2>

      {/* Áudio */}
      <audio ref={audioRef} src="/Matuê - De Peça em Peça feat. Knust & Chris Mc - 30PRAUM (youtube).mp3" />

      {/* Botões */}
      <div>
        <button onClick={playAudio}>Play</button>

        <button
          onClick={pauseAudio}
          style={{ marginLeft: "10px" }}
        >
          Pause
        </button>
      </div>

      {/* Controle de volume */}
      <div>
        <p>Volume: {Math.round(volume * 100)}%</p>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}