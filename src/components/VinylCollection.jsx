import { useState, useEffect, useCallback } from 'react';
import './VinylCollection.css';

// Discogs API configuration
// Use Vercel API route in production, localhost proxy in development
const PROXY_URL = import.meta.env.PROD 
  ? '/api/discogs' 
  : 'http://localhost:3001';
const DISCOGS_USERNAME = 'Alex_Hobel';

const VinylCollection = () => {
  const [collection, setCollection] = useState([]);
  const [allCollection, setAllCollection] = useState([]); // Store all loaded items for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionValue, setCollectionValue] = useState({ total: 0, count: 0 });

  const calculateCollectionValue = useCallback((releases) => {
    try {
      let totalValue = 0;
      let count = 0;
      
      if (!releases || !Array.isArray(releases)) return;
      
      releases.forEach((item) => {
        const release = item.basic_information || item;
        // Discogs API provides estimated_value in the release object
        if (item.estimated_value) {
          totalValue += parseFloat(item.estimated_value) || 0;
          count++;
        } else if (release && release.estimated_value) {
          totalValue += parseFloat(release.estimated_value) || 0;
          count++;
        }
      });
      
      setCollectionValue({ total: totalValue, count });
    } catch (err) {
      console.error('Error calculating collection value:', err);
    }
  }, []);

  const fetchCollection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use backend proxy to avoid CORS issues
      const folderId = 0; // Default collection folder
      const url = `${PROXY_URL}/api/discogs/collection?page=${page}&folderId=${folderId}`;

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
      
      if (page === 1) {
        setAllCollection(releases);
        setCollection(releases);
        calculateCollectionValue(releases);
      } else {
        setAllCollection(prev => {
          const updated = [...prev, ...releases];
          calculateCollectionValue(updated);
          return updated;
        });
        setCollection(prev => [...prev, ...releases]);
      }

      setHasMore(data.pagination && data.pagination.page < data.pagination.pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Discogs collection:', err);
      setError(`Failed to load collection: ${err.message}. Make sure the proxy server is running on ${PROXY_URL}`);
      setLoading(false);
    }
  }, [page, calculateCollectionValue]);

  useEffect(() => {
    // Only fetch if we have a valid page
    if (page >= 1) {
      fetchCollection();
    }
  }, [page, fetchCollection]);


  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };


  const filterCollection = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setCollection(allCollection);
      return;
    }
    
    const filtered = allCollection.filter((item) => {
      const release = item.basic_information || item;
      const artist = release.artists?.[0]?.name || '';
      const title = release.title || '';
      const year = release.year || '';
      const format = release.formats?.[0]?.name || '';
      const searchText = `${artist} ${title} ${year} ${format}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });
    
    setCollection(filtered);
  };

  return (
    <div className="vinyl-collection">
      <div className="vinyl-header">
        <h2 className="vinyl-title">📀 MY VINYL COLLECTION 📀</h2>
        <div className="vinyl-subtitle">Discogs Collection</div>
        <div className="vinyl-stats">
          <div className="vinyl-stat-item">
            <span className="stat-label">Records:</span>
            <span className="stat-value">{searchQuery ? collection.length : allCollection.length}</span>
          </div>
          {collectionValue.total > 0 && (
            <div className="vinyl-stat-item">
              <span className="stat-label">Est. Value:</span>
              <span className="stat-value">€{collectionValue.total.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div className="vinyl-search-container">
          <input
            type="text"
            className="vinyl-search-input"
            placeholder="Search by artist, album, year..."
            value={searchQuery}
            onChange={(e) => filterCollection(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="vinyl-search-clear"
              onClick={() => filterCollection('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {loading && collection.length === 0 && (
        <div className="vinyl-loading">
          <div className="loading-spinner">⏳</div>
          <div className="loading-text">Loading collection...</div>
        </div>
      )}

      {error && (
        <div className="vinyl-error">
          <div className="error-icon">⚠️</div>
          <div className="error-message">
            {error}
            <div className="error-note">
              Note: Discogs API requires authentication. Set up your API token or use a backend proxy.
            </div>
          </div>
        </div>
      )}

      {collection.length > 0 && (
        <>
          <div className="vinyl-grid">
            {collection.map((item, index) => {
              const release = item.basic_information || item;
              const artist = release.artists?.[0]?.name || 'Unknown Artist';
              const title = release.title || 'Unknown Title';
              const year = release.year || '?';
              const cover = release.cover_image || release.thumb || 'https://via.placeholder.com/300x300?text=No+Image';
              const format = release.formats?.[0]?.name || 'Vinyl';
              const estimatedValue = item.estimated_value || release.estimated_value || null;

              return (
                <div key={item.id || index} className="vinyl-item">
                  <div className="vinyl-cover-container">
                    <img 
                      src={cover} 
                      alt={`${artist} - ${title}`}
                      className="vinyl-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                    <div className="vinyl-overlay">
                      <div className="vinyl-info-overlay">
                        <div className="vinyl-artist">{artist}</div>
                        <div className="vinyl-album-title">{title}</div>
                        <div className="vinyl-year">{year}</div>
                        <div className="vinyl-format">{format}</div>
                        {estimatedValue && (
                          <div className="vinyl-value">€{parseFloat(estimatedValue).toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="vinyl-details">
                    <div className="vinyl-artist-name">{artist}</div>
                    <div className="vinyl-album-name">{title}</div>
                    <div className="vinyl-meta">
                      {year} • {format}
                      {estimatedValue && (
                        <span className="vinyl-item-value"> • €{parseFloat(estimatedValue).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="vinyl-load-more">
              <button 
                className="retro-button load-more-btn"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Records'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VinylCollection;

