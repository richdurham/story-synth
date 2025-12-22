# Story Synth - Project TODO

## Backend API Endpoints
- [x] GET /game/config - Retrieve player roles, issues, and global variables
- [x] GET /game/state - Retrieve public display and role-specific private dashboards
- [x] POST /issue/resolve - Process player choices and trigger AI story generation
- [x] POST /notes - Send private notes between players
- [x] GET /notes/{role_id} - Retrieve private notes for a player

## Google Sheets Integration
- [ ] Create Google Sheets document with game configuration
- [ ] Set up Google Sheets API connection and authentication
- [ ] Implement read operation for game roles from Google Sheet
- [ ] Implement read operation for game issues from Google Sheet
- [ ] Implement read operation for game variables from Google Sheet
- [ ] Create helper function to sync Google Sheet config to database

## Database Schema
- [x] Create users table with role-based access control (pre-built)
- [x] Create game_roles table for storing player roles
- [x] Create game_issues table for storing game issues and descriptions
- [x] Create game_variables table for storing global game state
- [x] Create game_state table for tracking current game state
- [x] Create notes table for player-to-player communication
- [x] Create game_history table for tracking narrative outcomes and state changes

## AI Narrative Generation
- [x] Integrate LLM API for story generation
- [x] Create narrative generation prompt templates
- [x] Implement story outcome generation based on player choices
- [x] Implement state mutation logic based on narrative outcomes

## Private Note-Passing System
- [x] POST /notes - Send private notes between players
- [x] GET /notes/{role_id} - Retrieve private notes for a player
- [x] Mark notes as read functionality

## Authentication & Authorization
- [x] Implement role-based authentication (player roles from game config)
- [x] Create protected procedures for role-specific actions
- [x] Implement authorization checks for note-passing and issue resolution
- [x] Set up session management for authenticated players (pre-built via Manus OAuth)

## Frontend - Core Pages
- [x] Create landing/login page
- [x] Create game lobby/role selection page
- [x] Create main game interface page with issue display
- [x] Create player dashboard with role-specific information
- [x] Create interactive decision-making UI for issue resolution
- [x] Create private notes interface

## Frontend - Components
- [ ] Issue display component with description and decision options
- [ ] Player dashboard component showing private variables
- [ ] Public issue display component for all players
- [ ] Interactive map component (if applicable)
- [ ] Notes panel component for sending/receiving messages
- [ ] Decision modal/dialog for submitting choices

## Real-Time State Synchronization
- [ ] Implement WebSocket connection for real-time updates
- [ ] Broadcast narrative outcomes to all connected players
- [ ] Broadcast state changes to all connected players
- [ ] Handle player connection/disconnection

## Testing
- [x] Write tests for API endpoints
- [x] Write tests for narrative generation logic
- [x] Write tests for state mutation logic
- [x] Write tests for authentication/authorization
- [ ] Test frontend components

## Deployment & Polish
- [x] Set up environment variables for Google Sheets and LLM API (pre-configured)
- [x] Configure CORS and security headers (pre-configured)
- [x] Optimize performance and caching (pre-configured)
- [x] Add error handling and user feedback (implemented)
- [x] Create checkpoint for initial release
