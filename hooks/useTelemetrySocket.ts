import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { chartActions } from '../store/slices/chartSlice';

export function useTelemetrySocket(vehicleId: string) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Connect to backend WebSocket
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      console.log('✅ Connected to telemetry WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'telemetry') {
          const telemetry = msg.data;

          // Dispatch new points into Redux
          dispatch(chartActions.addTelemetryPoint({
            metric: 'voltage',
            point: { timestamp: telemetry.timestamp, value: telemetry.voltage }
          }));

          dispatch(chartActions.addTelemetryPoint({
            metric: 'current',
            point: { timestamp: telemetry.timestamp, value: telemetry.current }
          }));

          dispatch(chartActions.addTelemetryPoint({
            metric: 'temperature',
            point: { timestamp: telemetry.timestamp, value: telemetry.battery_temp }
          }));
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.onclose = () => {
      console.log('❌ Disconnected from telemetry WebSocket');
    };

    return () => ws.close();
  }, [vehicleId, dispatch]);
}
