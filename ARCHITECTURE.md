# Architecture Documentation

## System Architecture Overview

PredictMyFight follows a **component-based architecture** using React, implementing a clear separation of concerns across presentation, business logic, and data layers.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Header     │  │   Selector   │  │    Stats     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Prediction  │  │    Charts    │  │  Breakdown   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Prediction Algorithm Engine                  │  │
│  │  • Score Calculation                                  │  │
│  │  • Probability Computation                            │  │
│  │  • Advantage Analysis                                 │  │
│  │  • Confidence Assessment                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Fighter Database                          │  │
│  │  • Fighter Statistics                                 │  │
│  │  • Historical Performance Data                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Component Hierarchy

```
App (Root Component)
│
├── Header
│   ├── Title
│   └── Subtitle
│
├── Main Container
│   │
│   ├── Fighters Container
│   │   ├── Fighter Section 1
│   │   │   ├── FighterSelector
│   │   │   └── FighterStats
│   │   │
│   │   ├── VS Divider
│   │   │
│   │   └── Fighter Section 2
│   │       ├── FighterSelector
│   │       └── FighterStats
│   │
│   ├── Predict Button
│   │
│   └── PredictionResult (Conditional)
│       ├── Probability Display
│       ├── Winner Announcement
│       ├── StatComparisonChart
│       │   ├── Radar Chart
│       │   └── Bar Chart
│       └── PredictionBreakdown
│           ├── Confidence Badge
│           ├── Advantages List
│           └── Score Breakdown
```

## Data Flow

### Prediction Flow

```
User Action: Select Fighters
    │
    ▼
State Update: fighter1, fighter2
    │
    ▼
User Action: Click "Predict Winner"
    │
    ▼
Function Call: predictFight(fighter1, fighter2)
    │
    ├──► calculateFighterScore(fighter1)
    │    └──► Returns: fighter1Score
    │
    ├──► calculateFighterScore(fighter2)
    │    └──► Returns: fighter2Score
    │
    ├──► Calculate Probabilities
    │    └──► Returns: probabilities
    │
    ├──► getAdvantages(fighter1, fighter2)
    │    └──► Returns: advantages array
    │
    └──► Determine Confidence Level
         └──► Returns: confidenceLevel
    │
    ▼
State Update: prediction
    │
    ▼
Render: PredictionResult Component
    │
    ├──► StatComparisonChart
    │    └──► Renders: Radar & Bar Charts
    │
    └──► PredictionBreakdown
         └──► Renders: Detailed Analysis
```

## Component Responsibilities

### App Component
- **Purpose**: Root component managing application state
- **Responsibilities**:
  - State management (fighters, prediction)
  - Event handling (predict button)
  - Component orchestration

### FighterSelector Component
- **Purpose**: Fighter selection interface
- **Responsibilities**:
  - Display fighter dropdown
  - Search functionality
  - Fighter selection handling

### FighterStats Component
- **Purpose**: Display fighter statistics
- **Responsibilities**:
  - Render fighter statistics
  - Calculate derived metrics (win rate, KO rate)
  - Visual stat representation

### PredictionResult Component
- **Purpose**: Display prediction results
- **Responsibilities**:
  - Render probability display
  - Orchestrate child components
  - Winner announcement

### StatComparisonChart Component
- **Purpose**: Visual stat comparison
- **Responsibilities**:
  - Render radar chart
  - Render bar chart
  - Data transformation for charts

### PredictionBreakdown Component
- **Purpose**: Detailed prediction analysis
- **Responsibilities**:
  - Display advantages
  - Show confidence level
  - Score breakdown visualization

## State Management

### Application State

```javascript
{
  fighter1: Fighter | null,
  fighter2: Fighter | null,
  prediction: Prediction | null
}
```

### Fighter Object Structure

```javascript
{
  id: number,
  name: string,
  wins: number,
  losses: number,
  knockouts: number,
  submissions: number,
  strikingAccuracy: number,
  takedownAccuracy: number,
  image: string
}
```

### Prediction Object Structure

```javascript
{
  fighter1: {
    name: string,
    probability: string,
    score: string,
    breakdown: StatBreakdown
  },
  fighter2: {
    name: string,
    probability: string,
    score: string,
    breakdown: StatBreakdown
  },
  winner: string,
  confidenceLevel: 'High' | 'Medium' | 'Low',
  advantages: Advantage[],
  probabilityDiff: string
}
```

## Design Patterns

### 1. Component Composition
- Small, reusable components
- Single Responsibility Principle
- Props-based communication

### 2. Separation of Concerns
- Presentation: Components
- Business Logic: Utils
- Data: Data files

### 3. Functional Programming
- Pure functions
- Immutable data handling
- No side effects in calculations

## Performance Considerations

### Optimization Strategies

1. **Component Memoization**: Prevent unnecessary re-renders
2. **Lazy Loading**: Load charts only when needed
3. **Code Splitting**: Separate bundle for charts
4. **CSS Optimization**: Minimal, scoped styles

### Bundle Size

- **Initial Load**: ~150KB (gzipped)
- **Charts Library**: ~80KB (lazy loaded)
- **Total**: ~230KB

## Scalability

### Current Limitations
- Static fighter database
- Client-side only processing
- No data persistence

### Future Scalability Options
- API integration for dynamic data
- Backend service for calculations
- Database for fighter storage
- Caching strategies

## Security Considerations

### Current Implementation
- Client-side validation
- No user input sanitization needed (dropdown selection)
- No authentication required

### Future Security Needs
- API authentication
- Input validation
- XSS prevention
- CSRF protection

## Testing Strategy

### Recommended Testing Approach

1. **Unit Tests**: Individual functions
2. **Component Tests**: React component rendering
3. **Integration Tests**: Component interactions
4. **E2E Tests**: Full user workflows

### Test Coverage Goals
- Business Logic: 90%+
- Components: 80%+
- Utilities: 95%+

## Deployment Architecture

### Development
```
Local Machine → Vite Dev Server → Browser
```

### Production
```
Source Code → Vite Build → Static Files → Web Server → CDN → Users
```

## Technology Stack

### Core Technologies
- **React 18**: UI framework
- **Vite**: Build tool
- **Recharts**: Charting library

### Build Tools
- **Vite**: Fast build and HMR
- **npm**: Package management

### Styling
- **CSS3**: Custom styling
- **Responsive Design**: Mobile-first

## Future Architecture Enhancements

1. **State Management**: Redux or Zustand for complex state
2. **API Layer**: RESTful API integration
3. **Caching**: Service Worker for offline support
4. **PWA**: Progressive Web App capabilities
5. **Microservices**: Separate prediction service

