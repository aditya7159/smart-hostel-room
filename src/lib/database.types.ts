export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          room_no: string;
          capacity: number;
          has_ac: boolean;
          has_attached_washroom: boolean;
          is_allocated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_no: string;
          capacity: number;
          has_ac?: boolean;
          has_attached_washroom?: boolean;
          is_allocated?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_no?: string;
          capacity?: number;
          has_ac?: boolean;
          has_attached_washroom?: boolean;
          is_allocated?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type Room = Database['public']['Tables']['rooms']['Row'];
