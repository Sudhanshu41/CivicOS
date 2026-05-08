"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

type ConnectionStatus = "CONNECTED" | "CONNECTING" | "RECONNECTING" | "DISCONNECTED" | "DEGRADED";

interface SocketContextType {
  status: ConnectionStatus;
  sendMessage: (message: unknown) => void;
  subscribe: <T = unknown>(eventType: string, callback: (payload: T) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
  url?: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws" 
}) => {
  const [status, setStatus] = useState<ConnectionStatus>("DISCONNECTED");
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const subscriptions = useRef<Record<string, Set<(payload: unknown) => void>>>({});

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    setStatus("CONNECTING");
    
    try {
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket Connected");
        setStatus("CONNECTED");
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;
          
          if (subscriptions.current[type]) {
            subscriptions.current[type].forEach(callback => callback(payload));
          }
          // Global catch-all
          if (subscriptions.current["*"]) {
            subscriptions.current["*"].forEach(callback => callback(data));
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket Closed:", event.code);
        socketRef.current = null;
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setStatus("RECONNECTING");
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          setTimeout(() => {
            reconnectAttempts.current += 1;
            // eslint-disable-next-line
            connect();
          }, timeout);
        } else {
          setStatus("DISCONNECTED");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setStatus("DEGRADED");
      };

    } catch (err) {
      console.error("Failed to initiate WebSocket:", err);
      setStatus("DISCONNECTED");
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((message: unknown) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("Socket not connected. Message not sent:", message);
    }
  }, []);

  const subscribe = useCallback(<T = unknown>(eventType: string, callback: (payload: T) => void) => {
    if (!subscriptions.current[eventType]) {
      subscriptions.current[eventType] = new Set();
    }
    subscriptions.current[eventType].add(callback as (payload: unknown) => void);
    
    return () => {
      subscriptions.current[eventType].delete(callback as (payload: unknown) => void);
      if (subscriptions.current[eventType].size === 0) {
        delete subscriptions.current[eventType];
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ status, sendMessage, subscribe }}>
      {children}
    </SocketContext.Provider>
  );
};
