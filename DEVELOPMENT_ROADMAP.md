# Story Synth - Development Roadmap

This document outlines the recommended development tasks and alternative features for Story Synth.

## Current Status

**Completed:**
- ✅ Full backend API with tRPC endpoints
- ✅ Complete database schema (7 tables)
- ✅ Frontend game interface with role selection
- ✅ AI-powered narrative generation (LLM integration)
- ✅ Private note-passing system
- ✅ Role-based authentication via Manus OAuth
- ✅ 19 comprehensive tests (all passing)
- ✅ GitHub repository setup

**In Progress:**
- 🔄 Google Sheets integration for game configuration

## Priority 1: Real-Time State Synchronization (Recommended Next)

### Overview
Implement WebSocket-based real-time multiplayer synchronization so all players see updates instantly when decisions are made and narratives are generated.

### Why This Matters
- Transforms gameplay from turn-based to truly collaborative real-time experience
- Players see immediate consequences of decisions across the kingdom
- Essential for engaging multiplayer RPG experience

### Tasks
1. **Backend WebSocket Setup**
   - Integrate Socket.IO with Express server
   - Create connection handlers for player join/leave
   - Implement room-based messaging (one room per game session)
   - Add authentication to WebSocket connections

2. **Real-Time Event Broadcasting**
   - Broadcast narrative outcomes to all connected players
   - Broadcast game state changes (variables, round progression)
   - Broadcast new issues when activated
   - Broadcast player activity (who's online, who made a decision)

3. **Frontend Integration**
   - Connect React to WebSocket via Socket.IO client
   - Update game state in real-time when events arrive
   - Add visual feedback for incoming updates (toast notifications)
   - Handle reconnection logic gracefully

### Estimated Effort
- Backend: 2-3 hours
- Frontend: 2-3 hours
- Testing: 1-2 hours
- **Total: 6-8 hours**

### Success Metrics
- All players see narrative outcomes within 1 second of generation
- Game state updates propagate to all connected clients instantly
- No data loss on player reconnection
- 95%+ WebSocket connection reliability

---

## Priority 2: Google Sheets Integration (Currently In Development)

### Overview
Allow non-technical game masters to configure game roles, issues, and variables via a Google Sheets document. The backend will read from the sheet and sync data to the database.

### Why This Matters
- Game masters don't need database access to customize scenarios
- Easy scenario creation and sharing via Google Sheets
- Enables rapid game iteration and testing
- Supports multiple game configurations

### Tasks
1. **Google Sheets API Setup**
   - Create Google Cloud project and enable Sheets API
   - Generate service account credentials
   - Set up authentication in backend

2. **Read Operations**
   - Implement function to read game roles from sheet
   - Implement function to read issues from sheet
   - Implement function to read variables from sheet
   - Add error handling and validation

3. **Sync Functionality**
   - Create sync endpoint to pull data from Google Sheets
   - Populate database tables from sheet data
   - Handle data transformations and validation
   - Add logging and error reporting

4. **Admin Documentation**
   - Document Google Sheets template structure
   - Create setup guide for game masters
   - Provide examples of game configurations

### Estimated Effort
- API setup: 1-2 hours
- Implementation: 2-3 hours
- Testing: 1-2 hours
- Documentation: 1 hour
- **Total: 5-8 hours**

### Success Metrics
- Game masters can create new scenarios in Google Sheets
- Data syncs to database without errors
- Validation catches configuration issues
- Full documentation for non-technical users

---

## Priority 3: Game Master Dashboard

### Overview
Create an admin interface for managing game rounds, creating custom scenarios, adjusting game variables, and monitoring player activity in real-time.

### Why This Matters
- Enables dynamic game progression without code changes
- Game masters can respond to player actions in real-time
- Provides visibility into game state and player decisions
- Supports multiple concurrent games

### Tasks
1. **Admin Authentication**
   - Restrict dashboard to admin users only
   - Implement role-based access control

2. **Game Management**
   - View all active games and players
   - Create/edit/delete game issues
   - Adjust game variables in real-time
   - Trigger round progression manually

3. **Monitoring & Analytics**
   - View player decisions and voting history
   - See narrative outcomes generated
   - Monitor game state changes
   - View player communication (notes)

4. **Scenario Management**
   - Create custom game scenarios
   - Save/load scenario templates
   - Share scenarios with other game masters

### Estimated Effort
- Backend endpoints: 3-4 hours
- Frontend dashboard: 4-5 hours
- Testing: 2-3 hours
- **Total: 9-12 hours**

---

## Priority 4: Narrative Outcome Display

### Overview
Create a beautiful, immersive modal/panel that displays the AI-generated narrative outcome after each decision, with animations and visual feedback.

### Why This Matters
- Makes the story progression more engaging and immersive
- Players understand how their decisions shaped the narrative
- Provides feedback on game variable changes
- Enhances overall user experience

### Tasks
1. **Outcome Modal Component**
   - Design beautiful modal for narrative display
   - Add animations for entrance/exit
   - Display narrative text with markdown formatting

2. **Variable Impact Visualization**
   - Show which variables changed and by how much
   - Use progress bars or charts to visualize changes
   - Highlight positive/negative impacts

3. **Decision Consequences**
   - Display how the decision affected the game state
   - Show who was affected by the decision
   - Display next steps or new issues

### Estimated Effort
- Component development: 2-3 hours
- Animations & styling: 1-2 hours
- Integration: 1 hour
- **Total: 4-6 hours**

---

## Priority 5: Frontend Component Tests

### Overview
Write comprehensive Vitest test coverage for all React components to ensure reliability and catch regressions early.

### Why This Matters
- Ensures UI components work correctly across changes
- Catches bugs before they reach users
- Makes refactoring safer and faster
- Improves code maintainability

### Tasks
1. **Component Tests**
   - Test GameInterface component
   - Test role selection logic
   - Test issue display
   - Test notes panel

2. **Hook Tests**
   - Test useAuth hook
   - Test custom game hooks
   - Test state management

3. **Integration Tests**
   - Test complete user flows
   - Test API integration
   - Test error handling

### Estimated Effort
- Writing tests: 3-4 hours
- Debugging: 1-2 hours
- **Total: 4-6 hours**

---

## Implementation Timeline Recommendation

### Week 1
- ✅ Google Sheets Integration (Priority 2) - **Currently In Progress**
- Real-Time Synchronization setup (Priority 1)

### Week 2
- Complete Real-Time Synchronization (Priority 1)
- Start Game Master Dashboard (Priority 3)

### Week 3
- Complete Game Master Dashboard (Priority 3)
- Narrative Outcome Display (Priority 4)

### Week 4
- Frontend Component Tests (Priority 5)
- Performance optimization
- Bug fixes and polish

---

## Technical Considerations

### Performance
- WebSocket connections should handle 100+ concurrent players
- Database queries should be optimized with proper indexing
- Google Sheets sync should be efficient (batch operations)

### Security
- Validate all Google Sheets input data
- Ensure game masters can only edit their own scenarios
- Protect sensitive game configuration

### Scalability
- Design with multiple concurrent games in mind
- Use database transactions for data consistency
- Implement caching for frequently accessed data

---

## Success Metrics

By the end of this roadmap:
- 🎮 **Multiplayer Experience**: Real-time gameplay with instant updates
- 🎯 **Ease of Use**: Non-technical game masters can create scenarios
- 📊 **Observability**: Game masters have full visibility into game state
- 📖 **Immersion**: Beautiful narrative outcomes enhance engagement
- ✅ **Reliability**: Comprehensive test coverage ensures stability

---

## Questions & Decisions

- Should we support multiple concurrent games or focus on single-game experience first?
- Should narrative outcomes be editable by game masters or always AI-generated?
- Should we implement player roles (admin, game master, player) or keep it simple?
- Should we add persistence for game history/replays?

---

## Contributing

When implementing these features:
1. Create a feature branch: `git checkout -b feature/google-sheets-integration`
2. Write tests as you go
3. Update documentation
4. Create a pull request with detailed description
5. Ensure all tests pass before merging

---

**Last Updated**: January 15, 2026
**Current Focus**: Google Sheets Integration
**Next Review**: After Google Sheets implementation complete
