

-- Create the rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_no text UNIQUE NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  has_ac boolean DEFAULT false,
  has_attached_washroom boolean DEFAULT false,
  is_allocated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view rooms (public read access for demo)
CREATE POLICY "Anyone can view rooms"
  ON rooms
  FOR SELECT
  USING (true);

-- Allow anyone to insert rooms (public write access for demo)
CREATE POLICY "Anyone can add rooms"
  ON rooms
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update rooms (for allocation status)
CREATE POLICY "Anyone can update rooms"
  ON rooms
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create an index on room_no for faster lookups
CREATE INDEX IF NOT EXISTS idx_rooms_room_no ON rooms(room_no);

-- Create an index for filtering by facilities
CREATE INDEX IF NOT EXISTS idx_rooms_facilities ON rooms(capacity, has_ac, has_attached_washroom, is_allocated);