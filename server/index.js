import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

import { sequelize } from './config.js';
import { initDb, Company, Contract, User } from './models.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta raiz
app.use(express.static(path.join(__dirname, '..')));

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const PORT = Number(process.env.PORT || 3000);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

function normalizeModules(inputModules) {
  if (!Array.isArray(inputModules)) return [];
  return [...new Set(inputModules.map((item) => String(item).trim()).filter(Boolean))];
}

function mapRoleToType(role) {
  if (role === 'master') return 'master';
  if (role === 'admin') return 'admin';
  return 'seller';
}

function mapUserForFrontend(userRecord) {
  return {
    id: userRecord.id,
    nome: userRecord.nome,
    user: userRecord.user,
    email: userRecord.email,
    type: mapRoleToType(userRecord.role),
    status: userRecord.status,
    company_id: userRecord.companyId,
  };
}

function isMaster(req) {
  return req.user?.role === 'master';
}

function canManageCompany(req, companyId) {
  if (isMaster(req)) return true;
  return req.user?.role === 'admin' && req.user?.companyId === companyId;
}

function requireAuth(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  return next();
}

function requireMaster(req, res, next) {
  if (!isMaster(req)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  return next();
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

async function ensureDefaultMaster() {
  const hasMaster = await User.findOne({ where: { role: 'master' } });
  if (hasMaster) return;

  const password = process.env.MASTER_PASSWORD || '123456';
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    nome: 'Master Admin',
    user: 'master',
    email: 'master@outletpro.com',
    passwordHash,
    role: 'master',
    status: 'Ativo',
    companyId: null,
  });
}

async function loginHandler(req, res) {
  const login = String(req.body?.user || req.body?.login || req.body?.email || '').trim();
  const senha = String(req.body?.senha || req.body?.password || req.body?.pass || '').trim();

  if (!login || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ user: login }, { email: login }],
      status: 'Ativo',
    },
  });

  if (!user || !(await bcrypt.compare(senha, user.passwordHash))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      companyId: user.companyId,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  return res.json({
    token,
    user: mapUserForFrontend(user),
  });
}

app.get('/', (req, res) => {
  res.json({ message: 'Servidor OutletPro está funcionando correct', status: 'ok' });
});

app.post('/api/auth/login', loginHandler);

app.post('/api/login', (req, res) => {
  req.body = {
    user: req.body?.user || req.body?.email || req.body?.login,
    senha: req.body?.senha || req.body?.password || req.body?.pass,
  };
  return loginHandler(req, res);
});

app.post('/api/auth/logout', (req, res) => {
  return res.json({ success: true });
});

// middleware to extract companyId from token
app.use((req, res, next) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (auth) {
    try {
      const payload = jwt.verify(auth, JWT_SECRET);
      req.companyId = payload.companyId;
      req.userId = payload.userId;
      req.userRole = payload.role;
    } catch (e) {
      // invalid token
    }
  }
  next();
});

app.use(async (req, res, next) => {
  if (!req.userId) return next();
  const user = await User.findByPk(req.userId);
  if (!user) return next();
  req.user = user;
  return next();
});

app.get('/api/auth/verify', async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ valid: false, error: 'Não autenticado' });
  }
  const user = await User.findByPk(req.userId);
  if (!user || user.status !== 'Ativo') {
    return res.status(401).json({ valid: false, error: 'Usuário inválido' });
  }
  return res.json({ valid: true, user: mapUserForFrontend(user) });
});

// configuration for the logged tenant
app.get('/api/config', async (req, res) => {
  if (!req.companyId) return res.status(401).json({ error: 'Não autenticado' });
  const cfg = await Company.findByPk(req.companyId, { attributes: ['branding', 'nome', 'slug'] });
  res.json(cfg || {});
});

app.get('/api/companies', requireAuth, async (req, res) => {
  if (isMaster(req)) {
    const companies = await Company.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(companies);
  }
  const company = await Company.findByPk(req.user.companyId);
  return res.json(company ? [company] : []);
});

app.post('/api/companies', requireAuth, async (req, res) => {
  if (!isMaster(req)) return res.status(403).json({ error: 'Acesso negado' });

  const {
    nome,
    cnpj,
    responsible,
    email,
    phone,
    slug,
    adminName,
    adminUser,
    adminEmail,
    adminPass,
    contractStart,
    contractEnd,
    modules,
  } = req.body || {};

  if (!nome || !adminUser || !adminPass) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  if (contractStart && contractEnd && contractEnd < contractStart) {
    return res.status(400).json({ error: 'Data final não pode ser menor que data inicial' });
  }

  const t = await sequelize.transaction();
  try {
    const company = await Company.create(
      { nome, cnpj, responsible, email, phone, slug: slug || null },
      { transaction: t }
    );

    const passwordHash = await bcrypt.hash(String(adminPass), 10);
    const newAdmin = await User.create(
      {
        companyId: company.id,
        nome: adminName || `Admin ${nome}`,
        user: String(adminUser),
        email: adminEmail || null,
        passwordHash,
        role: 'admin',
        status: 'Ativo',
      },
      { transaction: t }
    );

    await Contract.create(
      {
        companyId: company.id,
        startDate: contractStart || getTodayIsoDate(),
        endDate: contractEnd || getTodayIsoDate(),
        modules: normalizeModules(modules),
        status: 'Ativo',
      },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({ company, admin: mapUserForFrontend(newAdmin) });
  } catch (err) {
    await t.rollback();
    return res.status(400).json({ error: err.message });
  }
});

app.put('/api/companies/:id', requireAuth, async (req, res) => {
  const company = await Company.findByPk(req.params.id);
  if (!company) return res.status(404).json({ error: 'Empresa não encontrada' });
  if (!canManageCompany(req, company.id)) return res.status(403).json({ error: 'Acesso negado' });

  const fields = ['nome', 'cnpj', 'responsible', 'email', 'phone', 'slug'];
  for (const field of fields) {
    if (req.body?.[field] !== undefined) {
      company[field] = req.body[field] || null;
    }
  }
  await company.save();
  return res.json(company);
});

app.delete('/api/companies/:id', requireMaster, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const companyId = req.params.id;
    await Contract.destroy({ where: { companyId }, transaction: t });
    await User.destroy({ where: { companyId }, transaction: t });
    const count = await Company.destroy({ where: { id: companyId }, transaction: t });
    await t.commit();

    if (!count) return res.status(404).json({ error: 'Empresa não encontrada' });
    return res.json({ success: true });
  } catch (error) {
    await t.rollback();
    return res.status(400).json({ error: error.message });
  }
});

app.get('/api/contracts', requireAuth, async (req, res) => {
  const where = isMaster(req) ? {} : { companyId: req.user.companyId };
  const contracts = await Contract.findAll({ where, order: [['createdAt', 'DESC']] });
  return res.json(contracts);
});

app.post('/api/contracts', requireAuth, async (req, res) => {
  const { companyId, startDate, endDate, modules, status } = req.body || {};

  if (!companyId || !startDate || !endDate) {
    return res.status(400).json({ error: 'companyId, startDate e endDate são obrigatórios' });
  }
  if (!canManageCompany(req, companyId)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  if (endDate < startDate) {
    return res.status(400).json({ error: 'Data final não pode ser menor que data inicial' });
  }

  const contract = await Contract.create({
    companyId,
    startDate,
    endDate,
    modules: normalizeModules(modules),
    status: status || 'Ativo',
  });
  return res.status(201).json(contract);
});

app.put('/api/contracts/:id', requireAuth, async (req, res) => {
  const contract = await Contract.findByPk(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Contrato não encontrado' });
  if (!canManageCompany(req, contract.companyId)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const nextStart = req.body?.startDate || contract.startDate;
  const nextEnd = req.body?.endDate || contract.endDate;
  if (nextEnd < nextStart) {
    return res.status(400).json({ error: 'Data final não pode ser menor que data inicial' });
  }

  if (req.body?.startDate !== undefined) contract.startDate = req.body.startDate;
  if (req.body?.endDate !== undefined) contract.endDate = req.body.endDate;
  if (req.body?.modules !== undefined) contract.modules = normalizeModules(req.body.modules);
  if (req.body?.status !== undefined) contract.status = req.body.status;
  await contract.save();
  return res.json(contract);
});

app.delete('/api/contracts/:id', requireAuth, async (req, res) => {
  const contract = await Contract.findByPk(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Contrato não encontrado' });
  if (!canManageCompany(req, contract.companyId)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  await contract.destroy();
  return res.json({ success: true });
});

app.get('/api/users', requireAuth, async (req, res) => {
  const where = isMaster(req) ? {} : { companyId: req.user.companyId };
  const users = await User.findAll({ where, order: [['createdAt', 'DESC']] });
  return res.json(users.map(mapUserForFrontend));
});

app.post('/api/users', requireAuth, async (req, res) => {
  const { nome, user, email, senha, type, company_id, status } = req.body || {};
  const role = type === 'master' ? 'master' : type === 'admin' ? 'admin' : 'seller';
  const targetCompanyId = company_id || req.user.companyId;

  if (!nome || !user || !senha) {
    return res.status(400).json({ error: 'nome, user e senha são obrigatórios' });
  }

  if (role === 'master' && !isMaster(req)) {
    return res.status(403).json({ error: 'Apenas master pode criar usuário master' });
  }
  if (!isMaster(req) && targetCompanyId !== req.user.companyId) {
    return res.status(403).json({ error: 'Acesso negado para esta empresa' });
  }

  const passwordHash = await bcrypt.hash(String(senha), 10);
  const created = await User.create({
    nome,
    user,
    email: email || null,
    passwordHash,
    role,
    status: status || 'Ativo',
    companyId: role === 'master' ? null : targetCompanyId,
  });

  return res.status(201).json(mapUserForFrontend(created));
});

app.put('/api/users/:id', requireAuth, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (!isMaster(req) && user.companyId !== req.user.companyId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  if (!isMaster(req) && user.role === 'master') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  if (req.body?.nome !== undefined) user.nome = req.body.nome;
  if (req.body?.user !== undefined) user.user = req.body.user;
  if (req.body?.email !== undefined) user.email = req.body.email || null;
  if (req.body?.status !== undefined) user.status = req.body.status;
  if (req.body?.type !== undefined) {
    const role = req.body.type === 'master' ? 'master' : req.body.type === 'admin' ? 'admin' : 'seller';
    if (!isMaster(req) && role === 'master') {
      return res.status(403).json({ error: 'Apenas master pode promover para master' });
    }
    user.role = role;
  }
  if (req.body?.senha) {
    user.passwordHash = await bcrypt.hash(String(req.body.senha), 10);
  }
  await user.save();
  return res.json(mapUserForFrontend(user));
});

app.delete('/api/users/:id', requireAuth, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  if (!isMaster(req) && user.companyId !== req.user.companyId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  if (user.id === req.user.id) {
    return res.status(400).json({ error: 'Não é permitido remover o próprio usuário logado' });
  }

  await user.destroy();
  return res.json({ success: true });
});

app.get('/api/sellers', requireAuth, async (req, res) => {
  const sellers = await User.findAll({
    where: {
      companyId: req.user.companyId,
      role: 'seller',
      status: 'Ativo',
    },
    order: [['nome', 'ASC']],
  });
  return res.json(sellers.map(mapUserForFrontend));
});

app.get('/api/produtos', requireAuth, async (req, res) => {
  return res.json([]);
});

app.get('/api/vendas', requireAuth, async (req, res) => {
  return res.json([]);
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, async () => {
  await initDb();
  await ensureDefaultMaster();
  console.log(`API rodando em http://localhost:${PORT}`);
});
