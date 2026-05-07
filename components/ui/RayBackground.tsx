export function RayBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Ethiopian-flag-colored bloom */}
      <div
        className="absolute"
        style={{
          left: '50%', top: 0,
          width: 2400, height: 1200,
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse at 50% 55%, rgba(52,211,153,0.20) 0%, rgba(251,191,36,0.12) 20%, rgba(239,68,68,0.07) 35%, transparent 58%)',
        }}
      />
      {/* Ring system */}
      <div
        className="absolute"
        style={{ left: '50%', top: 200, width: 1700, height: 1700, transform: 'translateX(-50%) rotate(180deg)' }}
      >
        {[
          { mt: -10, border: '20px solid rgba(52,211,153,0.45)',         z: 5, shadow: 'none' },
          { mt: -6,  border: '20px solid rgba(251,191,36,0.32)',         z: 4, shadow: 'none' },
          { mt: -3,  border: '20px solid rgba(239,68,68,0.22)',          z: 3, shadow: 'none' },
          { mt: 0,   border: '18px solid rgba(52,211,153,0.55)',         z: 2, shadow: '0 -15px 28px rgba(52,211,153,0.38)' },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: '#080810',
              marginTop: r.mt,
              border: r.border,
              boxShadow: r.shadow === 'none' ? undefined : r.shadow,
              transform: 'rotate(180deg)',
              zIndex: r.z,
            }}
          />
        ))}
      </div>
    </div>
  )
}
