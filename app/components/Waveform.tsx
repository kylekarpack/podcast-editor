import WavesurferPlayer from "@wavesurfer/react";
import { useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function Waveform({ audioUrl }: { audioUrl: string }) {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlay = () => {
    const context = new AudioContext();
    const compressor =context.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;
    
    const audio = wavesurfer?.getMediaElement();
    const mediaNode = context.createMediaElementSource(audio!);
    mediaNode.connect(compressor);
    compressor.connect(context.destination);
  }

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);

    // TODO: Effects
    // ws.once("play", onPlay);
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
        normalize={true}
      />
    </>
  );
}
