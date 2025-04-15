# FlashMind

[![Astro](https://img.shields.io/badge/Astro-5-orange.svg)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node-22.14.0-green.svg)](https://nodejs.org)

FlashMind is a web application that revolutionizes the learning process through AI-powered flashcard generation and spaced repetition learning. It aims to make the creation of high-quality educational flashcards effortless and accessible to everyone.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Features

- 🤖 **AI-Powered Flashcard Generation**
  - Generate flashcards from text input (up to 10,000 characters)
  - Create 1-200 flashcards per generation
  - Automatic length validation and optimization

- ✏️ **Flashcard Management**
  - Accept, reject, or edit generated flashcards
  - Regenerate only missing flashcards

- 👤 **User Account System**
  - Secure registration and authentication
  - Personal flashcard collection management
  - Activity tracking and metadata logging

- 📚 **Spaced Repetition Learning**
  - Integration with proven spaced repetition algorithms

## Tech Stack

### Frontend
- **Astro 5** - Core framework for fast, efficient pages
- **React 19** - Interactive component development
- **TypeScript 5** - Type-safe development
- **Tailwind 4** - Utility-first styling
- **Shadcn/ui** - Accessible React components

### Backend
- **Supabase**
  - PostgreSQL database
  - Built-in authentication
  - Backend-as-a-Service SDK

### AI Integration
- **OpenRouter.ai** - Access to various AI models
  - OpenAI
  - Anthropic
  - Google
  - Cost management and API limits

### DevOps
- **GitHub Actions** - CI/CD pipelines
- **Docker** - Containerization
- **DigitalOcean** - Hosting

## Getting Started

### Prerequisites

- Node.js 22.14.0
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/flashmind.git
cd flashmind
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code

## Project Scope

### MVP Features
- Web application with basic user authentication
- AI-powered flashcard generation
- Manual flashcard editing and management
- Basic spaced repetition algorithm integration

### Future Plans
- Advanced spaced repetition algorithm
- PDF/DOCX import
- Flashcard sharing
- Mobile applications
- Educational platform integrations

### Current Limitations
- Maximum 10,000 characters per text input
- Maximum 200 flashcards per generation
- Limited to web platform

## Project Status

The project is currently in MVP development phase. Success metrics include:

- 75% AI-generated flashcard acceptance rate
- 75% of all flashcards created through AI generation
- Average collection creation time under 5 minutes
- 100+ weekly active users within first 2 months
- API error rate below 2% monthly

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For more information about the project, please contact the development team. 