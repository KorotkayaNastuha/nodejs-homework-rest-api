const  mongoose  = require('mongoose');
const request = require('supertest');
require('dotenv').config();

const app = require('../../app');
const { MONGO_URL } = process.env;

beforeAll(async () => {
    await mongoose.connect(MONGO_URL);
  });

describe('register controller', () => {
  const testData = {
      email: "nastya_exs@ukr.net",
      password: "1234567",
  };
  
//   test('should users', async () => {
//     const response = await request(app).post('/api/users/register').send(testData);
//     expect(response.statusCode).toBe(200);
    
//  });   
  test('should return status', async () => {
    const resLog = await request(app).post('/api/users/login').send(testData);
    expect(resLog.statusCode).toBe(200);
    expect.objectContaining({
      token: expect.any(String),
      user: expect.any(Object),
      email: expect.any(String),
      subscription: expect.any(String)
    })
  });
});

afterAll(async () => {
    await mongoose.connection.close();
  });