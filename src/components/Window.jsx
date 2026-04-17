import { useState, useRef, useEffect } from "react";
import {
  Button,
  ScrollView,
  Window as R95Window,
  WindowContent,
  WindowHeader,
} from "react95";
import PDFViewer from "./PDFViewer";
import BrowserViewer from "./BrowserViewer";
import FolderViewer from "./FolderViewer";
import MusicMaker from "./MusicMaker";
import MixerWindow from "./MixerWindow";
import ReverbWindow from "./ReverbWindow";
import ContactForm from "./ContactForm";
import SEOGeoChecker from "./SEOGeoChecker";
import DisplayProperties from "./DisplayProperties";
import "./Window.css";

const Window = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  isSelected,
  isActive,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [cursorType, setCursorType] = useState("default");
  const windowRef = useRef(null);
  const RESIZE_THRESHOLD = 8; // pixels from edge to trigger resize

  // Handle resize
  useEffect(() => {
    const handleResizeMove = (e) => {
      if (isResizing && resizeDirection && !window.maximized) {
        const deltaX = e.clientX - resizeStart.mouseX;
        const deltaY = e.clientY - resizeStart.mouseY;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.windowX;
        let newY = resizeStart.windowY;

        // Handle horizontal resizing
        if (resizeDirection.includes("e")) {
          newWidth = resizeStart.width + deltaX;
        } else if (resizeDirection.includes("w")) {
          newWidth = resizeStart.width - deltaX;
          newX = resizeStart.windowX + deltaX;
        }

        // Handle vertical resizing
        if (resizeDirection.includes("s")) {
          newHeight = resizeStart.height + deltaY;
        } else if (resizeDirection.includes("n")) {
          newHeight = resizeStart.height - deltaY;
          newY = resizeStart.windowY + deltaY;
        }

        if (onResize) {
          onResize(newWidth, newHeight, newX, newY);
        }
      }
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      setCursorType("default");
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeUp);
      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeUp);
      };
    }
  }, [
    isResizing,
    resizeDirection,
    resizeStart,
    window.maximized,
    window.x,
    window.y,
    onResize,
  ]);

  // Handle mouse move for cursor detection
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging || isResizing || window.maximized) return;

      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;

        // Check if near edges
        const nearLeft = x < RESIZE_THRESHOLD;
        const nearRight = x > width - RESIZE_THRESHOLD;
        const nearTop = y < RESIZE_THRESHOLD;
        const nearBottom = y > height - RESIZE_THRESHOLD;

        // Determine cursor type
        if (nearTop && nearLeft) {
          setCursorType("nw-resize");
        } else if (nearTop && nearRight) {
          setCursorType("ne-resize");
        } else if (nearBottom && nearLeft) {
          setCursorType("sw-resize");
        } else if (nearBottom && nearRight) {
          setCursorType("se-resize");
        } else if (nearTop) {
          setCursorType("n-resize");
        } else if (nearBottom) {
          setCursorType("s-resize");
        } else if (nearLeft) {
          setCursorType("w-resize");
        } else if (nearRight) {
          setCursorType("e-resize");
        } else {
          setCursorType("default");
        }
      }
    };

    if (!window.maximized) {
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isDragging, isResizing, window.maximized]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !window.maximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onMove(newX, newY);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && !window.maximized) {
        e.preventDefault();
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;
        onMove(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset, window.maximized, onMove]);

  const handleMouseDown = (e) => {
    if (windowRef.current && !window.maximized) {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) return;

      const rect = windowRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      // Check if clicking on resize edge
      const nearLeft = x < RESIZE_THRESHOLD;
      const nearRight = x > width - RESIZE_THRESHOLD;
      const nearTop = y < RESIZE_THRESHOLD;
      const nearBottom = y > height - RESIZE_THRESHOLD;

      // Determine resize direction first (before checking title bar)
      let direction = "";
      if (nearTop) direction += "n";
      if (nearBottom) direction += "s";
      if (nearLeft) direction += "w";
      if (nearRight) direction += "e";

      // If clicking on a resize edge, always allow resizing (even if in title bar area)
      if (direction) {
        // Start resizing
        setIsResizing(true);
        setResizeDirection(direction);
        setResizeStart({
          mouseX: e.clientX,
          mouseY: e.clientY,
          width: width,
          height: height,
          windowX: window.x,
          windowY: window.y,
        });
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Only allow dragging if clicking on title bar (not on edges)
      if (y < 30) {
        // Title bar area - allow dragging
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsDragging(true);
        onFocus();
      }
    }
  };

  const handleTouchStart = (e) => {
    if (windowRef.current && !window.maximized) {
      const isMobile = window.innerWidth <= 768;
      // Disable dragging on mobile
      if (isMobile) return;

      const touch = e.touches[0];
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      setIsDragging(true);
      onFocus();
    }
  };

  const handleHeaderMouseDown = (e) => {
    // Let resize edges work even if they overlap header area.
    handleMouseDown(e);
  };

  const title = window.content.isBrowser
    ? `${window.content.browserUrl || "http://alexanderhobelsberger.de"} - Microsoft Internet Explorer`
    : window.title;

  return (
    <div
      ref={windowRef}
      className={`window ${window.content.isPDF ? "pdf-window" : ""} ${window.content.isBrowser ? "browser-window" : ""} ${window.content.isFolder ? "folder-window" : ""} ${window.content.isMusicMaker ? "music-maker-window" : ""} ${window.content.isMixer ? "mixer-window" : ""} ${window.content.isReverb ? "reverb-window" : ""} ${window.content.isContactForm ? "contact-form-window" : ""} ${window.content.isSEOChecker ? "seo-checker-window" : ""} ${window.content.isDisplayProperties ? "display-properties-window" : ""} ${window.maximized ? "maximized" : ""} ${window.minimized ? "minimized" : ""} ${isSelected ? "selected" : ""}`}
      style={{
        left: `${window.x}px`,
        top: `${window.y}px`,
        zIndex: window.zIndex,
        width: window.width ? `${window.width}px` : undefined,
        height: window.height ? `${window.height}px` : undefined,
        cursor: cursorType,
      }}
      onClick={onFocus}
      onMouseDown={handleMouseDown}
    >
      <R95Window
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <WindowHeader
          active={!!isActive}
          onTouchStart={handleTouchStart}
          onMouseDown={handleHeaderMouseDown}
          style={{
            cursor: "default",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
          <span style={{ display: "inline-flex", gap: 2 }}>
            <Button
              size="sm"
              square
              aria-label="Minimize"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  lineHeight: "1",
                  fontWeight: "bold",
                }}
              >
                _
              </span>
            </Button>
            {!window.content.isDisplayProperties && (
              <Button
                size="sm"
                square
                aria-label={window.maximized ? "Restore" : "Maximize"}
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize();
                }}
              >
                <span style={{ fontSize: "10px", lineHeight: "1" }}>
                  {window.maximized ? "❐" : "□"}
                </span>
              </Button>
            )}
            <Button
              size="sm"
              square
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  lineHeight: "1",
                  fontWeight: "bold",
                }}
              >
                ×
              </span>
            </Button>
          </span>
        </WindowHeader>

        <WindowContent
          className={`${window.content.isPDF ? "pdf-window-body" : ""} ${window.content.isBrowser ? "browser-window-body" : ""} ${window.content.isFolder ? "folder-window-body" : ""} ${window.content.isMusicMaker ? "music-maker-window-body" : ""} ${window.content.isMixer ? "mixer-window-body" : ""} ${window.content.isReverb ? "reverb-window-body" : ""} ${window.content.isContactForm ? "contact-form-window-body" : ""} ${window.content.isSEOChecker ? "seo-checker-window-body" : ""} ${window.content.isDisplayProperties ? "display-properties-window-body" : ""}`}
          style={{ flex: 1, minHeight: 0, overflow: "hidden", padding: 0 }}
        >
          <ScrollView style={{ width: "100%", height: "100%" }}>
            {window.content.isPDF ? (
              <PDFViewer pdfPath={window.content.pdfPath} />
            ) : window.content.isBrowser ? (
              <BrowserViewer />
            ) : window.content.isFolder ? (
              <FolderViewer
                files={window.content.files || []}
                onFileOpen={window.content.onFileOpen}
              />
            ) : window.content.isMusicMaker ? (
              <MusicMaker
                drumVolume={window.content.drumVolume}
                synthVolume={window.content.synthVolume}
                onOpenMixer={window.content.onOpenMixer}
                drumReverbEnabled={window.content.drumReverbEnabled}
                drumReverbRoomSize={window.content.drumReverbRoomSize}
                drumReverbDamping={window.content.drumReverbDamping}
                drumReverbWetLevel={window.content.drumReverbWetLevel}
                drumReverbDryLevel={window.content.drumReverbDryLevel}
                synthReverbEnabled={window.content.synthReverbEnabled}
                synthReverbRoomSize={window.content.synthReverbRoomSize}
                synthReverbDamping={window.content.synthReverbDamping}
                synthReverbWetLevel={window.content.synthReverbWetLevel}
                synthReverbDryLevel={window.content.synthReverbDryLevel}
                masterReverbEnabled={window.content.masterReverbEnabled}
                masterReverbRoomSize={window.content.masterReverbRoomSize}
                masterReverbDamping={window.content.masterReverbDamping}
                masterReverbWetLevel={window.content.masterReverbWetLevel}
                masterReverbDryLevel={window.content.masterReverbDryLevel}
              />
            ) : window.content.isMixer ? (
              <MixerWindow
                drumVolume={window.content.drumVolume}
                synthVolume={window.content.synthVolume}
                onDrumVolumeChange={window.content.onDrumVolumeChange}
                onSynthVolumeChange={window.content.onSynthVolumeChange}
                onOpenDrumReverb={window.content.onOpenDrumReverb}
                onOpenSynthReverb={window.content.onOpenSynthReverb}
                onOpenMasterReverb={window.content.onOpenMasterReverb}
              />
            ) : window.content.isReverb ? (
              <ReverbWindow
                channelName={window.content.channelName}
                enabled={window.content.enabled}
                onEnabledChange={window.content.onEnabledChange}
                roomSize={window.content.roomSize}
                onRoomSizeChange={window.content.onRoomSizeChange}
                damping={window.content.damping}
                onDampingChange={window.content.onDampingChange}
                wetLevel={window.content.wetLevel}
                onWetLevelChange={window.content.onWetLevelChange}
                dryLevel={window.content.dryLevel}
                onDryLevelChange={window.content.onDryLevelChange}
              />
            ) : window.content.isContactForm ? (
              <ContactForm />
            ) : window.content.isSEOChecker ? (
              <SEOGeoChecker />
            ) : window.content.isDisplayProperties ? (
              <DisplayProperties
                onWallpaperChange={window.content.onWallpaperChange}
                onColorChange={window.content.onColorChange}
              />
            ) : (
              <div className="window-content">
                <h2>{window.content.title}</h2>
                <p>{window.content.description}</p>
                {window.content.features && (
                  <div className="features-list">
                    <h3>Services Include:</h3>
                    <ul>
                      {window.content.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="window-footer">
                  <button className="window-button">Contact Me</button>
                </div>
              </div>
            )}
          </ScrollView>
        </WindowContent>
      </R95Window>
    </div>
  );
};

export default Window;
