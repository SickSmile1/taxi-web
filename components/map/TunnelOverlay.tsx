'use client';

interface TunnelOverlayProps {
  visible: boolean;
  isGerman: boolean;
  tunnelText: string;
}

export default function TunnelOverlay({
  visible,
  isGerman,
  tunnelText,
}: TunnelOverlayProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 8,
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}
      >
        {isGerman
          ? '🛣️ Autobahn A5 Verbindung...'
          : '🛣️ Autobahn A5 Connection...'}
      </div>
      <div
        style={{
          fontSize: 15,
          color: '#ffaa00',
          textShadow: '0 1px 5px rgba(0,0,0,0.8)',
          fontWeight: 600,
        }}
      >
        {tunnelText}
      </div>
    </div>
  );
}
