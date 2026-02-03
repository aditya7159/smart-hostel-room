import { supabase } from '../lib/supabase';
import type { Room } from '../lib/database.types';

export interface AddRoomData {
  roomNo: string;
  capacity: number;
  hasAC: boolean;
  hasAttachedWashroom: boolean;
}

export interface SearchFilters {
  minCapacity?: number;
  needsAC?: boolean;
  needsWashroom?: boolean;
}

export interface AllocateRoomParams {
  students: number;
  needsAC: boolean;
  needsWashroom: boolean;
}

export const roomService = {
  async addRoom(data: AddRoomData): Promise<{ success: boolean; room?: Room; error?: string }> {
    try {
      const { data: room, error } = await supabase
        .from('rooms')
        .insert({
          room_no: data.roomNo,
          capacity: data.capacity,
          has_ac: data.hasAC,
          has_attached_washroom: data.hasAttachedWashroom,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'Room number already exists' };
        }
        return { success: false, error: error.message };
      }

      return { success: true, room };
    } catch (error) {
      return { success: false, error: 'Failed to add room' };
    }
  },

  async getAllRooms(): Promise<{ success: boolean; rooms?: Room[]; error?: string }> {
    try {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_no', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, rooms: rooms || [] };
    } catch (error) {
      return { success: false, error: 'Failed to fetch rooms' };
    }
  },

  async searchRooms(filters: SearchFilters): Promise<{ success: boolean; rooms?: Room[]; error?: string }> {
    try {
      let query = supabase.from('rooms').select('*');

      if (filters.minCapacity !== undefined && filters.minCapacity > 0) {
        query = query.gte('capacity', filters.minCapacity);
      }

      if (filters.needsAC !== undefined) {
        query = query.eq('has_ac', filters.needsAC);
      }

      if (filters.needsWashroom !== undefined) {
        query = query.eq('has_attached_washroom', filters.needsWashroom);
      }

      query = query.order('capacity', { ascending: true });

      const { data: rooms, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, rooms: rooms || [] };
    } catch (error) {
      return { success: false, error: 'Failed to search rooms' };
    }
  },

  async allocateRoom(params: AllocateRoomParams): Promise<{ success: boolean; room?: Room; error?: string }> {
    try {
      let query = supabase
        .from('rooms')
        .select('*')
        .eq('is_allocated', false)
        .gte('capacity', params.students);

      if (params.needsAC) {
        query = query.eq('has_ac', true);
      }

      if (params.needsWashroom) {
        query = query.eq('has_attached_washroom', true);
      }

      query = query.order('capacity', { ascending: true }).limit(1);

      const { data: rooms, error: searchError } = await query;

      if (searchError) {
        return { success: false, error: searchError.message };
      }

      if (!rooms || rooms.length === 0) {
        return { success: false, error: 'No room available' };
      }

      const selectedRoom = rooms[0];

      const { data: updatedRoom, error: updateError } = await supabase
        .from('rooms')
        .update({ is_allocated: true })
        .eq('id', selectedRoom.id)
        .select()
        .single();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, room: updatedRoom };
    } catch (error) {
      return { success: false, error: 'Failed to allocate room' };
    }
  },

  async deallocateRoom(roomId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_allocated: false })
        .eq('id', roomId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to deallocate room' };
    }
  },
};
