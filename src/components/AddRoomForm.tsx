import { useState } from 'react';
import { Plus } from 'lucide-react';
import { roomService } from '../services/roomService';

interface AddRoomFormProps {
  onRoomAdded: () => void;
}

export function AddRoomForm({ onRoomAdded }: AddRoomFormProps) {
  const [roomNo, setRoomNo] = useState('');
  const [capacity, setCapacity] = useState('');
  const [hasAC, setHasAC] = useState(false);
  const [hasAttachedWashroom, setHasAttachedWashroom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!roomNo.trim()) {
      setMessage({ type: 'error', text: 'Room number is required' });
      return;
    }

    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum < 1) {
      setMessage({ type: 'error', text: 'Capacity must be at least 1' });
      return;
    }

    setLoading(true);

    const result = await roomService.addRoom({
      roomNo: roomNo.trim(),
      capacity: capacityNum,
      hasAC,
      hasAttachedWashroom,
    });

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Room added successfully!' });
      setRoomNo('');
      setCapacity('');
      setHasAC(false);
      setHasAttachedWashroom(false);
      onRoomAdded();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add room' });
    }
  };

  return (
    <div className="glass-card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Room</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomNo" className="block text-sm font-medium text-gray-700 mb-1">
            Room Number
          </label>
          <input
            type="text"
            id="roomNo"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 101, A-205"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Number of students"
            disabled={loading}
          />
        </div>

        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          <span>{loading ? 'Adding...' : 'Add Room'}</span>
        </button>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
