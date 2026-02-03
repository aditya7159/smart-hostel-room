import { CheckCircle, XCircle, Wind, Droplet } from 'lucide-react';
import type { Room } from '../lib/database.types';
import { roomService } from '../services/roomService';

interface RoomListProps {
  rooms: Room[];
  onRoomUpdated: () => void;
}

export function RoomList({ rooms, onRoomUpdated }: RoomListProps) {
  const handleDeallocate = async (roomId: string) => {
    const result = await roomService.deallocateRoom(roomId);
    if (result.success) {
      onRoomUpdated();
    }
  };

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Rooms</h2>
        <p className="text-gray-600 text-center py-8">No rooms available. Add your first room above.</p>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        All Rooms <span className="text-sm font-normal text-gray-600">({rooms.length} total)</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facilities
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{room.room_no}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{room.capacity} students</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {room.has_ac ? (
                      <div className="flex items-center text-blue-600" title="Has AC">
                        <Wind size={18} />
                        <span className="ml-1 text-xs">AC</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400" title="No AC">
                        <Wind size={18} />
                        <span className="ml-1 text-xs">No AC</span>
                      </div>
                    )}
                    {room.has_attached_washroom ? (
                      <div className="flex items-center text-blue-600" title="Has Washroom">
                        <Droplet size={18} />
                        <span className="ml-1 text-xs">Washroom</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400" title="No Washroom">
                        <Droplet size={18} />
                        <span className="ml-1 text-xs">No Washroom</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {room.is_allocated ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle size={14} className="mr-1" />
                      Allocated
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={14} className="mr-1" />
                      Available
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {room.is_allocated && (
                    <button
                      onClick={() => handleDeallocate(room.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Deallocate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
