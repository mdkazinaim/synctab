import { Clock } from 'lucide-react';

interface ClockSettingsProps {
  clockFormat24h: boolean;
  onUpdateClockFormat: (is24h: boolean) => void;
  customGreeting: string;
  onUpdateCustomGreeting: (val: string) => void;
}

export const ClockSettings = ({
  clockFormat24h,
  onUpdateClockFormat,
  customGreeting,
  onUpdateCustomGreeting
}: ClockSettingsProps) => {
  return (
    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Clock size={14} color="var(--primary)" /> Clock &amp; Greeting Customizer
      </h4>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Customize hour format and glowing clock center display greeting text.
      </p>

      {/* Clock Format */}
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Time Format</span>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          {[
            { label: '12-Hour (AM/PM)', value: false },
            { label: '24-Hour (Military)', value: true }
          ].map((fmt) => {
            const isSelected = clockFormat24h === fmt.value;
            return (
              <button
                key={String(fmt.value)}
                onClick={() => onUpdateClockFormat(fmt.value)}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--panel-border)',
                  background: isSelected ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Greeting Text */}
      <div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Greeting Text Override</span>
        <div className="form-group" style={{ marginBottom: 0, marginTop: '6px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Welcome Home, Md"
            value={customGreeting}
            onChange={(e) => onUpdateCustomGreeting(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
