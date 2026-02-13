# Retro Style Portfolio Website - Windows 95 Edition

A nostalgic Windows 95-style portfolio website built with React, featuring an authentic retro desktop experience with a medieval-themed website and interactive applications.

## Features

### 🖥️ Windows 95 Desktop Interface
- **Authentic Desktop Experience** - Complete Windows 95-style desktop with draggable icons
- **Window Management** - Open, close, minimize, maximize, and drag windows just like Windows 95
- **Taskbar** - Bottom taskbar showing open windows and system time
- **Desktop Icons** - Large, pixelated icons for easy access to applications

### 🌐 Internet Explorer Browser
- **Windows 95 IE Styling** - Authentic Internet Explorer interface with menu bar, toolbar, and address bar
- **Loading Animation** - Classic Windows 95-style segmented progress bar
- **Medieval-Themed Website** - Custom retro website with Age of Empires-inspired design
- **Sword Cursor** - Custom clipart sword cursor matching the medieval theme

### 🎶 Music Maker Application
- **Drum Sequencer** - 16-step sequencer with Kick, Snare, Hi-Hat, and Clap sounds
- **UFO Synthesizer** - Unique synthesizer with waveform selection (Sine, Square, Sawtooth, Triangle)
- **Real-Time Playback** - Changes apply instantly without stopping playback
- **Mixer Subwindow** - Separate mixer window with individual volume controls for drums and synth
- **BPM Control** - Adjustable tempo from 60-200 BPM
- **Windows 95 UI** - Authentic retro controls and styling

### 📁 Personal Documents Folder
- **Folder Viewer** - Windows 95-style folder interface
- **PDF Viewer** - Built-in PDF viewer for CV and documents
- **File Management** - Click files to open them in new windows

### 🎨 Medieval-Themed Website
- **Age of Empires Aesthetic** - Retro medieval computer game design
- **Clipart Elements** - Pixelated castles, shields, crowns, and banners
- **Animated Backgrounds** - Dynamic patterns and effects
- **Hobbies Section** - Showcasing music, band, and vinyl collection
- **Discogs Integration** - Live vinyl collection data from Discogs API
- **Record Collection Viewer** - Browse and search through vinyl collection sorted by artist

### 📀 Discogs Vinyl Collection
- **API Integration** - Fetches collection data from Discogs
- **Search Functionality** - Search by artist, album, year, or format
- **Artist Filtering** - Dropdown filter to browse by artist
- **Collection Value** - Displays estimated collection value
- **Old-School Styling** - Retro presentation matching the medieval theme

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or >=22.12.0 recommended)
- npm
- Discogs API credentials (optional, for vinyl collection feature)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Discogs Setup (Optional)

If you want to use the Discogs vinyl collection feature:

1. Create a Discogs application at https://www.discogs.com/settings/developers
2. Get your Consumer Key and Consumer Secret
3. Update `discogs-proxy.js` with your credentials
4. Start the proxy server in a separate terminal:
```bash
npm run proxy
```

See `DISCOGS_SETUP.md` for detailed instructions.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Desktop.jsx              # Main desktop component with window management
│   ├── Desktop.css              # Desktop styling
│   ├── DesktopIcon.jsx          # Desktop icon component
│   ├── DesktopIcon.css          # Icon styling
│   ├── Window.jsx               # Generic window component with drag functionality
│   ├── Window.css               # Window styling
│   ├── BrowserViewer.jsx         # Internet Explorer browser component
│   ├── BrowserViewer.css        # Browser styling
│   ├── RetroWebsite.jsx         # Main website content (medieval theme)
│   ├── RetroWebsite.css         # Website styling
│   ├── MusicMaker.jsx           # Music maker application
│   ├── MusicMaker.css           # Music maker styling
│   ├── MixerWindow.jsx          # Mixer subwindow component
│   ├── MixerWindow.css          # Mixer styling
│   ├── FolderViewer.jsx         # Folder viewer component
│   ├── FolderViewer.css         # Folder styling
│   ├── PDFViewer.jsx            # PDF viewer component
│   ├── PDFViewer.css            # PDF viewer styling
│   ├── RecordCollectionView.jsx # Record collection subsite
│   ├── RecordCollectionView.css # Record collection styling
│   ├── VinylCollection.jsx      # Vinyl collection component
│   ├── VinylCollection.css      # Vinyl collection styling
│   ├── Taskbar.jsx              # Taskbar component
│   ├── Taskbar.css              # Taskbar styling
│   └── AppBar.jsx               # App bar component
├── assets/
│   ├── BrowserIcon.webp         # Browser desktop icon
│   ├── FolderIcon.png          # Folder desktop icon
│   ├── WebsiteMedia/           # Website media files
│   │   ├── Bandpicture.jpeg    # Band photo
│   │   └── VHS Trailer.mov     # Video trailer
│   └── CV .pdf                 # CV document
├── App.jsx                      # Main app component
├── main.jsx                     # Entry point
└── index.css                    # Global styles

discogs-proxy.js                 # Express proxy server for Discogs API
```

## Customization

### Adding Your CV

1. Place your CV PDF file in `src/assets/`
2. Update the import path in `src/components/Desktop.jsx`

### Modifying Desktop Icons

Edit the `services` array in `src/components/Desktop.jsx` to customize:
- Service titles
- Icons (emoji or image paths)
- Window sizes and positions
- Content types (PDF, Browser, Folder, MusicMaker)

### Customizing the Website

- **Main Website**: Edit `src/components/RetroWebsite.jsx` and `RetroWebsite.css`
- **Medieval Theme**: Modify colors, fonts, and clipart elements in `RetroWebsite.css`
- **Sections**: Add or modify sections in the website component

### Music Maker Customization

- **Drum Sounds**: Modify audio synthesis in `MusicMaker.jsx`
- **Synth Waveforms**: Add or modify waveforms in the synthesizer
- **UI Styling**: Update `MusicMaker.css` for visual changes

## Technologies Used

- **React** - UI framework with hooks
- **Vite** - Build tool and dev server
- **React95** - Windows 95 UI component library
- **Web Audio API** - For music synthesis and playback
- **Express.js** - Backend proxy server for Discogs API
- **CSS3** - Custom styling with animations and effects

## Key Features Explained

### Window Management
Windows can be dragged, minimized, maximized, and closed. Each window maintains its own state including position, size, and z-index. Subwindows (like the Mixer) automatically close when their parent window closes.

### Music Maker
The Music Maker uses Web Audio API for real-time audio synthesis. All changes (patterns, BPM, volume) apply instantly without interrupting playback. The mixer opens in a separate subwindow for independent volume control.

### Discogs Integration
The vinyl collection feature uses a Node.js proxy server to handle OAuth 1.0a authentication with Discogs API, bypassing CORS restrictions. Collection data is fetched and displayed with search and filtering capabilities.

### Medieval Theme
The website features a retro medieval computer game aesthetic inspired by Age of Empires, with pixelated clipart elements, custom cursors, and animated backgrounds.

## Browser Compatibility

- Modern browsers with Web Audio API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled

## License

This project is for personal/portfolio use.

## Credits

- React95 by React95 Team: https://github.com/React95/React95
- Discogs API: https://www.discogs.com/developers
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
