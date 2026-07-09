import { useState } from 'react';
import { Image as ImageIcon, Trash2, UploadCloud, Plus } from 'lucide-react';
import type { Wallpaper, User } from '../../types';


interface WallpaperSettingsProps {
  wallpapers: Wallpaper[];
  currentWallpaper: string;
  onSelectWallpaper: (url: string) => void;
  onDeleteWallpaper: (id: string, url: string) => void;
  onUploadWallpaper: (file: File, name: string) => void;
  isUploading: boolean;
  uploadError: string;
  onAddWallpaperUrl: (name: string, url: string) => void;
  currentUser: User | null;
}

export const WallpaperSettings = ({
  wallpapers,
  currentWallpaper,
  onSelectWallpaper,
  onDeleteWallpaper,
  onUploadWallpaper,
  isUploading,
  uploadError,
  onAddWallpaperUrl,
  currentUser
}: WallpaperSettingsProps) => {
  const [uploadWpName, setUploadWpName] = useState('');
  const [customWpUrl, setCustomWpUrl] = useState('');
  const [customWpName, setCustomWpName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadWallpaper(file, uploadWpName.trim());
      setUploadWpName('');
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWpUrl.trim()) return;
    onAddWallpaperUrl(customWpName.trim(), customWpUrl.trim());
    setCustomWpUrl('');
    setCustomWpName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Background Wallpapers Grid */}
      <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageIcon size={14} color="var(--primary)" /> Select Background Wallpaper
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
          {wallpapers.map((wp) => {
            const isSelected = currentWallpaper === wp.url;
            const isCustom = !!wp.isCustom;
            return (
              <div key={wp.id} style={{ position: 'relative', height: '64px', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => onSelectWallpaper(wp.url)}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--panel-border)',
                    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.35)), url('${wp.url}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 0 10px var(--primary-glow)' : 'none'
                  }}
                >
                  {wp.name}
                </button>
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => onDeleteWallpaper(wp.id, wp.url)}
                    title="Delete Custom Wallpaper"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      border: 'none',
                      borderRadius: '4px',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                      zIndex: 2,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Image Uploader via Cloudinary */}
      <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UploadCloud size={14} color="var(--primary)" /> Cloudinary Image Uploader
        </h4>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Upload files directly to Cloudinary and sync with your workspace background library.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Wallpaper display name (optional)"
              value={uploadWpName}
              onChange={(e) => setUploadWpName(e.target.value)}
            />
          </div>

          {uploadError && (
            <div style={{ fontSize: '11px', color: '#ef4444', padding: '6px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.2)' }}>
              {uploadError}
            </div>
          )}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            border: '2px dashed var(--panel-border)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'border-color 0.2s',
            background: 'rgba(255,255,255,0.005)'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              disabled={isUploading || !currentUser}
            />
            <UploadCloud size={28} color={isUploading ? 'var(--text-muted)' : 'var(--primary)'} style={{ transition: 'all 0.2s' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              {isUploading ? 'Uploading to Cloudinary...' : 'Click to Browse & Upload'}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Supports PNG, JPG, WEBP formats</span>
          </div>
        </div>
      </div>

      {/* Fallback Paste URL Form */}
      <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Or Link Image URL</h4>
        <form onSubmit={handleUrlSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Wallpaper Name (e.g. My Beach)"
              value={customWpName}
              onChange={(e) => setCustomWpName(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/background.jpg"
              value={customWpUrl}
              onChange={(e) => setCustomWpUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '11px', gap: '4px' }}>
            <Plus size={12} /> Add via URL
          </button>
        </form>
      </div>
    </div>
  );
};
export default WallpaperSettings;
