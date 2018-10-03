const request = require('supertest');
const server = require('../../index');
const {Article} = require('../../models/article');
const {User} = require('../../models/user');

describe('auth middleware integration test', () => {
  beforeEach(() => { server, token = new User().generateAuthToken(); })
  afterEach(async () => { 
    server.close();
    await Article.remove({});
    token = new User().generateAuthToken();
  });

  let token;

  const exec = () => {
    return request(server)
      .post('/api/articles')
      .set('x-auth-token', token)
      .send({ name: 'article1'})
  }

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  // it('should return 200 if token is valid', async () => {
  //   const res = await exec();
  //   expect(res.status).toBe(200);
  // });
});