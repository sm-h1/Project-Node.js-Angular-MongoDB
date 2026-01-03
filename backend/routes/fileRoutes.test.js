const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');
const fileRouter = require('./fileRoutes');
const File = require('../models/File');

const app = express();
app.use(express.json());
app.use('/files', fileRouter);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await File.init();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await File.deleteMany({});
  jest.restoreAllMocks();
});

describe('File Routes Full Coverage', () => {
  
  it('POST /files/upload - Success', async () => {
    const testFile = path.join(__dirname, 'test.txt');
    fs.writeFileSync(testFile, 'hello');

    const res = await request(app)
      .post('/files/upload')
      .attach('file', testFile);

    expect(res.statusCode).toBe(201);
    fs.unlinkSync(testFile);
  });

  it('POST /files/upload - Missing File (400)', async () => {
    const res = await request(app).post('/files/upload');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('No file uploaded');
  });

  it('POST /files/upload - Duplicate File (409)', async () => {
    await File.create({ filename: 'dup.txt', path: '/path' });
    
    const testFile = path.join(__dirname, 'dup.txt');
    fs.writeFileSync(testFile, 'content');

    const res = await request(app)
      .post('/files/upload')
      .attach('file', testFile);

    expect(res.statusCode).toBe(409);
    fs.unlinkSync(testFile);
  });

  it('POST /files/upload - Server Error (500)', async () => {
    jest.spyOn(File.prototype, 'save').mockRejectedValueOnce(new Error());
    
    const testFile = path.join(__dirname, 'err.txt');
    fs.writeFileSync(testFile, 'content');

    const res = await request(app)
      .post('/files/upload')
      .attach('file', testFile);

    expect(res.statusCode).toBe(500);
    fs.unlinkSync(testFile);
  });

  it('GET /files - Success', async () => {
    await File.create({ filename: 'a.png', path: '/a' });
    const res = await request(app).get('/files');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('GET /files - Failure (500)', async () => {
    jest.spyOn(File, 'find').mockRejectedValueOnce(new Error());
    const res = await request(app).get('/files');
    expect(res.statusCode).toBe(500);
  });
});