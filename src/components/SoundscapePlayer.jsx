import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, CloudRain, Flame, Music, Wind } from 'lucide-react';

export const SoundscapePlayer = ({ soundscape, onSelectSoundscape }) => {
  const audioCtxRef = useRef(null);
  const soundNodesRef = useRef([]);

  useEffect(() => {
    // Stop previous audio nodes
    stopSoundscape();

    if (soundscape === 'off') return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (soundscape === 'rain') {
        createRainSynth(ctx);
      } else if (soundscape === 'fireplace') {
        createFireplaceSynth(ctx);
      } else if (soundscape === 'lofi') {
        createLofiSynth(ctx);
      } else if (soundscape === 'wind') {
        createWindSynth(ctx);
      }
    } catch (e) {
      console.error('Web Audio error:', e);
    }

    return () => {
      stopSoundscape();
    };
  }, [soundscape]);

  const stopSoundscape = () => {
    soundNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    soundNodesRef.current = [];
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
  };

  const createRainSynth = (ctx) => {
    // Pink noise buffer
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    soundNodesRef.current.push(whiteNoise, filter, gain);
  };

  const createFireplaceSynth = (ctx) => {
    // Brown noise with lowpass filter
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 1.5;
    }

    const brownNoise = ctx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);

    brownNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    brownNoise.start();
    soundNodesRef.current.push(brownNoise, filter, gain);
  };

  const createLofiSynth = (ctx) => {
    // Soft Cmaj7 chord ambient drone (C, E, G, B)
    const freqs = [130.81, 164.81, 196.00, 246.94];
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
    masterGain.connect(ctx.destination);

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start();
      soundNodesRef.current.push(osc, filter, gain);
    });
    soundNodesRef.current.push(masterGain);
  };

  const createWindSynth = (ctx) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    soundNodesRef.current.push(whiteNoise, filter, gain);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {soundscape === 'off' ? <VolumeX size={14} /> : <Volume2 size={14} style={{ color: 'var(--accent-primary)' }} />}
        Audio:
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => onSelectSoundscape('off')}
          className={`btn ${soundscape === 'off' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          title="Mute Ambient Sound"
        >
          Off
        </button>
        <button
          onClick={() => onSelectSoundscape('rain')}
          className={`btn ${soundscape === 'rain' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          title="Gentle Rain Soundscape"
        >
          <CloudRain size={12} /> Rain
        </button>
        <button
          onClick={() => onSelectSoundscape('fireplace')}
          className={`btn ${soundscape === 'fireplace' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          title="Cozy Fireplace Crackle"
        >
          <Flame size={12} /> Fire
        </button>
        <button
          onClick={() => onSelectSoundscape('lofi')}
          className={`btn ${soundscape === 'lofi' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          title="Soft Ambient Lo-Fi Chill"
        >
          <Music size={12} /> Chill
        </button>
        <button
          onClick={() => onSelectSoundscape('wind')}
          className={`btn ${soundscape === 'wind' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          title="Midnight Wind"
        >
          <Wind size={12} /> Wind
        </button>
      </div>
    </div>
  );
};
