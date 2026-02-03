import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { AddRoomForm } from './components/AddRoomForm';
import { RoomList } from './components/RoomList';
import { SearchAndAllocate } from './components/SearchAndAllocate';
import { roomService } from './services/roomService';
import type { Room } from './lib/database.types';

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    const result = await roomService.getAllRooms();
    if (result.success && result.rooms) {
      setRooms(result.rooms);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building2 size={48} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Smart Hostel Room Allocation</h1>
          </div>
          <p className="text-gray-600 text-lg">Efficiently manage and allocate hostel rooms</p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <AddRoomForm onRoomAdded={fetchRooms} />
              <SearchAndAllocate onRoomAllocated={fetchRooms} />
            </div>

            <div>
              <RoomList rooms={rooms} onRoomUpdated={fetchRooms} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
