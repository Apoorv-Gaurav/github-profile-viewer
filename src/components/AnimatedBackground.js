'use client';

import { useEffect, useRef } from 'react';
import '../styles/components/animated-bg.css';

/**
 * Animated background with floating orbs that shift color
 * based on mouse position. Used on Compare & Bookmarks pages.
 */
export default function AnimatedBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseX = 0.5;
    let mouseY = 0.5;
    let currentHue = 0;
    let targetHue = 0;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      // Map mouse X position to a hue shift (0–360)
      targetHue = mouseX * 360;
    };

    const update = () => {
      // Smoothly interpolate the hue
      currentHue += (targetHue - currentHue) * 0.03;
      container.style.setProperty('--orb-hue', `${currentHue}`);
      container.style.setProperty('--mouse-x', `${mouseX}`);
      container.style.setProperty('--mouse-y', `${mouseY}`);
      animationFrameId = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    update();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="animated-bg" ref={containerRef} aria-hidden="true">
      <div className="animated-bg__orb animated-bg__orb--1" />
      <div className="animated-bg__orb animated-bg__orb--2" />
      <div className="animated-bg__orb animated-bg__orb--3" />
      <div className="animated-bg__orb animated-bg__orb--4" />
    </div>
  );
}
