# Autonomous Driving System

A web application for analyzing and visualizing autonomous vehicle control systems, focusing on precise steering angle prediction and speed optimization in dynamic driving conditions.

## Project Overview

This platform is designed to advance the development and validation of autonomous vehicle control systems with a primary focus on safety and reliability. The system provides real-time analysis and visualization of:

- Steering angle predictions with high accuracy
- Optimal velocity calculations for various driving conditions
- Real-time performance analysis and validation
- Comparison with ground truth data

## Key Features

### Real-time Analysis
- Live steering angle prediction with immediate visual feedback
- Dynamic speed estimation with confidence intervals
- Combined steering and speed analysis for comprehensive vehicle control
- Low-latency processing pipeline for real-world applicability

### Validation & Safety
- Ground truth comparison for prediction accuracy
- Performance monitoring under various conditions
- Real-time visualization of control decisions
- Confidence metrics for speed predictions

### Data Management
- Support for both video and image analysis
- Historical data access and review
- Random sampling for diverse scenario testing
- Organized media management system

## Technical Architecture

The application is built using modern web technologies to ensure reliable performance and real-time capabilities:

- **Frontend Framework**: Next.js with TypeScript for type safety
- **Real-time Communication**: WebSocket integration for live data streaming
- **State Management**: Custom hooks for efficient state handling
- **Visualization**: Interactive components for real-time feedback
- **Styling**: Responsive design with dark mode support

## Getting Started

1. **Prerequisites**
   ```bash
   node >= 14.0.0
   npm >= 6.0.0
   ```

2. **Installation**
   ```bash
   # Install dependencies
   npm install
   ```

3. **Development**
   ```bash
   # Start development server
   npm run dev
   ```

4. **Production**
   ```bash
   # Create production build
   npm run build
   
   # Start production server
   npm start
   ```

## Future Development

Planned enhancements focus on:
- Enhanced safety validation features
- Additional driving condition scenarios
- Expanded performance metrics
- Integration with more diverse data sources
