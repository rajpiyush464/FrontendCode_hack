import { useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './redux';
import { alertActions } from '../store/slices/alertSlice';

function playBeep(severity: 'warning' | 'critical', volume = 70) {
  const vol = Math.max(0, Math.min(100, volume)) / 100;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const peak = Math.max(0.02, vol * 0.5);

    const makeTone = (freq: number, type: OscillatorType, startAt: number, dur: number) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = type;
      gain.gain.setValueAtTime(peak, startAt);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
      oscillator.start(startAt);
      oscillator.stop(startAt + dur);
    };

    if (severity === 'critical') {
      makeTone(880, 'square', ctx.currentTime, 0.3);
      makeTone(880, 'square', ctx.currentTime + 0.35, 0.3);
      setTimeout(() => ctx.close(), 900);
    } else {
      makeTone(660, 'sine', ctx.currentTime, 0.25);
      setTimeout(() => ctx.close(), 600);
    }
  } catch {
    // Audio not available
  }
}

export function useAlertSound() {
  const dispatch = useAppDispatch();
  const { soundEnabled, volume, lastBeepAt, alerts } = useAppSelector((s) => s.alert);
  const prevBeepRef = useRef<number | null>(null);

  useEffect(() => {
    if (!soundEnabled || !lastBeepAt || volume === 0) return;
    if (prevBeepRef.current === lastBeepAt) return;

    prevBeepRef.current = lastBeepAt;

    const latest = alerts.find(
      (a) => a.status === 'active' && (a.severity === 'critical' || a.severity === 'warning')
    );

    if (latest) {
      playBeep(latest.severity === 'critical' ? 'critical' : 'warning', volume);
    }

    dispatch(alertActions.clearLastBeep());
  }, [lastBeepAt, soundEnabled, volume, alerts, dispatch]);

  // Periodic beep for unresolved critical alerts
  useEffect(() => {
    if (!soundEnabled || volume === 0) return;

    const interval = setInterval(() => {
      const hasCritical = alerts.some(
        (a) => a.status === 'active' && a.severity === 'critical'
      );
      if (hasCritical) {
        playBeep('critical', volume);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [soundEnabled, volume, alerts]);

  const toggleSound = useCallback(() => {
    dispatch(alertActions.toggleSound());
  }, [dispatch]);

  const setVolume = useCallback(
    (value: number) => {
      dispatch(alertActions.setVolume(value));
    },
    [dispatch]
  );

  return { soundEnabled, volume, setVolume, toggleSound };
}

export default useAlertSound;
