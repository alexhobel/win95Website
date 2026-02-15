import { useState, useEffect } from 'react';
import './RecordCollectionView.css';
import discGif from '../assets/Gifs/disc.gif';
import skeletonGif from '../assets/Gifs/Skelletton.gif';
import hangingSkeletonGif from '../assets/Gifs/skelette_009.gif';

// Discogs API configuration
const PROXY_URL = import.meta.env.PROD 
  ? '/api/discogs' 
  : 'http://localhost:3001/api/discogs';

const RecordCollectionView = ({ onBack }) => {
  const [allCollection, setAllCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArtists, setExpandedArtists] = useState(new Set());
  const [collectionByArtist, setCollectionByArtist] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordDetails, setRecordDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
          const url = `${PROXY_URL}/collection?page=${currentPage}&folderId=${folderId}`;
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

  // Organize collection by artist (tree structure)
  useEffect(() => {
    if (allCollection.length > 0) {
      const organized = {};
      
      allCollection.forEach((item) => {
        const release = item.basic_information || item;
        const artist = release.artists?.[0]?.name || 'Unknown Artist';
        const title = release.title || 'Unknown Title';
        
        // Get release ID - from collection API, the ID is in basic_information.id
        const releaseId = release.id || item.id;
        
        if (!organized[artist]) {
          organized[artist] = [];
        }
        
        organized[artist].push({
          ...item,
          title,
          year: release.year || '?',
          cover: release.cover_image || release.thumb || '',
          format: release.formats?.[0]?.name || 'Vinyl',
          estimatedValue: item.estimated_value || release.estimated_value || null,
          releaseId: releaseId
        });
      });

      // Sort albums within each artist
      Object.keys(organized).forEach(artist => {
        organized[artist].sort((a, b) => {
          const titleA = a.title || '';
          const titleB = b.title || '';
          return titleA.localeCompare(titleB);
        });
      });

      setCollectionByArtist(organized);
      
      // Keep artists collapsed by default
      // setExpandedArtists remains empty Set
    }
  }, [allCollection]);

  // Filter collection based on search
  const getFilteredCollection = () => {
    if (!searchQuery.trim()) {
      return collectionByArtist;
    }

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.keys(collectionByArtist).forEach(artist => {
      const matchingAlbums = collectionByArtist[artist].filter(item => {
        const artistMatch = artist.toLowerCase().includes(query);
        const titleMatch = (item.title || '').toLowerCase().includes(query);
        const yearMatch = (item.year || '').toString().includes(query);
        return artistMatch || titleMatch || yearMatch;
      });

      if (matchingAlbums.length > 0) {
        filtered[artist] = matchingAlbums;
      }
    });

    return filtered;
  };

  const toggleArtist = (artist) => {
    const newExpanded = new Set(expandedArtists);
    if (newExpanded.has(artist)) {
      newExpanded.delete(artist);
    } else {
      newExpanded.add(artist);
    }
    setExpandedArtists(newExpanded);
  };

  const handleOpenContact = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Dispatch custom event to open contact form - use capture phase
    const event = new CustomEvent('openContactForm', { 
      bubbles: true, 
      cancelable: true 
    });
    window.dispatchEvent(event);
  };

  const fetchRecordDetails = async (releaseId) => {
    if (!releaseId) {
      console.error('No release ID provided');
      setError('No release ID found');
      return;
    }
    
    setLoadingDetails(true);
    setError(null);
    
    try {
      // Use the same proxy URL pattern as collection
      const url = `${PROXY_URL}/release?id=${releaseId}`;
      
      console.log('Fetching release details for ID:', releaseId, 'from URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        throw new Error(`Failed to fetch release details: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Release details received:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setRecordDetails(data);
    } catch (err) {
      console.error('Error fetching release details:', err);
      setError(`Failed to load record details: ${err.message}`);
      setRecordDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleRecordClick = (item) => {
    // Try multiple ways to get the release ID
    const release = item.basic_information || item;
    const releaseId = release.id || item.releaseId || item.id;
    
    console.log('Record clicked:', item);
    console.log('Release ID found:', releaseId);
    console.log('Full item structure:', JSON.stringify(item, null, 2));
    
    if (releaseId) {
      setSelectedRecord(item);
      fetchRecordDetails(releaseId);
    } else {
      console.error('No release ID found in item:', item);
      setError('No release ID found for this record');
    }
  };

  const closeModal = () => {
    setSelectedRecord(null);
    setRecordDetails(null);
  };

  const filteredCollection = getFilteredCollection();
  const sortedArtists = Object.keys(filteredCollection).sort((a, b) => a.localeCompare(b));

  return (
    <div className="record-collection-view">
      {/* Skeleton Background Pattern */}
      <div className="skeleton-background"></div>
      
      <div className="collection-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Website
        </button>
        <h1 className="collection-title">
          <img src={discGif} alt="disc" className="title-disc-icon" />
          RECORD COLLECTION
          <img src={discGif} alt="disc" className="title-disc-icon" />
        </h1>
        <div className="collection-stats">
          <span className="stat-badge">Artists: {sortedArtists.length}</span>
          <span className="stat-badge">Records: {allCollection.length}</span>
        </div>
        
        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            className="collection-search-input"
            placeholder="🔍 Search by artist, album, year..."
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
      </div>

      {loading && allCollection.length === 0 && (
        <div className="collection-loading">
          <img src={discGif} alt="loading" className="loading-disc" />
          <div className="loading-text">Loading collection...</div>
        </div>
      )}

      {error && (
        <div className="collection-error">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{error}</div>
        </div>
      )}

      {/* CTA Section */}
      {!loading && sortedArtists.length > 0 && (
        <div className="cta-section">
          <p className="cta-text">
            If you want to talk about records, collecting by yourself or want to trade, 
            <button className="cta-link" onClick={handleOpenContact}>
              text me
            </button>
          </p>
        </div>
      )}

      {!loading && sortedArtists.length > 0 && (
        <div className="tree-view-container">
          <div className="tree-view">
            {sortedArtists.map((artist) => {
              const albums = filteredCollection[artist];
              const isExpanded = expandedArtists.has(artist);
              
              return (
              <div key={artist} className="tree-branch">
                {/* Artist Branch */}
                <div 
                  className="artist-branch"
                  onClick={() => toggleArtist(artist)}
                >
                  <span className="branch-indicator">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                  <img src={discGif} alt="disc" className="branch-disc-icon" />
                  <span className="artist-name">{artist}</span>
                </div>
                
                {/* Albums (Leaves) */}
                {isExpanded && (
                  <div className="tree-leaves">
                    {albums.map((item, albumIndex) => (
                      <div 
                        key={item.id || `${artist}-${albumIndex}`} 
                        className="tree-leaf"
                        onClick={() => handleRecordClick(item)}
                      >
                        <img src={discGif} alt="disc" className="leaf-disc-icon" />
                        <div className="leaf-content">
                          {item.cover ? (
                            <img 
                              src={item.cover} 
                              alt={`${artist} - ${item.title}`}
                              className="album-cover-thumb"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="album-cover-placeholder">
                              <img src={discGif} alt="disc" className="placeholder-disc" />
                            </div>
                          )}
                          <div className="album-info">
                            <div className="album-title">{item.title}</div>
                            <div className="album-meta">
                              {item.year} • {item.format}
                              {item.estimatedValue && (
                                <span className="album-value"> • €{parseFloat(item.estimatedValue).toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>
      )}

      {!loading && sortedArtists.length === 0 && allCollection.length > 0 && (
        <div className="collection-no-results">
          <img src={skeletonGif} alt="skeleton" className="no-results-skeleton" />
          <div className="no-results-text">No records found matching your search.</div>
          <button 
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="record-modal-overlay" onClick={closeModal}>
          <div className="record-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>✕</button>
            
            {loadingDetails ? (
              <div className="modal-loading">
                <img src={discGif} alt="loading" className="loading-disc" />
                <div className="loading-text">Loading record details...</div>
              </div>
            ) : recordDetails ? (
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">
                    {recordDetails.artists?.[0]?.name || 'Unknown Artist'} - {recordDetails.title || 'Unknown Title'}
                  </h2>
                  {/* Hanging Skeletons on the header underline */}
                  <img src={hangingSkeletonGif} alt="skeleton" className="modal-skeleton-left" />
                  <img src={hangingSkeletonGif} alt="skeleton" className="modal-skeleton-right" />
                </div>
                
                <div className="modal-body">
                  <div className="modal-cover-section">
                    {recordDetails.images?.[0]?.uri && (
                      <img 
                        src={recordDetails.images[0].uri} 
                        alt={recordDetails.title}
                        className="modal-cover-image"
                      />
                    )}
                  </div>
                  
                  <div className="modal-details">
                    <div className="detail-row">
                      <span className="detail-label">Year:</span>
                      <span className="detail-value">{recordDetails.year || '?'}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">Label:</span>
                      <span className="detail-value">
                        {recordDetails.labels?.map((label) => 
                          `${label.name}${label.catno ? ` (${label.catno})` : ''}`
                        ).join(', ') || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">Format:</span>
                      <span className="detail-value">
                        {recordDetails.formats?.map(f => f.name).join(', ') || 'Unknown'}
                      </span>
                    </div>
                    
                    {recordDetails.genres && recordDetails.genres.length > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Genre:</span>
                        <span className="detail-value">{recordDetails.genres.join(', ')}</span>
                      </div>
                    )}
                    
                    {recordDetails.styles && recordDetails.styles.length > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Style:</span>
                        <span className="detail-value">{recordDetails.styles.join(', ')}</span>
                      </div>
                    )}
                    
                    {recordDetails.country && (
                      <div className="detail-row">
                        <span className="detail-label">Country:</span>
                        <span className="detail-value">{recordDetails.country}</span>
                      </div>
                    )}
                    
                    {recordDetails.released && (
                      <div className="detail-row">
                        <span className="detail-label">Released:</span>
                        <span className="detail-value">{recordDetails.released}</span>
                      </div>
                    )}
                    
                    {recordDetails.tracklist && recordDetails.tracklist.length > 0 && (
                      <div className="detail-section">
                        <h3 className="detail-section-title">Tracklist:</h3>
                        <div className="tracklist">
                          {recordDetails.tracklist.map((track, idx) => (
                            <div key={idx} className="track-item">
                              <span className="track-position">{track.position || `${idx + 1}.`}</span>
                              <span className="track-title">{track.title || 'Unknown'}</span>
                              {track.duration && (
                                <span className="track-duration">{track.duration}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {recordDetails.notes && (
                      <div className="detail-section">
                        <h3 className="detail-section-title">Notes:</h3>
                        <p className="detail-notes">{recordDetails.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="modal-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">{error}</div>
                <button className="modal-retry-btn" onClick={() => {
                  const release = selectedRecord.basic_information || selectedRecord;
                  const releaseId = release.id || selectedRecord.releaseId || selectedRecord.id;
                  if (releaseId) {
                    fetchRecordDetails(releaseId);
                  }
                }}>
                  Retry
                </button>
              </div>
            ) : (
              <div className="modal-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">Failed to load record details</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordCollectionView;
