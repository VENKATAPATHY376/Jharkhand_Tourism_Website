import React, { useState, useEffect } from 'react';
import './ARPlaces.css';

const ARPlaces = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'ar', '360'
  const [isLoading, setIsLoading] = useState(false);

  const jharkhandPlaces = [
    {
      id: 1,
      name: "Netarhat Hills",
      description: "Queen of Chotanagpur - Famous for sunrise and sunset views",
      location: "Latehar District",
      category: "Hill Station",
      image: "/src/assets/Hiddentrail.avif",
      arModel: "netarhat_hills.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999999!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1B!2m2!1d23.800569!2d84.257454!3f90!4f0!5f0.7820865974627469",
      coordinates: { lat: 23.800569, lng: 84.257454 },
      highlights: ["Sunrise Point", "Sunset Point", "Magnolia Point", "Koel View Point"],
      bestTime: "October to March",
      elevation: "1128 meters",
      activities: ["Photography", "Trekking", "Nature Walk", "Camping"]
    },
    {
      id: 2,
      name: "Hundru Falls",
      description: "Spectacular waterfall cascading from 98 meters height",
      location: "Ranchi District", 
      category: "Waterfall",
      image: "/src/assets/Falls.jpg",
      arModel: "hundru_falls.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999998!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1C!2m2!1d23.654575!2d85.596365!3f180!4f0!5f0.7820865974627469",
      coordinates: { lat: 23.654575, lng: 85.596365 },
      highlights: ["Main Falls", "Rainbow View", "Natural Pool", "Rock Formations"],
      bestTime: "June to October",
      height: "98 meters",
      activities: ["Photography", "Swimming", "Picnic", "Rock Climbing"]
    },
    {
      id: 3,
      name: "Betla National Park",
      description: "Rich wildlife sanctuary with tigers, elephants and diverse flora",
      location: "Palamau District",
      category: "Wildlife",
      image: "/src/assets/Pics-2.jpg", 
      arModel: "betla_wildlife.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999997!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1E!2m2!1d24.197466!2d84.210738!3f270!4f0!5f0.7820865974627469",
      coordinates: { lat: 24.197466, lng: 84.210738 },
      highlights: ["Tiger Safari", "Elephant Spotting", "Watchtower Views", "Nature Trails"],
      bestTime: "November to April",
      area: "979 sq km", 
      activities: ["Safari", "Bird Watching", "Photography", "Camping"]
    },
    {
      id: 4,
      name: "Deoghar Temple Complex",
      description: "Sacred Baidyanath Jyotirlinga - One of 12 Jyotirlingas in India",
      location: "Deoghar District",
      category: "Religious",
      image: "/src/assets/Festival.jpg",
      arModel: "deoghar_temple.glb", 
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999996!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1G!2m2!1d24.484853!2d86.702068!3f90!4f-10!5f0.7820865974627469",
      coordinates: { lat: 24.484853, lng: 86.702068 },
      highlights: ["Main Temple", "Sacred Pond", "Prayer Halls", "Ancient Architecture"],
      bestTime: "October to March",
      significance: "Jyotirlinga",
      activities: ["Pilgrimage", "Meditation", "Cultural Tours", "Photography"]
    },
    {
      id: 5,
      name: "Ranchi Rock Garden",
      description: "Artistic landscape garden with rock sculptures and water features",
      location: "Ranchi District",
      category: "Garden",
      image: "/src/assets/Pics-3.jpg",
      arModel: "rock_garden.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999995!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1I!2m2!1d23.366974!2d85.330851!3f45!4f0!5f0.7820865974627469",
      coordinates: { lat: 23.366974, lng: 85.330851 },
      highlights: ["Rock Sculptures", "Water Garden", "Musical Fountain", "Art Gallery"],
      bestTime: "Year Round",
      area: "25 acres",
      activities: ["Photography", "Art Appreciation", "Family Picnic", "Evening Walks"]
    },
    {
      id: 6,
      name: "Jonha Falls",
      description: "Beautiful waterfall also known as Gautamdhara Falls",
      location: "Ranchi District",
      category: "Waterfall", 
      image: "/src/assets/Falls.jpg",
      arModel: "jonha_falls.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999994!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1K!2m2!1d23.432028!2d85.446045!3f135!4f0!5f0.7820865974627469",
      coordinates: { lat: 23.432028, lng: 85.446045 },
      highlights: ["Cascade Falls", "Natural Pool", "Scenic Valley", "Temple Ruins"],
      bestTime: "June to October",
      height: "43 meters",
      activities: ["Swimming", "Photography", "Trekking", "Meditation"]
    }
  ];

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setViewMode('360');
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleBackToGrid = () => {
    setSelectedPlace(null);
    setViewMode('grid');
  };
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'ar', '360'
  const [isLoading, setIsLoading] = useState(false);

  const jharkhandPlaces = [
    {
      id: 1,
      name: "Netarhat Hills",
      description: "Queen of Chotanagpur - Famous for sunrise and sunset views",
      location: "Latehar District",
      category: "Hill Station",
      image: "/src/assets/Hiddentrail.avif",
      arModel: "netarhat_hills.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999999!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1B!2m2!1d23.800569!2d84.257454!3f90!4f0!5f0.7820865974627469",
      coordinates: { lat: 23.800569, lng: 84.257454 },
      highlights: ["Sunrise Point", "Sunset Point", "Magnolia Point", "Koel View Point"],
      bestTime: "October to March",
      elevation: "1128 meters",
      activities: ["Photography", "Trekking", "Nature Walk", "Camping"]
    },
    {
      id: 2,
      name: "Hundru Falls",
      description: "Spectacular waterfall cascading from 98 meters height",
      location: "Ranchi District", 
      category: "Waterfall",
      image: "/src/assets/Falls.jpg",
      arModel: "hundru_falls.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999998!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1C!2m2!1d23.654575!2d85.596365!3f180!4f0!5f0.7820865974627469",
      coordinates: { lat: 23.654575, lng: 85.596365 },
      highlights: ["Main Falls", "Rainbow View", "Natural Pool", "Rock Formations"],
      bestTime: "June to October",
      height: "98 meters",
      activities: ["Photography", "Swimming", "Picnic", "Rock Climbing"]
    },
    {
      id: 3,
      name: "Betla National Park",
      description: "Rich wildlife sanctuary with tigers, elephants and diverse flora",
      location: "Palamau District",
      category: "Wildlife",
      image: "/src/assets/Pics-2.jpg", 
      arModel: "betla_wildlife.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999997!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1E!2m2!1d24.197466!2d84.210738!3f270!4f0!5f0.7820865974627469",
      coordinates: { lat: 24.197466, lng: 84.210738 },
      highlights: ["Tiger Safari", "Elephant Spotting", "Watchtower Views", "Nature Trails"],
      bestTime: "November to April",
      area: "979 sq km", 
      activities: ["Safari", "Bird Watching", "Photography", "Camping"]
    },
    {
      id: 4,
      name: "Deoghar Temple Complex",
      description: "Sacred Baidyanath Jyotirlinga - One of 12 Jyotirlingas in India",
      location: "Deoghar District",
      category: "Religious",
      image: "/src/assets/Festival.jpg",
      arModel: "deoghar_temple.glb", 
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999996!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1G!2m2!1d24.484853!2d86.702068!3f90!4f-10!5f0.7820865974627469",
      coordinates: { lat: 24.484853, lng: 86.702068 },
      highlights: ["Main Temple", "Sacred Pond", "Prayer Halls", "Ancient Architecture"],
      bestTime: "October to March",
      significance: "Jyotirlinga",
      activities: ["Pilgrimage", "Meditation", "Cultural Tours", "Photography"]
    },
    {
      id: 5,
      name: "Ranchi Rock Garden",
      description: "Artistic landscape garden with rock sculptures and water features",
      location: "Ranchi District",
      category: "Garden",
      image: "/src/assets/Pics-3.jpg",
      arModel: "rock_garden.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1699999999995!6m8!1m7!1sCAoSLEFGMVFpcE1QN1BfUTN3ck1I!2m2!1d23.366974!2d85.330851!3f45!4f0!5f0.7820865974627469", 
      highlights: ["Rock Sculptures", "Water Garden", "Musical Fountain", "Art Gallery"],
      bestTime: "Year Round",
      area: "25 acres",
      activities: ["Photography", "Art Appreciation", "Family Picnic", "Evening Walks"]
    },
    {
      id: 6,
      name: "Jonha Falls",
      description: "Beautiful waterfall also known as Gautamdhara Falls",
      location: "Ranchi District",
      category: "Waterfall", 
      image: "/src/assets/Falls.jpg",
      arModel: "jonha_falls.glb",
      panorama360: "https://www.google.com/maps/embed?pb=!4v1641234567894!6m8!1m7!1sCAoSLEFGMVFpcE9fVXB4eFU!2m2!1d23.3!2d85.4!3f0!4f0!5f0.7820865974627469",
      highlights: ["Cascade Falls", "Natural Pool", "Scenic Valley", "Temple Ruins"],
      bestTime: "June to October",
      height: "43 meters",
      activities: ["Swimming", "Photography", "Trekking", "Meditation"]
    }
  ];

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setViewMode('360');
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleBackToGrid = () => {
    setSelectedPlace(null);
    setViewMode('grid');
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Hill Station': return '🏔️';
      case 'Waterfall': return '💧';
      case 'Wildlife': return '🐅';
      case 'Religious': return '🛕';
      case 'Garden': return '🌺';
      default: return '📍';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Hill Station': return '#10b981';
      case 'Waterfall': return '#3b82f6'; 
      case 'Wildlife': return '#f59e0b';
      case 'Religious': return '#8b5cf6';
      case 'Garden': return '#ec4899';
      default: return '#6b7280';
    }
  };

  if (viewMode === 'grid') {
    return (
      <div className="ar-places-container">
        <header className="ar-header">
          <div className="header-content">
            <button className="back-btn" onClick={() => window.navigateToHome && window.navigateToHome()}>
              ← Back to Home
            </button>
            <div className="header-title">
              <h1>🥽 Explore Jharkhand in AR & 360°</h1>
              <p>Experience the beauty of Jharkhand through immersive virtual tours</p>
            </div>
          </div>
        </header>

        <div className="places-grid">
          {jharkhandPlaces.map((place) => (
            <div 
              key={place.id} 
              className="place-card"
              onClick={() => handlePlaceSelect(place)}
            >
              <div className="place-image">
                <img src={place.image} alt={place.name} onError={(e) => {
                  e.target.src = '/src/assets/image.png';
                }} />
                <div className="place-category" style={{ backgroundColor: getCategoryColor(place.category) }}>
                  {getCategoryIcon(place.category)} {place.category}
                </div>
                <div className="view-modes">
                  <span className="mode-badge ar">🥽 AR</span>
                  <span className="mode-badge vr">🌐 360°</span>
                </div>
              </div>
              
              <div className="place-info">
                <h3>{place.name}</h3>
                <p className="description">{place.description}</p>
                <p className="location">📍 {place.location}</p>
                
                <div className="place-details">
                  <div className="detail">
                    <span className="label">Best Time:</span>
                    <span className="value">{place.bestTime}</span>
                  </div>
                  {place.elevation && (
                    <div className="detail">
                      <span className="label">Elevation:</span>
                      <span className="value">{place.elevation}</span>
                    </div>
                  )}
                  {place.height && (
                    <div className="detail">
                      <span className="label">Height:</span>
                      <span className="value">{place.height}</span>
                    </div>
                  )}
                </div>

                <div className="activities">
                  {place.activities.map((activity, index) => (
                    <span key={index} className="activity-tag">{activity}</span>
                  ))}
                </div>

                <button className="explore-btn">
                  Explore in AR/360° →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedPlace) {
    return (
      <div className="ar-viewer-container">
        <header className="viewer-header">
          <button className="back-btn" onClick={handleBackToGrid}>
            ← Back to Places
          </button>
          <div className="place-title">
            <h2>{getCategoryIcon(selectedPlace.category)} {selectedPlace.name}</h2>
            <p>{selectedPlace.location}</p>
          </div>
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === '360' ? 'active' : ''}`}
              onClick={() => setViewMode('360')}
            >
              🌐 360° View
            </button>
            <button 
              className={`view-btn ${viewMode === 'ar' ? 'active' : ''}`}
              onClick={() => setViewMode('ar')}
            >
              🥽 AR View
            </button>
          </div>
        </header>

        <div className="main-viewer-content">
          <div className="viewer-content">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading immersive experience...</p>
              </div>
            ) : (
              <>
                {viewMode === '360' && (
                  <div className="panorama-viewer">
                    <iframe
                      src={selectedPlace.panorama360}
                      width="100%"
                      height="100%"
                      style={{ border: 'none', borderRadius: '12px' }}
                      allowFullScreen
                      title={`${selectedPlace.name} 360° View`}
                    />
                    <div className="viewer-overlay">
                      <div className="controls">
                        <button className="control-btn">🔄 Rotate</button>
                        <button className="control-btn">🔍 Zoom</button>
                        <button className="control-btn">📷 Capture</button>
                        <button className="control-btn">📱 Share</button>
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === 'ar' && (
                  <div className="ar-viewer">
                    <div className="ar-instructions">
                      <h3>🥽 AR Experience Instructions</h3>
                      <ol>
                        <li>Allow camera access when prompted</li>
                        <li>Point your device camera at a flat surface</li>
                        <li>Move your device slowly to scan the area</li>
                        <li>Tap to place the 3D model of {selectedPlace.name}</li>
                      </ol>
                      <button className="start-ar-btn">Start AR Experience</button>
                    </div>
                    
                    <div className="ar-fallback">
                      <iframe
                        src="/src/ARView.html"
                        width="100%"
                        height="400px"
                        style={{ border: 'none', borderRadius: '12px' }}
                        title={`${selectedPlace.name} AR View`}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="place-info-panel">
            <div className="place-details">
              <h3>{selectedPlace.name}</h3>
              <p className="place-description">{selectedPlace.description}</p>
              <div className="place-meta">
                <span className="location">📍 {selectedPlace.location}</span>
                <span className="category">{getCategoryIcon(selectedPlace.category)} {selectedPlace.category}</span>
              </div>
            </div>
            
            <div className="quick-info">
              <div className="info-card">
                <div className="label">Best Time</div>
                <div className="value">{selectedPlace.bestTime}</div>
              </div>
              {selectedPlace.elevation && (
                <div className="info-card">
                  <div className="label">Elevation</div>
                  <div className="value">{selectedPlace.elevation}</div>
                </div>
              )}
              {selectedPlace.height && (
                <div className="info-card">
                  <div className="label">Height</div>
                  <div className="value">{selectedPlace.height}</div>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button className="action-btn primary">
                📞 Book Visit
              </button>
              <button className="action-btn">
                ℹ️ More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ARPlaces;