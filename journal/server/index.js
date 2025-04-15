// Basic Koa backend setup
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = new Koa();
const router = new Router();

// Prisma client
const prisma = new PrismaClient();

// Health check route
router.get('/health', ctx => {
  ctx.body = { status: 'ok' };
});

// Example DB health route
router.get('/db-health', async ctx => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    ctx.body = { db: 'ok' };
  } catch (e) {
    ctx.status = 500;
    ctx.body = { db: 'error', error: e.message };
  }
});

// CRUD routes for JournalEntry
// Create
router.post('/entries', async ctx => {
  const { title, content, tags, visibility, createdBy } = ctx.request.body;
  try {
    const entry = await prisma.journalEntry.create({
      data: { title, content, tags, visibility, createdBy }
    });
    ctx.status = 201;
    ctx.body = entry;
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error: e.message };
  }
});

// Read all
router.get('/entries', async ctx => {
  const entries = await prisma.journalEntry.findMany({ orderBy: { createdAt: 'desc' } });
  ctx.body = entries;
});

// Read one
router.get('/entries/:id', async ctx => {
  const { id } = ctx.params;
  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (entry) ctx.body = entry;
  else ctx.status = 404, ctx.body = { error: 'Not found' };
});

// Update
router.put('/entries/:id', async ctx => {
  const { id } = ctx.params;
  const { title, content, tags, visibility, createdBy } = ctx.request.body;
  try {
    const entry = await prisma.journalEntry.update({
      where: { id },
      data: { title, content, tags, visibility, createdBy }
    });
    ctx.body = entry;
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error: e.message };
  }
});

// Delete
router.delete('/entries/:id', async ctx => {
  const { id } = ctx.params;
  try {
    await prisma.journalEntry.delete({ where: { id } });
    ctx.status = 204;
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error: e.message };
  }
});

app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Koa server listening on port ${PORT}`);
});
