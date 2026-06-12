'use client';

import { useEffect, useRef, useCallback } from 'react';
import '../styles/components/background-logo.css';

export default function BackgroundLogo() {
  const logoRef = useRef(null);
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    currentRotateX: 0,
    currentRotateY: 0,
    currentTranslateY: 0,
    spinOffset: 0,
    spinning: false,
    spinStart: 0,
  });

  const triggerSpin = useCallback(() => {
    const s = stateRef.current;
    if (s.spinning) return;
    s.spinning = true;
    s.spinStart = performance.now();
  }, []);

  useEffect(() => {
    let animationFrameId;
    const s = stateRef.current;

    const updateTransform = () => {
      if (!logoRef.current) {
        animationFrameId = requestAnimationFrame(updateTransform);
        return;
      }

      // Mouse-driven rotation (±40 deg for high sensitivity)
      const targetRotateX = -s.mouseY * 40;
      const targetRotateY = s.mouseX * 40;

      // Scroll parallax
      const targetTranslateY = window.scrollY * 0.12;

      // Smooth lerp
      const ease = 0.06;
      s.currentRotateX += (targetRotateX - s.currentRotateX) * ease;
      s.currentRotateY += (targetRotateY - s.currentRotateY) * ease;
      s.currentTranslateY += (targetTranslateY - s.currentTranslateY) * ease;

      // 360° spin on click (1s eased)
      let clickSpin = 0;
      if (s.spinning) {
        const elapsed = performance.now() - s.spinStart;
        const duration = 1000;
        if (elapsed >= duration) {
          s.spinning = false;
          s.spinOffset += 360;
          clickSpin = 0;
        } else {
          const t = elapsed / duration;
          const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          clickSpin = eased * 360;
        }
      }

      const totalRotateY = s.currentRotateY + s.spinOffset + clickSpin;

      logoRef.current.style.transform =
        `rotateX(${s.currentRotateX}deg) rotateY(${totalRotateY}deg) translateY(${s.currentTranslateY}px)`;

      animationFrameId = requestAnimationFrame(updateTransform);
    };

    const onMouseMove = (e) => {
      s.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      s.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    // Click anywhere on empty space to trigger 360 spin
    const onClick = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInteractive = tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select';
      const isInsideInteractive = e.target.closest('a, button, input, textarea, select');
      if (!isInteractive && !isInsideInteractive) {
        triggerSpin();
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('click', onClick);
    updateTransform();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [triggerSpin]);

  return (
    <div className="bg3d" aria-hidden="true">
      <div className="bg3d__scene">
        <div className="bg3d__logo" ref={logoRef}>
          {/* Front face */}
          <div className="bg3d__face bg3d__face--front">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          {/* Back face */}
          <div className="bg3d__face bg3d__face--back">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          {/* Circular edge ring for subtle thickness */}
          <div className="bg3d__face bg3d__face--edge" />
        </div>
      </div>
    </div>
  );
}
