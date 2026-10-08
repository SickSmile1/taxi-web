'use client';

export type CameraMode = 'chase' | 'overview' | 'orbit';
export type AnimationStatus =
  | 'idle'
  | 'playing'
  | 'paused'
  | 'tunneling'
  | 'arrived';

interface CameraHudProps {
  camMode: CameraMode;
  setCamMode: (mode: CameraMode) => void;
  animStatus: AnimationStatus;
  onPlayPause: () => void;
  onReset: () => void;
}

export default function CameraHud({
  camMode,
  setCamMode,
  animStatus,
  onPlayPause,
  onReset,
}: CameraHudProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {/* Camera Selector Panel */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)',
          padding: 4,
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}
      >
        {(['chase', 'overview', 'orbit'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setCamMode(mode)}
            aria-label={`${mode === 'chase' ? 'Chase' : mode === 'overview' ? 'Overview' : 'Free'} camera mode`}
            aria-pressed={camMode === mode}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: camMode === mode ? '#ffaa00' : 'transparent',
              color: camMode === mode ? '#111111' : '#cccccc',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 'bold',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease',
            }}
          >
            {mode === 'chase'
              ? '🎥 Chase'
              : mode === 'overview'
                ? '🗺️ Overview'
                : '🔄 Free'}
          </button>
        ))}
      </div>

      {/* Animation Playback Controls */}
      {animStatus !== 'idle' && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(10px)',
            padding: 4,
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {animStatus !== 'arrived' ? (
            <button
              onClick={onPlayPause}
              aria-label={
                animStatus === 'paused' ? 'Resume animation' : 'Pause animation'
              }
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: '#ffaa00',
                color: '#111111',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
              }}
            >
              {animStatus === 'paused' ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          ) : (
            <button
              onClick={onReset}
              aria-label="Restart animation"
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: '#00cc66',
                color: '#111111',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
              }}
            >
              🔄 Restart
            </button>
          )}
          <button
            onClick={onReset}
            aria-label="Reset animation"
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
            }}
          >
            ⏹️ Reset
          </button>
        </div>
      )}
    </div>
  );
}
