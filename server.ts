import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Initialize SQLite Database
let db: any;
async function initDb() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      ticket_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      purchase_id TEXT UNIQUE NOT NULL,
      purchase_date TEXT NOT NULL,
      status TEXT DEFAULT 'unused',
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
  console.log('Database initialized');
}

async function startServer() {
  await initDb();
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Allow larger payloads for base64 images if needed

  // --- API Routes ---

  // Register
  app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
      res.status(201).json({ id: result.lastID, email });
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // In a real app, use JWT here. For simplicity, we just return the user info.
      res.json({ id: user.id, email: user.email });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Buy Ticket
  app.post('/api/tickets', async (req, res) => {
    const { userId, ticket } = req.body;
    if (!userId || !ticket) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const purchaseId = \`TKT-\${Date.now()}-\${Math.floor(Math.random() * 1000)}\`;
    const purchaseDate = new Date().toISOString().split('T')[0];

    try {
      const result = await db.run(
        'INSERT INTO tickets (user_id, ticket_id, name, price, purchase_id, purchase_date) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, ticket.id, ticket.name, ticket.price, purchaseId, purchaseDate]
      );
      
      const newTicket = await db.get('SELECT * FROM tickets WHERE id = ?', [result.lastID]);
      res.status(201).json(newTicket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  });

  // Get User Tickets
  app.get('/api/users/:userId/tickets', async (req, res) => {
    const { userId } = req.params;
    try {
      const tickets = await db.all(
        'SELECT * FROM tickets WHERE user_id = ? ORDER BY purchase_date DESC, id DESC',
        [userId]
      );
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  });

  // --- Vite Middleware for Development / Static Serving for Production ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

startServer().catch(console.error);
