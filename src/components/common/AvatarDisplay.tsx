interface AvatarDisplayProps {
  avatar: string;
  name: string;
  size?: number;
  className?: string;
}

export const AvatarDisplay = ({ avatar, name, size = 36, className = '' }: AvatarDisplayProps) => {
  const isUrl = avatar.startsWith('http') || avatar.startsWith('data:');
  if (isUrl) {
    return (
      <img
        src={avatar}
        alt={name}
        referrerPolicy="no-referrer"
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block', flexShrink: 0 }}
        className={className}
      />
    );
  }
  return (
    <div className={`avatar-circle ${avatar} ${className}`} style={{ width: size, height: size, fontSize: size * 0.38, flexShrink: 0 }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
