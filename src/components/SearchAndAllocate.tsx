import { useState } from 'react';
import { Search, UserCheck, Wind, Droplet, Users, CheckCircle } from 'lucide-react';
import type { Room } from '../lib/database.types';
import { roomService } from '../services/roomService';

interface SearchAndAllocateProps {
  onRoomAllocated: () => void;
}

export function SearchAndAllocate({ onRoomAllocated }: SearchAndAllocateProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'allocate'>('search');

  const [searchCapacity, setSearchCapacity] = useState('');
  const [searchAC, setSearchAC] = useState<boolean | undefined>(undefined);
  const [searchWashroom, setSearchWashroom] = useState<boolean | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<Room[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [allocateStudents, setAllocateStudents] = useState('');
  const [allocateAC, setAllocateAC] = useState(false);
  const [allocateWashroom, setAllocateWashroom] = useState(false);
  const [allocateResult, setAllocateResult] = useState<Room | null>(null);
  const [allocateMessage, setAllocateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [allocateLoading, setAllocateLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchResults(null);

    const minCapacity = searchCapacity ? parseInt(searchCapacity) : undefined;

    const result = await roomService.searchRooms({
      minCapacity,
      needsAC: searchAC,
      needsWashroom: searchWashroom,
    });

    setSearchLoading(false);

    if (result.success) {
      setSearchResults(result.rooms || []);
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllocateMessage(null);
    setAllocateResult(null);

    const students = parseInt(allocateStudents);
    if (isNaN(students) || students < 1) {
      setAllocateMessage({ type: 'error', text: 'Please enter a valid number of students' });
      return;
    }

    setAllocateLoading(true);

    const result = await roomService.allocateRoom({
      students,
      needsAC: allocateAC,
      needsWashroom: allocateWashroom,
    });

    setAllocateLoading(false);

    if (result.success && result.room) {
      setAllocateResult(result.room);
      setAllocateMessage({ type: 'success', text: `Room ${result.room.room_no} allocated successfully!` });
      onRoomAllocated();
    } else {
      setAllocateMessage({ type: 'error', text: result.error || 'No room available' });
    }
  };

  return (
    <div className="glass-card">
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Search size={20} />
            <span>Search Rooms</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('allocate')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'allocate'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <UserCheck size={20} />
            <span>Allocate Room</span>
          </div>
        </button>
      </div>

      {activeTab === 'search' ? (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Search Available Rooms</h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="searchCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Capacity
              </label>
              <input
                type="number"
                id="searchCapacity"
                value={searchCapacity}
                onChange={(e) => setSearchCapacity(e.target.value)}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave empty for any capacity"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Facility Requirements</label>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="searchAC"
                    checked={searchAC === true}
                    onChange={() => setSearchAC(true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">AC Required</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="searchAC"
                    checked={searchAC === false}
                    onChange={() => setSearchAC(false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">No AC</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="searchAC"
                    checked={searchAC === undefined}
                    onChange={() => setSearchAC(undefined)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Any</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="searchWashroom"
                    checked={searchWashroom === true}
                    onChange={() => setSearchWashroom(true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Washroom Required</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="searchWashroom"
                    checked={searchWashroom === false}
                    onChange={() => setSearchWashroom(false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">No Washroom</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="searchWashroom"
                    checked={searchWashroom === undefined}
                    onChange={() => setSearchWashroom(undefined)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Any</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={searchLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
            >
              <Search size={20} />
              <span>{searchLoading ? 'Searching...' : 'Search Rooms'}</span>
            </button>
          </form>

          {searchResults !== null && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Search Results ({searchResults.length} found)
              </h3>
              {searchResults.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No rooms match your criteria</p>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((room) => (
                    <div
                      key={room.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">Room {room.room_no}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Users size={16} className="mr-1" />
                              Capacity: {room.capacity}
                            </span>
                            {room.has_ac && (
                              <span className="flex items-center text-blue-600">
                                <Wind size={16} className="mr-1" />
                                AC
                              </span>
                            )}
                            {room.has_attached_washroom && (
                              <span className="flex items-center text-blue-600">
                                <Droplet size={16} className="mr-1" />
                                Washroom
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          {room.is_allocated ? (
                            <span className="text-red-600 text-sm font-medium">Allocated</span>
                          ) : (
                            <span className="text-green-600 text-sm font-medium flex items-center">
                              <CheckCircle size={16} className="mr-1" />
                              Available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Allocate Room to Students</h2>

          <form onSubmit={handleAllocate} className="space-y-4">
            <div>
              <label htmlFor="allocateStudents" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Students
              </label>
              <input
                type="number"
                id="allocateStudents"
                value={allocateStudents}
                onChange={(e) => setAllocateStudents(e.target.value)}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number of students"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allocateAC}
                  onChange={(e) => setAllocateAC(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Needs Air Conditioning</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allocateWashroom}
                  onChange={(e) => setAllocateWashroom(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Needs Attached Washroom</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={allocateLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
            >
              <UserCheck size={20} />
              <span>{allocateLoading ? 'Allocating...' : 'Allocate Room'}</span>
            </button>

            {allocateMessage && (
              <div
                className={`p-4 rounded-lg ${
                  allocateMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {allocateMessage.text}
              </div>
            )}

            {allocateResult && (
              <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Allocated Room Details</h3>
                <div className="space-y-2 text-blue-800">
                  <p><strong>Room Number:</strong> {allocateResult.room_no}</p>
                  <p><strong>Capacity:</strong> {allocateResult.capacity} students</p>
                  <p><strong>Facilities:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    <li>{allocateResult.has_ac ? 'Air Conditioning' : 'No AC'}</li>
                    <li>{allocateResult.has_attached_washroom ? 'Attached Washroom' : 'No Washroom'}</li>
                  </ul>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
