import { Palette, Sun, Moon } from 'lucide-react';

interface ThemeSettingsProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  accentColor: string;
  onUpdateAccentColor: (color: string) => void;
  blurIntensity: string;
  onUpdateBlurIntensity: (intensity: string) => void;
}

export const ThemeSettings = ({
  isDarkMode,
  setIsDarkMode,
  accentColor,
  onUpdateAccentColor,
  blurIntensity,
  onUpdateBlurIntensity
}: ThemeSettingsProps) => {
  return (
    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
      <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Palette size={14} color="var(--primary)" /> Theme &amp; Aesthetics
      </h4>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Choose theme mode, brand accent highlight, and backdrop glass blur intensity.
      </p>

      {/* Theme Mode Option */}
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Interface Theme</span>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <button
            onClick={() => setIsDarkMode(false)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              border: !isDarkMode ? '1px solid var(--primary)' : '1px solid var(--panel-border)',
              background: !isDarkMode ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
              color: !isDarkMode ? 'var(--text-primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Sun size={12} /> Light Theme
          </button>
          <button
            onClick={() => setIsDarkMode(true)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              border: isDarkMode ? '1px solid var(--primary)' : '1px solid var(--panel-border)',
              background: isDarkMode ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
              color: isDarkMode ? 'var(--text-primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Moon size={12} /> Dark Theme
          </button>
        </div>
      </div>

      {/* Accent Color Highlight */}
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Brand Accent Color</span>
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          {[
            { name: 'Violet', value: '#8b5cf6' },
            { name: 'Emerald', value: '#10b981' },
            { name: 'Blue', value: '#3b82f6' },
            { name: 'Orange', value: '#f97316' },
            { name: 'Rose', value: '#ec4899' }
          ].map((color) => {
            const isSelected = accentColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => onUpdateAccentColor(color.value)}
                title={color.name}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: color.value,
                  border: isSelected ? '2.5px solid #fff' : '1.5px solid rgba(255,255,255,0.2)',
                  boxShadow: isSelected ? `0 0 12px ${color.value}` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Glass Blur Intensity */}
      <div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Glass Blur Intensity</span>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          {[
            { label: 'Low', value: '8px' },
            { label: 'Medium', value: '20px' },
            { label: 'High', value: '40px' }
          ].map((blur) => {
            const isSelected = blurIntensity === blur.value;
            return (
              <button
                key={blur.value}
                onClick={() => onUpdateBlurIntensity(blur.value)}
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
                {blur.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
