# CivicaQuest — Node.js Backend

Full REST API backend for CivicaQuest replacing/augmenting Firebase direct calls.

## 🚀 Quick Start

```bash
cd civicaquest-backend
npm install
node server.js
# Server running at http://localhost:3000
```

## 📁 File Structure

```
civicaquest-backend/
├── server.js     ← Main Express server (all routes)
├── api.js        ← Frontend JS client (copy to civica_enhanced/)
├── package.json
└── README.md
```

## 🔌 Integration with Frontend

Copy `api.js` to your `civica_enhanced/` folder, then add to any HTML:

```html
<script src="api.js"></script>
<script>
  // Register
  const { token, user } = await CivicAPI.auth.register(email, password, displayName);

  // Login
  const { token, user } = await CivicAPI.auth.login(email, password);

  // Demo mode
  const { token, user } = await CivicAPI.auth.demo();

  // Add XP
  await CivicAPI.xp.add(100, 'Completed quiz');

  // Submit quiz
  await CivicAPI.quiz.submit('Constitution Quiz', answers, score, total, 'constitution');

  // Update civic progress
  await CivicAPI.civic.updateProgress({ chapterRead: 'ch1', xpEarned: 50 });

  // Submit game score
  await CivicAPI.scores.submit('budget-game', 850, { level: 3 });

  // Dashboard
  const dash = await CivicAPI.dashboard.get();
</script>
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/demo` | Guest/demo access |
| POST | `/api/auth/refresh` | Refresh token |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get profile |
| PATCH | `/api/users/me` | Update profile |

### XP & Badges
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/xp/add` | Add XP `{ amount, reason }` |
| GET | `/api/xp/stats` | XP stats & level |
| POST | `/api/badges/award` | Award badge |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/submit` | Submit quiz result |
| GET | `/api/quiz/history` | Quiz history |
| GET | `/api/quiz/stats` | Quiz statistics |

### Civic Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/civic/progress` | Get progress |
| PATCH | `/api/civic/progress` | Update progress |
| GET | `/api/civic/mcq-history` | MCQ history |
| POST | `/api/civic/mcq-session` | Save MCQ session |

### Activity
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity` | Get last 30 days |
| POST | `/api/activity/log` | Log daily activity |

### Scores
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scores` | Submit score |
| GET | `/api/scores/:gameType` | Top 10 scores |
| GET | `/api/scores/me/:gameType` | My best scores |

### Election Simulator
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/election/create` | Create election |
| POST | `/api/election/:id/vote` | Cast vote |
| GET | `/api/election/:id/results` | Get results |
| PATCH | `/api/election/:id/close` | Close election |

### Classroom
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/classroom/create` | Create classroom |
| POST | `/api/classroom/join` | Join by code |
| GET | `/api/classroom/my` | My classrooms |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Full summary |
| GET | `/api/health` | Health check |

## ⚙️ Environment Variables

```env
PORT=3000
JWT_SECRET=your-very-secret-key-change-this
```

## 🗄️ Production Database

The current setup uses in-memory storage (resets on restart).
For production, replace the `DB` object with:

- **MongoDB**: Use `mongoose` npm package
- **PostgreSQL**: Use `pg` or `sequelize`
- **SQLite**: Use `better-sqlite3` (zero-config)

## 🔒 Production Notes

1. Change `JWT_SECRET` to a strong random string
2. Set up a real database
3. Add HTTPS (use nginx or a reverse proxy)
4. Set `origin` in CORS to your actual domain
