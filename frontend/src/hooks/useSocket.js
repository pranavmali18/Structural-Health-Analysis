import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket(structureId, onSensorUpdate) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Socket.IO connection to backend server
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen to global stream or structure specific stream
    const eventName = structureId ? `sensor_stream:${structureId}` : 'sensor_stream_global';

    socket.on(eventName, (data) => {
      if (onSensorUpdate) {
        onSensorUpdate(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [structureId, onSensorUpdate]);

  return { isConnected, socket: socketRef.current };
}
