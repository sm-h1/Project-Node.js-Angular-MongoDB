const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const File = require('./File'); 

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await File.init(); 
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await File.deleteMany({});
});

describe('File Model Test', () => {

  it('should create & save file successfully', async () => {
    const validFile = new File({
      filename: 'image.png',
      path: '/uploads/image.png'
    });
    const savedFile = await validFile.save();
    
    expect(savedFile._id).toBeDefined();
    expect(savedFile.filename).toBe(validFile.filename);
  });

  it('should fail if filename is not unique', async () => {
    const file1 = new File({ filename: 'dup.txt', path: '/path1' });
    await file1.save();
    
    const file2 = new File({ filename: 'dup.txt', path: '/path2' });
    
    let err;
    try {
      await file2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); 
  });
});