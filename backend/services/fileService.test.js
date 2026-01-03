const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { fileExists, saveFile } = require('./fileService');
const File = require('../models/File');

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

describe('File Service Tests', () => {
  describe('fileExists', () => {
    it('should return true if file exists', async () => {
      await File.create({ filename: 'test.png', path: '/path' });
      expect(await fileExists('test.png')).toBe(true);
    });

    it('should throw error if findOne fails', async () => {
      jest.spyOn(File, 'findOne').mockRejectedValueOnce(new Error());
      await expect(fileExists('test.png')).rejects.toThrow('Error checking if file exists');
    });
  });

  describe('saveFile', () => {
    it('should save file successfully', async () => {
      const res = await saveFile({ originalname: 'a.png', path: '/a' });
      expect(res.filename).toBe('a.png');
    });

    it('should throw error if save fails', async () => {
      await expect(saveFile({ originalname: 'a.png' })).rejects.toThrow();
    });
  });
});