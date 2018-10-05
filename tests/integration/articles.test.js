const request = require('supertest');
const {Article} = require('../../models/article');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');

let server;

describe('/api/articles', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    server.close(); 
    await Article.remove();
  });

  describe('GET /', () => {
    it('should get all articles', async () => {
      await Article.collection.insertMany([
        { 
          title: new Array(12).join('a'),
          subheading: new Array(30).join('a'),
          leadParagraph: new Array(52).join('a'),
          body: new Array(52).join('a'),
          imageUrl: new Array(30).join('a')
        }
      ]);

      const res = await request(server).get('/api/articles');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
      expect(res.body).toHaveProperty('title', res.title);
    });
  });

  describe('GET /:id', () => {
    it('should return article if valid ID is passed', async () => {
      const article = new Article(
        { 
          title: new Array(12).join('a'),
          subheading: new Array(30).join('a'),
          leadParagraph: new Array(52).join('a'),
          body: new Array(52).join('a'),
          imageUrl: new Array(30).join('a')
        });
      await article.save();
      const id = article._id

      const res = await request(server).get(`/api/articles/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", article.title);
    });
  });

  describe('POST /', () => {

    let token; 
    let title;

    const exec = async () => {
      return await request(server)
         .post('/api/articles')
         .set('x-auth-token', token)
         .send({ title });
    }

    beforeEach(() => { 
      token = new User().generateAuthToken(); 
    })

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 422 if article is less than 10 characters ', async () => {
      title = '1234578'

      const res = await exec();
 
      expect(res.status).toBe(422);
    });

    it('should return 422 if article is more than 60 characters ', async () => {
      title = new Array(62).join('a');

      const res = await exec();
 
      expect(res.status).toBe(422);
    });

    it('should save the article if it is valid ', async () => {
      await exec();

      const article = await Article.find({ title: "article" });

      expect(article).not.toBeNull();
    });

    it('should return the article if it is valid ', async () => {
      const res = await exec();

      expect(res.body).not.toBeNull();
    });
  });

  describe('DELETE /:id', () => {
    let token; 
    let article; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete(`/api/articles/${id}`)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.  

      article = new Article(
        {
          title: new Array(12).join('a'),
          subheading: new Array(30).join('a'),
          leadParagraph: new Array(52).join('a'),
          body: new Array(52).join('a'),
          imageUrl: new Array(30).join('a')
       });
       const res = await article.save();


       const user = new User({
        name: new Array(12).join('a'),
        email: new Array(10).join('a'),
        password: new Array(10).join('a'),
        bio: new Array(20).join('a'),
       });

       const newUser = await user.save
       id = article._id; 
      
      token = new User(id).generateAuthToken();    
    });


    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no article with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the article if input is valid', async () => {
      await exec();

      const articleInDb = await Article.findById(id);
      const result = articleInDb.delete();

      expect(result).toMatchObject({});
    });

    it('should return the removed article', async () => {
      await exec();

      const articleInDb = await Article.findById(id);

      expect(articleInDb).toHaveProperty('_id', id);
      expect(articleInDb).toHaveProperty('title', article.title);
    });
  });  
});