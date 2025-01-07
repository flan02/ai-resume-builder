// src/components/VideoPlayer.tsx
import React from 'react';

interface VideoPlayerProps {
  src: string; // Ruta del archivo .webm
  alt?: string; // Texto alternativo opcional para accesibilidad
  className?: string; // Clases CSS opcionales
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, alt = 'Video', className }) => {
  return (
    <video
      className={className}
      autoPlay
      loop
      muted
      playsInline
      controls={false} // Oculta los controles si no los necesitas
    >
      <source src={src} type="video/webm" />
      <p>{alt}</p> {/* Mensaje de fallback para navegadores sin soporte */}
    </video>
  );
};

export default VideoPlayer;