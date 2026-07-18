import { useEffect, useRef } from 'react';
import { useAppDispatch } from './redux';
import { chartActions } from '../store/slices/chartSlice';
import { alertActions } from '../store/slices/alertSlice'; 
import { telemetryActions } from '../store/slices/telemetrySlice'; 

export function useTelemetrySocket(vehicleId: string) {
  const dispatch = useAppDispatch();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log(`🚀 [CLIENT HOOK] Connecting WebSocket for vehicle: ${vehicleId}`);
    const ws = new WebSocket('ws://localhost:5000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ [CLIENT HOOK] Connected to stream server on port 5000.');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'telemetry') {
          const telemetry = msg.data;
          
          // 🟢 Read whichever casing style the network frame successfully provides
          const incomingVehicleId = telemetry.vehicle_id || telemetry.vehicleId || vehicleId;

          // Case-insensitive clean match validation check
          if (String(incomingVehicleId).toLowerCase() === String(vehicleId).toLowerCase()) {
            
            if (telemetryActions?.setLiveTelemetry) {
              dispatch(telemetryActions.setLiveTelemetry(telemetry));
            } else if (telemetryActions?.updateLiveTelemetry) {
              dispatch(telemetryActions.updateLiveTelemetry(telemetry));
            }
            
            // Dispatch clean numeric values out to charts
            dispatch(chartActions.addTelemetryPoint({
              metric: 'voltage',
              point: { timestamp: telemetry.timestamp, value: Number(telemetry.voltage || 0) }
            }));

            dispatch(chartActions.addTelemetryPoint({
              metric: 'current',
              point: { timestamp: telemetry.timestamp, value: Number(telemetry.current || 0) }
            }));

            dispatch(chartActions.addTelemetryPoint({
              metric: 'temperature',
              point: { timestamp: telemetry.timestamp, value: Number(telemetry.battery_temp || 0) }
            }));

            // Handle the active real-time alert aggregation
            if (msg.alert) {
              console.log(`📣 [CLIENT HOOK] Active RCA alert payload captured! ID: ${msg.alert.id}. Pushing straight to Redux state store.`);
              dispatch(alertActions.pushAlert(msg.alert));
            }
          } else {
            console.log(`🔍 [CLIENT HOOK] Mismatched data frame bypassed -> UI Expected: [${vehicleId}] | Got: [${incomingVehicleId}]`);
          }
        } 
      } catch (err) {
        console.error('❌ [CLIENT HOOK] Message processing exception encountered:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ [CLIENT HOOK] Error connection state flagged:', error);
    };

    ws.onclose = (event) => {
      console.warn(`🛑 [CLIENT HOOK] Connection closed. Code context: ${event.code}`);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        console.log('🔌 [CLIENT HOOK] Cleaning up hook runtime environment. Closing open connection nodes.');
        ws.close();
      }
      wsRef.current = null;
    };
  }, [vehicleId, dispatch]);
}