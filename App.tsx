import React, { useState, useMemo } from 'react';
import MapComponent from './components/MapComponent';
import InfoPanel from './components/InfoPanel';
import { LOCATIONS } from './constants';
import { MapLocation, LocationType, MineralType } from './types';
import { Layers, Filter, AlertTriangle, Gem, Map as MapIcon, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [filterType, setFilterType] = useState<LocationType | 'ALL'>('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredLocations = useMemo(() => {
    if (filterType === 'ALL') return LOCATIONS;
    return LOCATIONS.filter(loc => loc.type === filterType);
  }, [filterType]);

  const stats = useMemo(() => {
    const conflicts = LOCATIONS.filter(l => l.type === LocationType.CONFLICT).length;
    const minerals = LOCATIONS.filter(l => l.type === LocationType.MINERAL).length;
    return { conflicts, minerals };
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-900 text-gray-100 font-sans">
      
      {/* Sidebar / Overlay Controls */}
      <div className={`absolute top-4 left-4 z-[500] flex flex-col gap-4 max-w-xs transition-opacity duration-300 ${selectedLocation ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
        
        {/* Title Card */}
        <div className="bg-gray-800/90 backdrop-blur border border-gray-700 p-4 rounded-xl shadow-xl pointer-events-auto">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-1">
            DRC Monitor
          </h1>
          <p className="text-xs text-gray-400">Resource & Conflict Intelligence</p>
          
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-gray-300">{stats.conflicts} Conflict Zones</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="text-gray-300">{stats.minerals} Mines</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/90 backdrop-blur border border-gray-700 p-2 rounded-xl shadow-xl pointer-events-auto">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setFilterType('ALL')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${filterType === 'ALL' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'hover:bg-gray-700 text-gray-400'}`}
            >
              <Layers size={18} /> All Layers
            </button>
            <button 
              onClick={() => setFilterType(LocationType.CONFLICT)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${filterType === LocationType.CONFLICT ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'hover:bg-gray-700 text-gray-400'}`}
            >
              <AlertTriangle size={18} /> Conflict Zones
            </button>
            <button 
              onClick={() => setFilterType(LocationType.MINERAL)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${filterType === LocationType.MINERAL ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' : 'hover:bg-gray-700 text-gray-400'}`}
            >
              <Gem size={18} /> Mineral Resources
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <MapComponent 
          locations={filteredLocations} 
          onLocationSelect={setSelectedLocation}
          selectedLocation={selectedLocation}
        />
        
        {/* Bottom Attribution/Legend for Mobile */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] md:hidden pointer-events-none">
           <div className="bg-gray-900/80 px-4 py-1 rounded-full text-[10px] text-gray-500 backdrop-blur">
             Select a marker for details
           </div>
        </div>
      </div>

      {/* Slide-over Info Panel */}
      <div className={`absolute top-0 right-0 h-full transition-transform duration-300 z-[1000] ${selectedLocation ? 'translate-x-0' : 'translate-x-full'}`}>
        <InfoPanel 
          location={selectedLocation} 
          onClose={() => setSelectedLocation(null)} 
        />
      </div>

    </div>
  );
};

export default App;
