"use client";

import { useEffect, useRef, useState } from "react";

export function useTerminalWebSocket(url: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "log") {
        setMessages((prev) => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          level: data.level,
          message: data.message
        }]);
      } else if (data.type === "result") {
        setLastResult(data);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const clearMessages = () => setMessages([]);

  return { messages, lastResult, clearMessages };
}
