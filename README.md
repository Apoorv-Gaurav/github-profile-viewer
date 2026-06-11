# 🔍 GitView — GitHub Profile Viewer

A modern, full-stack web application to explore, compare, and bookmark GitHub profiles with beautiful visualizations.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![GitHub API](https://img.shields.io/badge/GitHub-API-181717?logo=github)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🔍 **Search** — Find any GitHub user by username
- 👤 **Profile Overview** — Avatar, bio, stats, join date, and social links
- 📦 **Repository Explorer** — Filter & sort repos by language, stars, forks, date
- 📊 **Language Breakdown** — Interactive donut chart showing language usage
- 🟩 **Contribution Heatmap** — GitHub-style green squares calendar
- ⚔️ **Compare Profiles** — Side-by-side comparison of two GitHub users
- 🔖 **Bookmarks** — Save and manage favorite profiles (localStorage)
- 🎴 **Profile Card Generator** — Create & download beautiful profile cards
- 📄 **Repo Details** — README preview, commits, and language breakdown
- 🌓 **Dark/Light Mode** — System-aware theme with manual toggle
- 📱 **Responsive** — Works beautifully on all devices

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- (Optional) [GitHub Personal Access Token](https://github.com/settings/tokens)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/github-profile-viewer.git
   cd github-profile-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional but recommended)**
   
   Create a `.env.local` file in the root directory:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   ```
   
   > **Why?** Without a token, you're limited to 60 API requests/hour and can't see contribution data. With a token, you get 5,000 requests/hour and full contribution heatmaps.
   
   To create a token:
   - Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scope: `read:user`
   - Copy the token and paste it in `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in your browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with App Router |
| **React 18** | UI library |
| **Chart.js** | Language breakdown visualizations |
| **Node Cache** | Server-side API response caching |
| **html-to-image** | Profile card PNG generation |
| **GitHub REST API** | User, repo, and event data |
| **GitHub GraphQL API** | Contribution/activity data |
| **Vanilla CSS** | Custom design system with CSS variables |

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.js              # Root layout with fonts & navbar
│   ├── page.js                # Home / Search page
│   ├── globals.css            # Design system & global styles
│   ├── user/
│   │   └── [username]/
│   │       ├── page.js        # Profile page
│   │       └── repo/
│   │           └── [reponame]/
│   │               └── page.js # Repo detail page
│   ├── compare/
│   │   └── page.js            # Compare profiles
│   ├── bookmarks/
│   │   └── page.js            # Saved bookmarks
│   └── api/github/            # Backend API routes
│       ├── user/route.js
│       ├── repos/route.js
│       ├── languages/route.js
│       ├── contributions/route.js
│       ├── readme/route.js
│       └── compare/route.js
├── components/                 # Reusable React components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
└── styles/                     # Component & page CSS
```

## 📸 Screenshots

> Run the app locally to see it in action!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing the data
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Next.js](https://nextjs.org/) for the amazing framework
- [Google Fonts](https://fonts.google.com/) for Inter and JetBrains Mono

---

**Built with ❤️ as a B.Tech CSE Final Year Project**
