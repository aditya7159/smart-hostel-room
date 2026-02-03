# Smart Hostel Room Allocation System

A web application for managing hostel rooms and automatically allocating rooms to students based on capacity and facility requirements.

## Features

- **Add Rooms**: Add new hostel rooms with details like room number, capacity, AC availability, and washroom facilities
- **View All Rooms**: Display a comprehensive list of all rooms with their current allocation status
- **Search Rooms**: Filter rooms by minimum capacity, AC requirement, and washroom requirement
- **Smart Allocation**: Automatically allocate the smallest suitable room based on student count and requirements
- **Real-time Updates**: All changes are reflected immediately across the application

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Icons**: Lucide React

## Data Model

Each room has the following properties:

| Field                  | Type    | Description                              |
|------------------------|---------|------------------------------------------|
| room_no                | string  | Unique room number                       |
| capacity               | number  | Maximum number of students               |
| has_ac                 | boolean | Whether the room has air conditioning    |
| has_attached_washroom  | boolean | Whether the room has an attached washroom|
| is_allocated           | boolean | Whether the room is currently allocated  |

## Allocation Algorithm

The system uses an optimized allocation algorithm that:

1. Filters rooms based on requirements (capacity, AC, washroom)
2. Excludes already allocated rooms
3. Selects the smallest room that meets all criteria
4. Updates the room status to allocated

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The project is already configured with Supabase. The environment variables are in the `.env` file.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This application can be deployed to any of the following platforms:

- **Vercel** (Recommended)
- Netlify
- Render
- GitHub Pages
- Any cloud hosting platform

### Deploying to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to complete deployment

## Usage

### Adding a Room

1. Navigate to the "Add New Room" form
2. Enter room number (e.g., "101", "A-205")
3. Enter capacity (number of students)
4. Select facilities (AC and/or attached washroom)
5. Click "Add Room"

### Searching for Rooms

1. Go to the "Search Rooms" tab
2. Set your search criteria:
   - Minimum capacity
   - AC requirement (Required/Not Required/Any)
   - Washroom requirement (Required/Not Required/Any)
3. Click "Search Rooms"
4. View matching rooms with their availability status

### Allocating a Room

1. Go to the "Allocate Room" tab
2. Enter the number of students
3. Check required facilities (AC and/or washroom)
4. Click "Allocate Room"
5. The system will automatically find and allocate the smallest suitable room
6. If no room is available, an error message will be displayed

### Deallocating a Room

1. View the room list
2. Find the allocated room you want to free up
3. Click "Deallocate"
4. The room becomes available for new allocations

## Project Structure

```
src/
├── components/           # React components
│   ├── AddRoomForm.tsx   # Form to add new rooms
│   ├── RoomList.tsx      # Display all rooms
│   └── SearchAndAllocate.tsx  # Search and allocation features
├── services/             # Business logic
│   └── roomService.ts    # Room management service
├── lib/                  # Configuration and types
│   ├── supabase.ts       # Supabase client
│   └── database.types.ts # TypeScript types
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## Error Handling

The application includes comprehensive error handling:

- Validation for empty fields
- Duplicate room number detection
- Invalid input handling
- Database error management
- User-friendly error messages

## Security

- Row Level Security (RLS) enabled on database
- Input validation on all forms
- Type-safe operations with TypeScript

## License

This project is created for educational purposes as part of a coding assignment.

## Author

Created as part of Round-2 Assignment for technical evaluation.