# PHPStan Guide - The PHPDoc Guide 2026 Edition

A comprehensive, interactive guide to mastering PHPStan pseudo-types and modern PHP type safety.

## 🚀 Overview

This guide teaches you how to write strict, analyzable type contracts using PHPStan's extended PHPDoc syntax. Learn to move beyond vague types like `array` and `string` to precise types like `non-empty-list<literal-string>` and `array{id: int, name: string}`.

**Live Demo:** [https://voku.github.io/PHPStanGuide/](https://voku.github.io/PHPStanGuide/)

## 📚 What You'll Learn

- String-based pseudo-types (`non-empty-string`, `literal-string`, `class-string<T>`)
- Numeric & range types (`positive-int`, `int<1, 100>`)
- Advanced array types (`list<T>`, `non-empty-list<T>`, `array{key: Type}`)
- Object types and method chaining (`$this`, `static`)
- Generics and templates (`@template T`)
- Conditional types and type assertions
- Best practices for type organization

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/voku/PHPStanGuide.git
   cd PHPStanGuide
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
PHPStanGuide/
├── components/          # React components
│   ├── CodeBlock.tsx    # Interactive code examples
│   └── MarkdownRenderer.tsx
├── services/           # Service layer (API integrations)
├── constants.tsx       # Guide content and sections
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
├── vite.config.ts     # Vite configuration
└── package.json       # Dependencies and scripts
```

## 🔍 Key Files Detector Prompt

When working with this codebase, use this prompt to quickly identify the most important files for any task:

```
Analyze the PHPStanGuide repository and identify the key files I should focus on for [specific task/feature]. 
Consider:
1. Configuration files (vite.config.ts, package.json, tsconfig.json)
2. Content files (constants.tsx for guide sections)
3. Component files (App.tsx, components/*.tsx)
4. Service files (services/*.ts)
5. Build and deployment files (.github/workflows/*.yml)

Provide a prioritized list with brief descriptions of each file's purpose.
```

## 📦 Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via inline classes)
- **Lucide React** - Icons
- **GitHub Pages** - Deployment

## 🚢 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` branch triggers a new deployment.

### Manual Deployment

To deploy manually:

```bash
npm run build
# Deploy the dist/ directory to your hosting service
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Repository:** [https://github.com/voku/PHPStanGuide](https://github.com/voku/PHPStanGuide)

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with insights from the PHPStan documentation
- Inspired by the PHP community's push for better type safety
- Designed to make learning PHP static analysis engaging and practical
