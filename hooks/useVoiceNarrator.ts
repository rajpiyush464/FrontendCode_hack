import { useCallback } from 'react';

type AudioTheme = 'warning' | 'critical' | 'resolved' | 'telemetry_chime';

export function useVoiceNarrator() {
  
  // 🎙️ VOICE INTERACTION (TTS Engine)
  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop overlapping tracks instantly

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Gamified AI assistant speed
      utterance.pitch = 1.0; 

      const voices = window.speechSynthesis.getVoices();
      const systemVoice = voices.find(v => v.lang.includes('en')) || voices[0];
      if (systemVoice) utterance.voice = systemVoice;

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // 🔊 THEMED SOUND SYNTHESIZER
  const playThemeSound = useCallback((theme: AudioTheme) => {
    if (!('AudioContext' in window || 'webkitAudioContext' in window)) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (theme) {
      case 'critical': // 🚨 High-intensity dual alarm
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'warning': // ⚠️ Mild system warning tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'telemetry_chime': // 📊 Subtle sci-fi ambient data tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.03, now); // Kept very quiet so it isn't annoying
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
    }
  }, []);

  return { speakText, playThemeSound };
}