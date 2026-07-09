import { Sliders } from 'lucide-react';
import type { User, LinkedGoogleAccount, Wallpaper } from '../../types';
import { ProfileSettings } from './ProfileSettings';
import { ThemeSettings } from './ThemeSettings';
import { ClockSettings } from './ClockSettings';
import { EdgeMenuSettings } from './EdgeMenuSettings';
import { LinkedAccountsSettings } from './LinkedAccountsSettings';
import { WallpaperSettings } from './WallpaperSettings';


interface CustomizePageProps {
  currentUser: User | null;
  onSaveProfile: (updates: { name?: string; email?: string; password?: string }) => Promise<void>;
  isOnline: boolean;
  profileSaving: boolean;
  profileSaveMsg: { type: 'success' | 'error'; text: string } | null;
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  accentColor: string;
  onUpdateAccentColor: (color: string) => void;
  blurIntensity: string;
  onUpdateBlurIntensity: (intensity: string) => void;
  clockFormat24h: boolean;
  onUpdateClockFormat: (is24h: boolean) => void;
  customGreeting: string;
  onUpdateCustomGreeting: (val: string) => void;
  visibleTabs: {
    bookmarks: boolean;
    notes: boolean;
    tasks: boolean;
    reminders: boolean;
    chat: boolean;
  };
  onToggleTab: (key: 'bookmarks' | 'notes' | 'tasks' | 'reminders' | 'chat', value: boolean) => void;
  linkedAccounts: LinkedGoogleAccount[];
  onUnlinkAccount: (email: string) => void;
  onLinkViaPopup: () => void;
  onLinkByEmail: (email: string) => Promise<void>;
  linkingGoogle: boolean;
  linkGoogleMsg: { type: 'success' | 'error'; text: string } | null;
  wallpapers: Wallpaper[];
  currentWallpaper: string;
  onSelectWallpaper: (url: string) => void;
  onDeleteWallpaper: (id: string, url: string) => void;
  onUploadWallpaper: (file: File, name: string) => void;
  isUploading: boolean;
  uploadError: string;
  onAddWallpaperUrl: (name: string, url: string) => void;
}

export const CustomizePage = ({
  currentUser,
  onSaveProfile,
  isOnline,
  profileSaving,
  profileSaveMsg,
  onLogout,
  isDarkMode,
  setIsDarkMode,
  accentColor,
  onUpdateAccentColor,
  blurIntensity,
  onUpdateBlurIntensity,
  clockFormat24h,
  onUpdateClockFormat,
  customGreeting,
  onUpdateCustomGreeting,
  visibleTabs,
  onToggleTab,
  linkedAccounts,
  onUnlinkAccount,
  onLinkViaPopup,
  onLinkByEmail,
  linkingGoogle,
  linkGoogleMsg,
  wallpapers,
  currentWallpaper,
  onSelectWallpaper,
  onDeleteWallpaper,
  onUploadWallpaper,
  isUploading,
  uploadError,
  onAddWallpaperUrl
}: CustomizePageProps) => {
  return (
    <div className="widget-container glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="widget-header-row">
        <div>
          <h3 className="widget-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} color="var(--primary)" /> Customize Dashboard
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Elevate your space with premium custom aesthetics, themes, backgrounds, and layout widgets.
          </p>
        </div>
      </div>

      <div className="customize-main-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '4px', marginTop: '16px' }}>
        {/* Left Column: Profile, Aesthetics, Layout & Clock Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {currentUser && (
            <ProfileSettings
              currentUser={currentUser}
              onSaveProfile={onSaveProfile}
              isOnline={isOnline}
              profileSaving={profileSaving}
              profileSaveMsg={profileSaveMsg}
              onLogout={onLogout}
            />
          )}

          <ThemeSettings
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            accentColor={accentColor}
            onUpdateAccentColor={onUpdateAccentColor}
            blurIntensity={blurIntensity}
            onUpdateBlurIntensity={onUpdateBlurIntensity}
          />

          <ClockSettings
            clockFormat24h={clockFormat24h}
            onUpdateClockFormat={onUpdateClockFormat}
            customGreeting={customGreeting}
            onUpdateCustomGreeting={onUpdateCustomGreeting}
          />

          <EdgeMenuSettings
            visibleTabs={visibleTabs}
            onToggleTab={onToggleTab}
          />
        </div>

        {/* Right Column: Linked Accounts, Wallpaper Management & Cloudinary Image Uploads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {currentUser && (
            <LinkedAccountsSettings
              linkedAccounts={linkedAccounts}
              onUnlinkAccount={onUnlinkAccount}
              onLinkViaPopup={onLinkViaPopup}
              onLinkByEmail={onLinkByEmail}
              isOnline={isOnline}
              linkingGoogle={linkingGoogle}
              linkGoogleMsg={linkGoogleMsg}
              onLogout={onLogout}
            />
          )}

          <WallpaperSettings
            wallpapers={wallpapers}
            currentWallpaper={currentWallpaper}
            onSelectWallpaper={onSelectWallpaper}
            onDeleteWallpaper={onDeleteWallpaper}
            onUploadWallpaper={onUploadWallpaper}
            isUploading={isUploading}
            uploadError={uploadError}
            onAddWallpaperUrl={onAddWallpaperUrl}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
};
export default CustomizePage;
