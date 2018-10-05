const {User} = require('../../models/user');
const {Article} = require('../../models/article');
const request = require('supertest');

let server; 

describe('auth middleware', () => {

  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await Article.remove({});
    server.close(); 
  });

  let token;

  const exec = () => {
    return request(server)
      .post('/api/articles')
      .set('x-auth-token', token)
      .send({ title : "article" })
  }

  beforeEach(() => {  
    token = new User().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = ''; 

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 422 if token is invalid', async () => {
    token = 'a';

    const res = await exec();

    expect(res.status).toBe(422);
  });
});