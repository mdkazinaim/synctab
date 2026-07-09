import { Layout, Trash2 } from 'lucide-react';
import type { Task, Bookmark, User } from '../../types';
import WidgetCanvas from '../../widgets/WidgetCanvas';

interface DashboardPageProps {
  activeTab: string;
  customPages: Array<{ id: string; name: string }>;
  onDeleteCustomPage: (id: string) => void;
  tasks: Task[];
  bookmarks: Bookmark[];
  isWidgetEditing: boolean;
  setIsWidgetEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isWidgetPanelOpen: boolean;
  setIsWidgetPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: User | null;
}

export const DashboardPage = ({
  activeTab,
  customPages,
  onDeleteCustomPage,
  tasks,
  bookmarks,
  isWidgetEditing,
  setIsWidgetEditing,
  isWidgetPanelOpen,
  setIsWidgetPanelOpen,
  currentUser
}: DashboardPageProps) => {
  const isCustomPage = activeTab.startsWith('page_');
  const currentPage = customPages.find((p) => p.id === activeTab);

  if (activeTab === 'dashboard') {
    return (
      <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <WidgetCanvas
          pageId="dashboard"
          tasks={tasks}
          bookmarks={bookmarks}
          isEditing={isWidgetEditing}
          setIsEditing={setIsWidgetEditing}
          isPanelOpen={isWidgetPanelOpen}
          setIsPanelOpen={setIsWidgetPanelOpen}
          currentUser={currentUser}
        />
      </div>
    );
  }

  if (isCustomPage && currentPage) {
    return (
      <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 40px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 11 }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layout size={24} color="var(--primary)" /> {currentPage.name}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Drag and place widgets to design your custom dashboard layout.
            </p>
          </div>
          <button
            onClick={() => onDeleteCustomPage(currentPage.id)}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={14} /> Delete Page
          </button>
        </div>
        <WidgetCanvas
          pageId={currentPage.id}
          tasks={tasks}
          bookmarks={bookmarks}
          isEditing={isWidgetEditing}
          setIsEditing={setIsWidgetEditing}
          isPanelOpen={isWidgetPanelOpen}
          setIsPanelOpen={setIsWidgetPanelOpen}
          currentUser={currentUser}
        />
      </div>
    );
  }

  return null;
};
export default DashboardPage;

