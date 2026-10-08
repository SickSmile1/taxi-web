'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { p } from '@/lib/base-path';
import { FLEET_CARS, type FleetCar } from '@/lib/fleet';
import type { Lang, Translations } from '@/lib/translations';

interface Props {
  t: Translations;
  lang: Lang;
}

const TOTAL_FRAMES = 72;

export default function Car360Viewer({ t, lang }: Props) {
  const [selectedCarId, setSelectedCarId] = useState<string>(FLEET_CARS[0].id);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const startFrameRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const inertiaAnimRef = useRef<number | null>(null);
  const currentFrameRef = useRef<number>(0);

  currentFrameRef.current = currentFrame;

  const currentCar =
    FLEET_CARS.find((c: FleetCar) => c.id === selectedCarId) || FLEET_CARS[0];

  // Set frame with wrap-around
  const setFrame = useCallback((idx: number) => {
    const normalized =
      ((Math.round(idx) % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
    setCurrentFrame(normalized);
  }, []);

  // Handle auto-spin
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrame(currentFrameRef.current + 1);
    }, 45);
    return () => clearInterval(interval);
  }, [isPlaying, setFrame]);

  // Drag interaction
  const handleDragStart = useCallback((clientX: number) => {
    if (inertiaAnimRef.current) {
      cancelAnimationFrame(inertiaAnimRef.current);
    }
    setIsPlaying(false);
    setIsDragging(true);
    setHasInteracted(true);
    startXRef.current = clientX;
    lastXRef.current = clientX;
    startFrameRef.current = currentFrameRef.current;
    velocityRef.current = 0;
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      velocityRef.current = clientX - lastXRef.current;
      lastXRef.current = clientX;
      const deltaX = clientX - startXRef.current;
      const sensitivity = 6.0; // pixels per 5° frame
      const frameDelta = deltaX / sensitivity;
      setFrame(startFrameRef.current - frameDelta);
    },
    [isDragging, setFrame],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Smooth inertia
    if (Math.abs(velocityRef.current) > 2) {
      let currentPos = currentFrameRef.current;
      let v = -velocityRef.current * 0.12;

      const applyInertia = () => {
        if (Math.abs(v) < 0.05) return;
        currentPos += v;
        setFrame(currentPos);
        v *= 0.92;
        inertiaAnimRef.current = requestAnimationFrame(applyInertia);
      };
      inertiaAnimRef.current = requestAnimationFrame(applyInertia);
    }
  }, [isDragging, setFrame]);

  // Global mouse / touch listeners for seamless dragging
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };
    const onMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        handleDragMove(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Generate frame source URLs for the active car
  const frameSources = Array.from({ length: TOTAL_FRAMES }).map((_, i) => {
    const deg = i * 5;
    const degStr = String(deg).padStart(3, '0');
    const frameStr = String(i).padStart(2, '0');
    return p(
      `${currentCar.folder72}${currentCar.filePrefix72}${frameStr}_${degStr}deg.jpg?v=2`,
    );
  });

  return (
    <div style={{ marginBottom: 44 }}>
      {/* 1. Navbar Style Vehicle Selector */}
      <nav
        aria-label="Fahrzeugauswahl"
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 24,
          padding: '4px 0',
        }}
      >
        {FLEET_CARS.map((car: FleetCar) => {
          const isSelected = car.id === selectedCarId;
          const typeName = car.type[lang] || car.type.de;
          return (
            <button
              key={car.id}
              onClick={() => {
                setSelectedCarId(car.id);
                setCurrentFrame(0);
                setIsPlaying(false);
              }}
              style={{
                background: isSelected ? 'var(--gold)' : 'var(--bg-surface)',
                color: isSelected ? '#0b0f14' : 'var(--text-soft)',
                border: isSelected
                  ? '1px solid var(--gold)'
                  : '1px solid var(--border-strong)',
                borderRadius: 999,
                padding: '10px 22px',
                fontSize: 14.5,
                fontWeight: isSelected ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: isSelected
                  ? '0 4px 16px rgba(230, 176, 50, 0.35)'
                  : 'none',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: car.colorDot,
                  border: '1px solid rgba(0,0,0,0.2)',
                  display: 'inline-block',
                }}
              />
              <span>{car.name}</span>
              <span
                style={{
                  fontSize: 12,
                  opacity: isSelected ? 0.9 : 0.65,
                  fontWeight: 500,
                }}
              >
                ({typeName})
              </span>
            </button>
          );
        })}
      </nav>

      {/* 2. ImaginStudio Style 360 Viewer */}
      <div
        className="viewer"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1100,
          margin: '0 auto',
          userSelect: 'none',
        }}
      >
        <div
          ref={containerRef}
          className="imagesContainer"
          onMouseDown={(e) => {
            e.preventDefault();
            handleDragStart(e.clientX);
          }}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handleDragStart(e.touches[0].clientX);
            }
          }}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 20,
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            background:
              'radial-gradient(ellipse 90% 75% at 50% 60%, #ffffff 0%, #f4f6f9 55%, #e2e6ed 100%)',
            boxShadow:
              '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Stack of 72 360-degree rotation images */}
          {frameSources.map((src: string, idx: number) => {
            const isCurrent = idx === currentFrame;
            return (
              // biome-ignore lint/performance/noImgElement: 360 degree turntable requires direct img elements for 0-latency scrubbing
              <img
                key={src}
                src={src}
                alt={`${currentCar.name} 360 view — angle ${idx * 5}°`}
                className={`viewer-image ${isCurrent ? 'current' : ''}`}
                loading={
                  idx === 0 || idx === 18 || idx === 36 || idx === 54
                    ? 'eager'
                    : 'lazy'
                }
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: isCurrent ? 'block' : 'none',
                  pointerEvents: 'none',
                }}
              />
            );
          })}

          {/* Interactive Drag Hint (disappears on first interaction) */}
          {!hasInteracted && (
            <div
              style={{
                position: 'absolute',
                bottom: 22,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(20, 24, 33, 0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                pointerEvents: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                zIndex: 10,
              }}
            >
              <span>{t.fuhrpark_hint || '360° Ziehen & Drehen'}</span>
            </div>
          )}
        </div>

        {/* 3. Slider Control Holder */}
        <div
          className="sliderHolder"
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 6px',
          }}
        >
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className={isPlaying ? 'btn-gold' : 'btn-outline'}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {isPlaying ? t.fuhrpark_pause : t.fuhrpark_autospin}
          </button>

          <input
            type="range"
            min="0"
            max={TOTAL_FRAMES - 1}
            value={currentFrame}
            step="1"
            aria-label={`Rotate ${currentCar.name} 360°`}
            className="angleSlider"
            onChange={(e) => {
              setIsPlaying(false);
              setFrame(Number.parseInt(e.target.value, 10));
            }}
            style={{
              flex: 1,
              accentColor: 'var(--gold)',
              height: 6,
              borderRadius: 3,
              background: 'var(--bg-elevated)',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* 4. Vehicle Specifications Card */}
      <div
        style={{
          marginTop: 34,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 16,
          padding: '28px 30px',
        }}
      >
        <div
          style={{
            marginBottom: 24,
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
              }}
            >
              {currentCar.brand} · {currentCar.type[lang] || currentCar.type.de}
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--text-heading)',
                margin: '4px 0 0',
              }}
            >
              {currentCar.name}
            </h3>
          </div>
        </div>

        {/* Technical Key Data Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 18,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: 'var(--bg-elevated)',
              padding: '16px 18px',
              borderRadius: 12,
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 4,
              }}
            >
              {t.fuhrpark_seats}
            </span>
            <strong style={{ fontSize: 16, color: 'var(--text-heading)' }}>
              {currentCar.seatsCount} Fahrgäste
            </strong>
          </div>

          <div
            style={{
              background: 'var(--bg-elevated)',
              padding: '16px 18px',
              borderRadius: 12,
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 4,
              }}
            >
              {t.fuhrpark_luggage}
            </span>
            <strong style={{ fontSize: 16, color: 'var(--text-heading)' }}>
              {currentCar.luggage[lang] || currentCar.luggage.de}
            </strong>
          </div>

          <div
            style={{
              background: 'var(--bg-elevated)',
              padding: '16px 18px',
              borderRadius: 12,
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 4,
              }}
            >
              Farbe & Ausführung
            </span>
            <strong style={{ fontSize: 16, color: 'var(--text-heading)' }}>
              {currentCar.color[lang] || currentCar.color.de}
            </strong>
          </div>
        </div>

        {/* Feature List & Use Cases */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          <div>
            <h4
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: 'var(--gold)',
                margin: '0 0 12px',
              }}
            >
              Komfort & Ausstattung
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(currentCar.features[lang] || currentCar.features.de).map(
                (feat: string) => (
                  <div
                    key={feat}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13.5,
                      color: 'var(--text-soft)',
                    }}
                  >
                    <span>•</span>
                    <span>{feat}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div>
            <h4
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: 'var(--gold)',
                margin: '0 0 12px',
              }}
            >
              Empfohlen für
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(currentCar.useCases[lang] || currentCar.useCases.de).map(
                (uc: string) => (
                  <div
                    key={uc}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13.5,
                      color: 'var(--text-soft)',
                    }}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: 12 }}>
                      •
                    </span>
                    <span>{uc}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
