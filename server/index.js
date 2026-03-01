import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { sequelize } from './config.js';
import { initDb, Company, User } from './models.js';

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

// create new company with admin user
app.post('/api/companies', async (req, res) => {
  const { name, slug, adminEmail, adminPassword } = req.body;
  const t = await sequelize.transaction();
  try {
    const company = await Company.create({ name, slug }, { transaction: t });
    const hash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      companyId: company.id,
      email: adminEmail,
      passwordHash: hash,
      role: 'admin'
    }, { transaction: t });
    await t.commit();
    res.status(201).json(company);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
});

// login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ userId: user.id, companyId: user.companyId }, JWT_SECRET);
  res.json({ token });
});

// middleware to extract companyId from token
app.use((req, res, next) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (auth) {
    try {
      const payload = jwt.verify(auth, JWT_SECRET);
      req.companyId = payload.companyId;
      req.userId = payload.userId;
    } catch (e) {
      // invalid token
    }
  }
  next();
});

// configuration for the logged tenant
app.get('/api/config', async (req, res) => {
  if (!req.companyId) return res.status(401).json({ error: 'Não autenticado' });
  const cfg = await Company.findByPk(req.companyId, { attributes: ['branding', 'name', 'slug'] });
  res.json(cfg || {});
});

// sample data endpoints (empty for now)
app.get('/api/sellers', async (req, res) => {
  if (!req.companyId) return res.status(1).json({ error: 'Não autenticado' });
  const sellers = await User.findAll({ where: { companyId: req.companyId } });
  res.json(sellers);
});

app.get('/api/produtos', async (req, res) => {
  if (!req.companyId) return res.status(401).json({ error: 'Não autenticado' });
  res.json([]);
});

app.get('/api/vendas', async (req, res) => {
  if (!req.companyId) return res.status(401).json({ error: 'Não autenticado' });
  res.json([]);
});

app.listen(3000, async () => {
  await initDb();
  console.log('API rodando em http://localhost:3000');
});
