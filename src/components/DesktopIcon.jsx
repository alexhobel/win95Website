import { useState, useRef, useEffect } from 'react';
import './DesktopIcon.css';

const DesktopIcon = ({ icon, title, onClick, position, onPositionChange, isSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const iconRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && iconRef.current) {
        const desktop = iconRef.current.closest('.desktop-background');
        if (desktop) {
          const desktopRect = desktop.getBoundingClientRect();
          const newX = e.clientX - desktopRect.left - dragOffset.x;
          const newY = e.clientY - desktopRect.top - dragOffset.y;
          
          // Constrain to desktop bounds
          const constrainedX = Math.max(0, Math.min(newX, desktopRect.width - 100));
          const constrainedY = Math.max(0, Math.min(newY, desktopRect.height - 100));
          
          onPositionChange(constrainedX, constrainedY);
          setHasMoved(true);
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Only trigger onClick if we didn't drag
        if (!hasMoved && onClick) {
          setIsActive(true);
          onClick();
          // Remove active state after a brief moment
          setTimeout(() => setIsActive(false), 200);
        }
        setHasMoved(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, onPositionChange, onClick, hasMoved]);

  const handleMouseDown = (e) => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const desktop = iconRef.current.closest('.desktop-background');
      if (desktop) {
        // Calculate offset from the icon container, not the event target
        // This ensures consistent behavior whether clicking on image or container
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setIsDragging(true);
        setHasMoved(false);
        // Prevent default to avoid text selection and image dragging
        e.preventDefault();
      }
    }
  };

  const handleClick = () => {
    // Show active state when clicked (not dragged)
    if (!hasMoved) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 200);
    }
  };

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isDragging ? 'dragging' : ''} ${isSelected || isActive ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="desktop-icon-image">
        {typeof icon === 'string' && (icon.includes('/') || icon.includes('.')) ? (
          <img src={icon} alt={title} className="desktop-icon-img" draggable="false" />
        ) : typeof icon === 'string' ? (
          icon
        ) : (
          <img src={icon} alt={title} className="desktop-icon-img" draggable="false" />
        )}
      </div>
      <div className="desktop-icon-label">{title}</div>
    </div>
  );
};

export default DesktopIcon;

