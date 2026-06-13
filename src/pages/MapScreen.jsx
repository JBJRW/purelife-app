// src/pages/MapScreen.jsx
// PureLife Wellness Club — Mapa de Tiendas Saludables + Productores Locales
// Leaflet + Geolocation API + Overpass API (OSM) | JRMB Food Network LLC

import React, { useState, useEffect, useRef } from 'react';

const C = {
  dark: '#0F1F17', green: '#1A5C3A', mint: '#2D8653',
  light: '#5CB87A', cream: '#F5F0E8', gold: '#C9973A',
  goldL: '#E8B84B', muted: '#7A9080', red: '#C0392B',
  glass: 'rgba(255,255,255,0.07)', glassBorder: 'rgba(255,255,255,0.12)',
};
const FONT_HEAD = "'Georgia', serif";
const FONT = "'Helvetica Neue', Arial, sans-serif";

// Leaflet se carga desde CDN — verificar que esté en index.html
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

const FILTERS = [
  { id: 'all', label: 'Todo', emoji: '🗺️', osm: null },
  { id: 'organic', label: 'Orgánicos', emoji: '🌿', osm: 'organic' },
  { id: 'juice', label: 'Juguerías', emoji: '🥤', osm: 'juice_bar' },
  { id: 'market', label: 'Mercados', emoji: '🏪', osm: 'marketplace' },
  { id: 'farm', label: 'Granjas', emoji: '🚜', osm: 'farm' },
  { id: 'health', label: 'Salud', emoji: '🏥', osm: 'health_food' },
];

// Mock stores para demo (si OSM falla o modo demo)
function getMockStores(lat, lng) {
  return [
    { id: 1, name: 'Organic Fresh Market', type: 'organic', distance: '0.3 km', rating: 4.8, lat: lat + 0.002, lng: lng + 0.001, address: 'Calle Verde 12', emoji: '🌿', hours: '8am - 8pm' },
    { id: 2, name: 'Green Juice Bar', type: 'juice', distance: '0.5 km', rating: 4.6, lat: lat - 0.001, lng: lng + 0.002, address: 'Av. Salud 45', emoji: '🥤', hours: '7am - 9pm' },
    { id: 3, name: 'Mercado Agroecológico', type: 'market', distance: '0.8 km', rating: 4.9, lat: lat + 0.001, lng: lng - 0.002, address: 'Plaza Mayor s/n', emoji: '🏪', hours: 'Sáb-Dom 8am-2pm' },
    { id: 4, name: 'Finca Ecológica La Paz', type: 'farm', distance: '1.2 km', rating: 5.0, lat: lat - 0.002, lng: lng - 0.001, address: 'Camino Rural 3', emoji: '🚜', hours: 'L-V 9am - 5pm' },
    { id: 5, name: 'Natural Health Shop', type: 'health', distance: '0.6 km', rating: 4.5, lat: lat + 0.003, lng: lng + 0.003, address: 'Centro Comercial Vida', emoji: '🏥', hours: '9am - 9pm' },
  ];
}

// Buscar en Overpass API (OpenStreetMap) — tiendas reales cercanas
async function searchOSMStores(lat, lng, radius = 1500) {
  const query = `
    [out:json][timeout:15];
    (
      node["shop"="organic"](around:${radius},${lat},${lng});
      node["amenity"="juice_bar"](around:${radius},${lat},${lng});
      node["shop"="health_food"](around:${radius},${lat},${lng});
      node["amenity"="marketplace"](around:${radius},${lat},${lng});
      node["shop"="farm"](around:${radius},${lat},${lng});
      node["shop"="greengrocer"](around:${radius},${lat},${lng});
    );
    out body;
  `;
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
    });
    const data = await res.json();
    return (data.elements || []).slice(0, 20).map((el, i) => ({
      id: el.id || i,
      name: el.tags?.name || el.tags?.['name:es'] || 'Tienda saludable',
      type: el.tags?.shop || el.tags?.amenity || 'organic',
      lat: el.lat,
      lng: el.lon,
      address: el.tags?.['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}` : 'Sin dirección',
      hours: el.tags?.opening_hours || 'Consultar horario',
      rating: (4.0 + Math.random()).toFixed(1),
      distance: ((Math.sqrt(Math.pow(el.lat - lat, 2) + Math.pow(el.lon - lng, 2))) * 111).toFixed(1) + ' km',
      emoji: el.tags?.amenity === 'juice_bar' ? '🥤' : el.tags?.shop === 'organic' ? '🌿' : el.tags?.shop === 'farm' ? '🚜' : '🏪',
    }));
  } catch {
    return [];
  }
}

function StoreCard({ store, onNavigate, isActive, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: isActive ? `${C.mint}14` : C.glass,
      border: `1.5px solid ${isActive ? C.mint : C.glassBorder}`,
      borderRadius: 16, padding: '14px 16px', marginBottom: 10,
      cursor: 'pointer', transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ fontSize: 32, minWidth: 40 }}>{store.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ color: C.cream, fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{store.name}</span>
            <span style={{ color: C.goldL, fontSize: 12, fontWeight: 700, minWidth: 28 }}>⭐ {store.rating}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <span style={{ color: C.light, fontSize: 11 }}>📍 {store.distance}</span>
            <span style={{ color: C.muted, fontSize: 11 }}>⏰ {store.hours}</span>
          </div>
          {store.address && (
            <p style={{ color: C.muted, fontSize: 11, margin: '4px 0 0' }}>{store.address}</p>
          )}
        </div>
      </div>
      {isActive && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(store); }} style={{
          marginTop: 10, width: '100%', padding: '9px', borderRadius: 10, border: 'none',
          background: `linear-gradient(135deg, ${C.mint}, ${C.green})`,
          color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
        }}>
          🗺️ Cómo llegar →
        </button>
      )}
    </div>
  );
}

export default function MapScreen({ user }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [stores, setStores] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | success | denied
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeStore, setActiveStore] = useState(null);
  const [view, setView] = useState('split'); // map | list | split
  const [searchRadius, setSearchRadius] = useState(1500);
  const [isLoadingStores, setIsLoadingStores] = useState(false);

  // Inicializar mapa cuando tengamos ubicación
  useEffect(() => {
    if (!location || !mapRef.current || mapInstance.current) return;
    if (!window.L) { console.warn('Leaflet no cargado'); return; }

    mapInstance.current = window.L.map(mapRef.current, { zoomControl: false }).setView([location.lat, location.lng], 15);
    window.L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    // Tile oscuro que combina con el design system
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB © OSM', maxZoom: 19,
    }).addTo(mapInstance.current);

    // Marker del usuario
    const userIcon = window.L.divIcon({
      html: `<div style="width:20px;height:20px;background:#2D8653;border:3px solid #E8B84B;border-radius:50%;box-shadow:0 0 0 6px rgba(45,134,83,0.3)"></div>`,
      iconSize: [20, 20], iconAnchor: [10, 10], className: '',
    });
    window.L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(mapInstance.current)
      .bindPopup('<strong style="color:#0F1F17">📍 Tú estás aquí</strong>');
  }, [location]);

  // Agregar markers cuando cambien stores
  useEffect(() => {
    if (!mapInstance.current || !window.L) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const filtered = activeFilter === 'all' ? stores : stores.filter(s => s.type === activeFilter || FILTERS.find(f => f.id === activeFilter)?.osm === s.type);

    filtered.forEach(store => {
      const icon = window.L.divIcon({
        html: `<div style="font-size:24px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${store.emoji}</div>`,
        iconSize: [32, 32], iconAnchor: [16, 16], className: '',
      });
      const marker = window.L.marker([store.lat, store.lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`<div style="font-family:sans-serif;min-width:160px"><strong>${store.name}</strong><br><small>${store.address}</small><br><small>⭐ ${store.rating} · ${store.distance}</small></div>`);
      marker.on('click', () => setActiveStore(store));
      markersRef.current.push(marker);
    });
  }, [stores, activeFilter]);

  const getLocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      // Default: Miami (zona de Jorge)
      const defaultLoc = { lat: 26.1224, lng: -80.1373 };
      setLocation(defaultLoc);
      loadStores(defaultLoc.lat, defaultLoc.lng);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        setLocationStatus('success');
        loadStores(loc.lat, loc.lng);
        if (mapInstance.current) {
          mapInstance.current.setView([loc.lat, loc.lng], 15);
        }
      },
      () => {
        setLocationStatus('denied');
        const defaultLoc = { lat: 26.1224, lng: -80.1373 }; // Fort Lauderdale
        setLocation(defaultLoc);
        loadStores(defaultLoc.lat, defaultLoc.lng);
      },
      { timeout: 8000 }
    );
  };

  const loadStores = async (lat, lng) => {
    setIsLoadingStores(true);
    const osmStores = await searchOSMStores(lat, lng, searchRadius);
    const finalStores = osmStores.length > 0 ? osmStores : getMockStores(lat, lng);
    setStores(finalStores);
    setIsLoadingStores(false);
  };

  const navigateTo = (store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}&travelmode=walking`;
    window.open(url, '_blank');
  };

  const filteredStores = activeFilter === 'all'
    ? stores
    : stores.filter(s => {
        const f = FILTERS.find(f => f.id === activeFilter);
        return s.type === activeFilter || s.type === f?.osm || s.emoji === f?.emoji;
      });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', maxWidth: 480, margin: '0 auto', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 22, margin: 0 }}>🗺️ Tiendas Cercanas</h2>
            <p style={{ color: C.muted, fontSize: 12, margin: '2px 0 0' }}>
              {locationStatus === 'success' ? `✅ ${stores.length} lugares encontrados` : 'Alimentos saludables cerca de ti'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['split', 'map', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.glassBorder}`,
                background: view === v ? C.mint : 'transparent',
                color: view === v ? '#fff' : C.muted, fontSize: 13, cursor: 'pointer',
              }}>
                {v === 'split' ? '⊞' : v === 'map' ? '🗺' : '≡'}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
              whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: 20,
              border: `1.5px solid ${activeFilter === f.id ? C.mint : C.glassBorder}`,
              background: activeFilter === f.id ? `${C.mint}22` : 'transparent',
              color: activeFilter === f.id ? C.light : C.muted,
              fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
            }}>
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estado inicial — pedir ubicación */}
      {locationStatus === 'idle' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>📍</div>
          <h3 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 22, margin: '0 0 10px' }}>
            Encuentra tiendas saludables
          </h3>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Usamos tu ubicación para encontrar mercados orgánicos, juguerías y tiendas de salud cerca de ti.
          </p>
          <button onClick={getLocation} style={{
            width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            background: `linear-gradient(135deg, ${C.mint}, ${C.green})`,
            color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
          }}>
            🎯 Usar mi ubicación
          </button>
          <button onClick={() => { const d = { lat: 26.1224, lng: -80.1373 }; setLocation(d); setLocationStatus('success'); loadStores(d.lat, d.lng); }} style={{
            marginTop: 10, width: '100%', padding: '12px', borderRadius: 14,
            border: `1px solid ${C.glassBorder}`, background: 'transparent',
            color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: FONT,
          }}>
            Usar ubicación demo (Fort Lauderdale)
          </button>
        </div>
      )}

      {/* Cargando */}
      {locationStatus === 'loading' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 1s infinite' }}>🔍</div>
          <p style={{ color: C.muted, fontSize: 14 }}>Buscando tiendas saludables...</p>
        </div>
      )}

      {/* Mapa + Lista */}
      {(locationStatus === 'success' || locationStatus === 'denied') && location && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Mapa */}
          {(view === 'map' || view === 'split') && (
            <div ref={mapRef} style={{
              height: view === 'map' ? '100%' : '220px',
              flexShrink: 0, position: 'relative',
            }}>
              {isLoadingStores && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(15,31,23,0.7)',
                  zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ color: C.cream, fontSize: 14 }}>Buscando en OpenStreetMap...</div>
                </div>
              )}
            </div>
          )}

          {/* Lista */}
          {(view === 'list' || view === 'split') && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 16px' }}>
              {isLoadingStores ? (
                <div style={{ textAlign: 'center', color: C.muted, padding: 20 }}>Buscando tiendas...</div>
              ) : filteredStores.length === 0 ? (
                <div style={{ textAlign: 'center', color: C.muted, padding: 30 }}>
                  <p>No hay tiendas en esta categoría cercanas</p>
                  <button onClick={() => setActiveFilter('all')} style={{
                    marginTop: 10, padding: '8px 16px', borderRadius: 20,
                    border: `1px solid ${C.glassBorder}`, background: 'transparent',
                    color: C.light, fontSize: 12, cursor: 'pointer',
                  }}>
                    Ver todas
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ color: C.muted, fontSize: 12, margin: '0 0 10px' }}>
                    {filteredStores.length} lugares · Toca para seleccionar
                  </p>
                  {filteredStores.map(store => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      isActive={activeStore?.id === store.id}
                      onClick={() => {
                        setActiveStore(activeStore?.id === store.id ? null : store);
                        if (mapInstance.current && store.lat) {
                          mapInstance.current.flyTo([store.lat, store.lng], 17, { duration: 0.8 });
                        }
                      }}
                      onNavigate={navigateTo}
                    />
                  ))}

                  {/* Radio control */}
                  <div style={{ background: C.glass, border: `1px solid ${C.glassBorder}`, borderRadius: 14, padding: '14px 16px', marginTop: 8 }}>
                    <p style={{ color: C.muted, fontSize: 12, margin: '0 0 8px' }}>
                      Radio de búsqueda: {(searchRadius / 1000).toFixed(1)} km
                    </p>
                    <input type="range" min={500} max={5000} step={250}
                      value={searchRadius}
                      onChange={e => setSearchRadius(Number(e.target.value))}
                      style={{ width: '100%', accentColor: C.mint }}
                    />
                    <button onClick={() => loadStores(location.lat, location.lng)} style={{
                      marginTop: 8, width: '100%', padding: '9px', borderRadius: 10, border: 'none',
                      background: `${C.mint}22`, color: C.light, fontSize: 12, cursor: 'pointer', fontFamily: FONT, fontWeight: 600,
                    }}>
                      🔍 Buscar con este radio
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
