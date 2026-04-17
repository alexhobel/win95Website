import { useState, useEffect } from "react";
import {
  Monitor,
  Select,
  Frame,
  ScrollView,
  Tabs,
  Tab,
  TabBody,
  ColorInput,
  GroupBox,
} from "react95";
import "./DisplayProperties.css";

// Import GIF wallpapers
import castleGif from "../assets/Gifs/Castle.gif";
import castleOfDoomGif from "../assets/Gifs/castleofdoom.gif";
import crossGif from "../assets/Gifs/Cross.gif";
import dragonGif from "../assets/Gifs/Dragon.gif";
import dragon2Gif from "../assets/Gifs/Dragon2.gif";
import fackelGif from "../assets/Gifs/Fackel.gif";
import fireandFlameGif from "../assets/Gifs/FireandFlame.gif";
import hexeGif from "../assets/Gifs/Hexe.gif";
import lightningGif from "../assets/Gifs/Lightning.gif";
import lightning2Gif from "../assets/Gifs/lightning2.gif";
import chainGif from "../assets/Gifs/linkschainam.gif";
import magicianGif from "../assets/Gifs/Magician.gif";
import pentagramGif from "../assets/Gifs/Pentagram.gif";
import pumpkinGif from "../assets/Gifs/Pumpkin.gif";
import skeletonGif from "../assets/Gifs/skelette_009.gif";
import skellettonGif from "../assets/Gifs/Skelletton.gif";

const DisplayProperties = ({ onWallpaperChange, onColorChange }) => {
  const loadSettings = () => {
    if (typeof window === "undefined") {
      return { wallpaper: "zigzag", color: "#008080" };
    }

    const savedWallpaper = localStorage.getItem("desktopWallpaper") || "zigzag";
    const savedColor = localStorage.getItem("desktopColor") || "#008080";

    return { wallpaper: savedWallpaper, color: savedColor };
  };

  const initialSettings = loadSettings();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedWallpaper, setSelectedWallpaper] = useState(
    initialSettings.wallpaper
  );
  const [customColor, setCustomColor] = useState(initialSettings.color);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("desktopWallpaper", selectedWallpaper);
      localStorage.setItem("desktopColor", customColor);
    }
  }, [selectedWallpaper, customColor]);

  const wallpapers = [
    { value: "custom", label: "(Custom)" },
    { value: "rivets", label: "Rivets" },
    { value: "zigzag", label: "Zig-zag" },
    { value: "purple-squares", label: "Purple squares" },
    { value: "honey", label: "Honey" },
    { value: "water", label: "Water" },
    { value: "noise", label: "Noise" },
    { value: "castle", label: "Castle", gif: castleGif },
    { value: "castle-of-doom", label: "Castle of Doom", gif: castleOfDoomGif },
    { value: "cross", label: "Cross", gif: crossGif },
    { value: "dragon", label: "Dragon", gif: dragonGif },
    { value: "dragon2", label: "Dragon 2", gif: dragon2Gif },
    { value: "fackel", label: "Fackel", gif: fackelGif },
    { value: "fire-and-flame", label: "Fire and Flame", gif: fireandFlameGif },
    { value: "hexe", label: "Hexe", gif: hexeGif },
    { value: "lightning", label: "Lightning", gif: lightningGif },
    { value: "lightning2", label: "Lightning 2", gif: lightning2Gif },
    { value: "chain", label: "Chain", gif: chainGif },
    { value: "magician", label: "Magician", gif: magicianGif },
    { value: "pentagram", label: "Pentagram", gif: pentagramGif },
    { value: "pumpkin", label: "Pumpkin", gif: pumpkinGif },
    { value: "skeleton", label: "Skeleton", gif: skeletonGif },
    { value: "skelletton", label: "Skelletton", gif: skellettonGif },
  ];

  const wallpaperOptions = wallpapers.map((wp) => ({
    value: wp.value,
    label: wp.label,
  }));

  const currentWallpaperIndex = wallpapers.findIndex(
    (wp) => wp.value === selectedWallpaper
  );

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleWallpaperChange = (option) => {
    if (!option) return;

    setSelectedWallpaper(option.value);

    if (onWallpaperChange) {
      onWallpaperChange(option.value);
    }
  };

  const handleColorChange = (event) => {
    const color = event.target.value;
    setCustomColor(color);

    if (onColorChange) {
      onColorChange(color);
    }
  };

  const getBackgroundStyles = () => {
    if (selectedWallpaper === "custom") {
      return { background: customColor };
    }

    const selectedWallpaperData = wallpapers.find(
      (wp) => wp.value === selectedWallpaper
    );

    if (selectedWallpaperData?.gif) {
      return {
        backgroundImage: `url(${selectedWallpaperData.gif})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundColor: "#000",
      };
    }

    const patterns = {
      zigzag: {
        background:
          "repeating-linear-gradient(45deg, #00ced1 0px, #00ced1 20px, #9370db 20px, #9370db 40px)",
      },
      rivets: {
        background:
          "radial-gradient(circle at 20px 20px, #808080 2px, transparent 2px), radial-gradient(circle at 60px 60px, #808080 2px, transparent 2px)",
        backgroundSize: "80px 80px",
        backgroundColor: "#c0c0c0",
      },
      "purple-squares": {
        background:
          "repeating-linear-gradient(0deg, #9370db 0px, #9370db 20px, #dda0dd 20px, #dda0dd 40px), repeating-linear-gradient(90deg, #9370db 0px, #9370db 20px, #dda0dd 20px, #dda0dd 40px)",
      },
      honey: {
        background:
          "repeating-linear-gradient(60deg, #ffd700 0px, #ffd700 15px, #ffa500 15px, #ffa500 30px)",
      },
      water: {
        background:
          "repeating-linear-gradient(0deg, #00bfff 0px, #00bfff 10px, #1e90ff 10px, #1e90ff 20px, #00bfff 20px, #00bfff 30px)",
      },
      noise: {
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundColor: "#808080",
      },
    };

    return patterns[selectedWallpaper] || patterns.zigzag;
  };

  return (
    <div className="display-properties-container">
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab value={0}>Background</Tab>
        <Tab value={1}>Appearance</Tab>
        <Tab value={2}>System</Tab>
      </Tabs>

      <Frame
        variant="inside"
        style={{
          marginTop: "4px",
          flex: 1,
          minHeight: 0,
          overflow: "visible",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TabBody
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "visible",
            padding: "8px",
          }}
        >
          {activeTab === 0 && (
            <ScrollView
              style={{
                width: "100%",
                height: "100%",
                overflow: "auto",
              }}
            >
              <div className="background-tab">
                <GroupBox label="Preview" style={{ marginBottom: "12px" }}>
                  <div className="monitor-preview">
                    <Monitor backgroundStyles={getBackgroundStyles()} />
                  </div>
                </GroupBox>

                <GroupBox label="Wallpaper" style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      padding: "8px 0",
                      position: "relative",
                      overflow: "visible",
                      zIndex: 20,
                    }}
                  >
                    <Select
                      defaultValue={
                        currentWallpaperIndex >= 0 ? currentWallpaperIndex : 0
                      }
                      options={wallpaperOptions}
                      menuMaxHeight={200}
                      width={220}
                      onChange={handleWallpaperChange}
                    />
                  </div>
                </GroupBox>

                <GroupBox label="Custom color">
                  <div
                    style={{
                      padding: "8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <ColorInput
                      value={customColor}
                      onChange={handleColorChange}
                    />
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: customColor,
                        border: "1px solid #222",
                        flexShrink: 0,
                      }}
                    />
                  </div>
                </GroupBox>
              </div>
            </ScrollView>
          )}

          {activeTab === 1 && (
            <div className="appearance-tab">
              <p className="tab-placeholder">
                Appearance settings coming soon...
              </p>
            </div>
          )}

          {activeTab === 2 && (
            <div className="system-tab">
              <p className="tab-placeholder">System settings coming soon...</p>
            </div>
          )}
        </TabBody>
      </Frame>
    </div>
  );
};

export default DisplayProperties;
