import { useState, useEffect } from 'react';
import './RecordCollectionView.css';

const RecordCollectionView = ({ onBack }) => {
  const [allCollection, setAllCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [filteredCollection, setFilteredCollection] = useState([]);
  const [allArtists, setAllArtists] = useState([]);

  // Discogs API configuration
  const PROXY_URL = 'http://localhost:3001';
  const DISCOGS_USERNAME = 'Alex_Hobel';

  // Load all records automatically
  useEffect(() => {
    const loadAllRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const allRecords = [];
        let currentPage = 1;
        let hasMore = true;
        const folderId = 0;

        while (hasMore) {
          const url = `${PROXY_URL}/api/discogs/collection?page=${currentPage}&folderId=${folderId}`;
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Proxy error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const releases = data.releases || [];
          allRecords.push(...releases);

          hasMore = data.pagination && data.pagination.page < data.pagination.pages;
          currentPage++;

          // Small delay to avoid overwhelming the API
          if (hasMore) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        setAllCollection(allRecords);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Discogs collection:', err);
        setError(`Failed to load collection: ${err.message}. Make sure the proxy server is running on ${PROXY_URL}`);
        setLoading(false);
      }
    };

    loadAllRecords();
  }, []);

  // Extract all artists and filter collection
  useEffect(() => {
    if (allCollection.length > 0) {
      const artistsSet = new Set();
      
      allCollection.forEach((item) => {
        const release = item.basic_information || item;
        const artist = release.artists?.[0]?.name || 'Unknown Artist';
        artistsSet.add(artist);
      });

      setAllArtists(Array.from(artistsSet).sort((a, b) => a.localeCompare(b)));
    }
  }, [allCollection]);

  // Filter collection based on search and artist filter
  useEffect(() => {
    let filtered = [...allCollection];

    // Filter by artist
    if (selectedArtist) {
      filtered = filtered.filter((item) => {
        const release = item.basic_information || item;
        const artist = release.artists?.[0]?.name || 'Unknown Artist';
        return artist === selectedArtist;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        const release = item.basic_information || item;
        const artist = (release.artists?.[0]?.name || '').toLowerCase();
        const title = (release.title || '').toLowerCase();
        const year = (release.year || '').toString();
        const format = (release.formats?.[0]?.name || '').toLowerCase();
        const searchText = `${artist} ${title} ${year} ${format}`.toLowerCase();
        return searchText.includes(query);
      });
    }

    // Sort by artist, then by title
    filtered.sort((a, b) => {
      const releaseA = a.basic_information || a;
      const releaseB = b.basic_information || b;
      const artistA = releaseA.artists?.[0]?.name || 'Unknown Artist';
      const artistB = releaseB.artists?.[0]?.name || 'Unknown Artist';
      
      if (artistA !== artistB) {
        return artistA.localeCompare(artistB);
      }
      
      const titleA = releaseA.title || '';
      const titleB = releaseB.title || '';
      return titleA.localeCompare(titleB);
    });

    setFilteredCollection(filtered);
  }, [searchQuery, selectedArtist, allCollection]);

  return (
    <div className="record-collection-view">
      <div className="collection-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Website
        </button>
        <h2 className="collection-title">📀 Record Collection 📀</h2>
        <div className="collection-subtitle">
          Total Artists: {allArtists.length} | Total Records: {allCollection.length}
          {(selectedArtist || searchQuery) && ` | Showing: ${filteredCollection.length} records`}
        </div>
        
        {/* Search and Filter Controls */}
        <div className="collection-controls">
          <div className="search-container">
            <input
              type="text"
              className="collection-search-input"
              placeholder="Search by artist, album, year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="filter-container">
            <label className="filter-label">Filter by Artist:</label>
            <select
              className="artist-filter-select"
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
            >
              <option value="">All Artists</option>
              {allArtists.map(artist => (
                <option key={artist} value={artist}>{artist}</option>
              ))}
            </select>
            {selectedArtist && (
              <button 
                className="filter-clear-btn"
                onClick={() => setSelectedArtist('')}
                title="Clear filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && allCollection.length === 0 && (
        <div className="collection-loading">
          <div className="loading-spinner">⏳</div>
          <div className="loading-text">Loading collection...</div>
        </div>
      )}

      {error && (
        <div className="collection-error">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{error}</div>
        </div>
      )}

      {filteredCollection.length > 0 && (
        <div className="collection-grid">
          {filteredCollection.map((item, index) => {
            const release = item.basic_information || item;
            const artist = release.artists?.[0]?.name || 'Unknown Artist';
            const title = release.title || 'Unknown Title';
            const year = release.year || '?';
            const cover = release.cover_image || release.thumb || 'https://via.placeholder.com/300x300?text=No+Image';
            const format = release.formats?.[0]?.name || 'Vinyl';
            const estimatedValue = item.estimated_value || release.estimated_value || null;

            return (
              <div key={item.id || index} className="record-item">
                <div className="record-cover-container">
                  <img 
                    src={cover} 
                    alt={`${artist} - ${title}`}
                    className="record-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                  />
                  <div className="record-overlay">
                    <div className="record-info-overlay">
                      <div className="record-artist">{artist}</div>
                      <div className="record-title">{title}</div>
                      <div className="record-year">{year}</div>
                      <div className="record-format">{format}</div>
                      {estimatedValue && (
                        <div className="record-value">€{parseFloat(estimatedValue).toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="record-details">
                  <div className="record-artist-name">{artist}</div>
                  <div className="record-album-name">{title}</div>
                  <div className="record-meta">
                    {year} • {format}
                    {estimatedValue && (
                      <span className="record-item-value"> • €{parseFloat(estimatedValue).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredCollection.length === 0 && allCollection.length > 0 && (
        <div className="collection-no-results">
          <div className="no-results-icon">🔍</div>
          <div className="no-results-text">No records found matching your search criteria.</div>
          <button 
            className="retro-button clear-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedArtist('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordCollectionView;

