/*
  # Create Rooms Table for Hostel Allocation System

  ## Overview
  This migration creates the core rooms table for the Smart Hostel Room Allocation System.
  
  ## New Tables
  
  ### `rooms`
  Stores information about hostel rooms including:
  - `id` (uuid, primary key) - Unique identifier for each room
  - `room_no` (text, unique) - Room number (e.g., "101", "A-205")
  - `capacity` (integer) - Maximum number of students the room can accommodate
  - `has_ac` (boolean) - Whether the room has air conditioning
  - `has_attached_washroom` (boolean) - Whether the room has an attached washroom
  - `is_allocated` (boolean) - Whether the room is currently allocated
  - `created_at` (timestamptz) - Timestamp when the room was added
  
  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the rooms table
  - Public read access is allowed (anyone can view rooms)
  - Public write access is allowed for this demo (in production, this should be restricted)
  
  ## Notes
  - All boolean fields default to false for safety
  - Room numbers must be unique to prevent duplicates
  - Capacity must be at least 1
*/

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