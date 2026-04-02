"use client";

import { useEffect, useRef } from "react";

/**
 * Enhanced ScreenWakeLock component that prevents the screen from dimming.
 * Uses the Screen Wake Lock API with a hidden video fallback for maximum compatibility.
 */
export default function ScreenWakeLock() {
  const wakeLockRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // 1. Try Native Wake Lock API
    const requestWakeLock = async () => {
      if (!("wakeLock" in navigator)) return false;
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        console.log("Native Screen Wake Lock is active");
        return true;
      } catch (err) {
        console.error("Native Wake Lock failed:", err);
        return false;
      }
    };

    // 2. Video Fallback (The "NoSleep" trick)
    const startVideoFallback = () => {
      if (videoRef.current) return;
      
      const video = document.createElement("video");
      video.setAttribute("loop", "");
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.style.position = "fixed";
      video.style.top = "0";
      video.style.left = "0";
      video.style.width = "1px";
      video.style.height = "1px";
      video.style.opacity = "0.01";
      video.style.pointerEvents = "none";
      
      // A 1-second "blank" video base64
      video.src = "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAAAZptb292AAAAbG12aGQAAAAA3nN/e95zf3sAAAPoAAAAKAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAABVnRyYWsAAABcdGtoZAAAAADec3973nN/ewAAAAEAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAFVbWRpYQAAACBtZGhkAAAAAN5zf3vec397AAAIAAAAEABVNDBYAAAAAABoZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAATxtZGlhAAAAIG1kaGQAAAAA3nN/e95zf3sAAAgAAAAQAFVNDBYAAAAAAGhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXI= ";
      
      document.body.appendChild(video);
      videoRef.current = video;
      
      const playVideo = () => {
        video.play().catch(e => console.warn("Video play failed:", e));
      };
      
      playVideo();
      // Also try to play on any user interaction in case it was blocked
      document.addEventListener("click", playVideo, { once: true });
    };

    const initWakeLock = async () => {
      const success = await requestWakeLock();
      if (!success) {
        startVideoFallback();
      }
    };

    initWakeLock();

    // Re-request when visible
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        await requestWakeLock();
        if (videoRef.current) videoRef.current.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) wakeLockRef.current.release();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.remove();
        videoRef.current = null;
      }
    };
  }, []);

  return null;
}
