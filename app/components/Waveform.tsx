import WavesurferPlayer from "@wavesurfer/react";
import { useState } from "react";

export default function Waveform({ audioUrl }: { audioUrl: string }) {
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <>
      <WavesurferPlayer
        height={200}
        waveColor="blue"
        progressColor="rgb(125, 125, 125)"
        url={audioUrl}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        mediaControls={true}
      />
    </>
  );
}
