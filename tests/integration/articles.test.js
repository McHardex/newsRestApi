const request = require('supertest');
const {Article} = require('../../models/article');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/articles', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Article.remove({});
  });

  describe('GET /', () => {
    it('should return all articles', async () => {
      const articles = [
        { 
          title: "req.body.title",
          leadParagraph: "req.body.leadParagraph",
          byline: "req.body.byline",
          body: "req.body.body",
          subheading: "req.body.subheading",
          statement: "req.body.statement",
          imageUrl: "req.body.imageUrl" 
        }
      ];
      
      await Article.collection.insertMany(articles);

      const res = await request(server).get('/api/articles');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body.some(g => g.title === 'req.body.title')).toBeTruthy();
    });
  });

  // describe('GET /:id', () => {
  //   it('should return an article if valid id is passed', async () => {
  //     const article = new Article(
  //       { 
  //         title: "req.body.title",
  //         leadParagraph: "req.body.leadParagraph",
  //         byline: "req.body.byline",
  //         body: "req.body.body",
  //         subheading: "req.body.subheading",
  //         statement: "req.body.statement",
  //         imageUrl: "req.body.imageUrl"  
  //       }
  //   );
  //     await article.save();

  //     const res = await request(server).get('/api/articles/' + articles._id);

  //     expect(res.status).toBe(200);
  //     expect(res.body).toHaveProperty('title', article.title);     
  //   });

  //   it('should return 404 if invalid id is passed', async () => {
  //     const res = await request(server).get('/api/articles/1');

  //     expect(res.status).toBe(404);
  //   });

  //   it('should return 404 if no article with the given id exists', async () => {
  //     const id = mongoose.Types.ObjectId();
  //     const res = await request(server).get('/api/articles/' + id);

  //     expect(res.status).toBe(404);
  //   });
  // });

  // describe('POST /', () => {

  //   // Define the happy path, and then in each test, we change 
  //   // one parameter that clearly aligns with the name of the 
  //   // test. 
  //   let token; 
  //   let title; 

  //   const exec = async () => {
  //     return await request(server)
  //       .post('/api/genres')
  //       .set('x-auth-token', token)
  //       .send([
  //         {
  //           title: "req.body.title",
  //           leadParagraph: "req.body.leadParagraph",
  //           byline: "req.body.byline",
  //           body: "req.body.body",
  //           subheading: "req.body.subheading",
  //           statement: "req.body.statement",
  //           imageUrl: "req.body.imageUrl" 
  //         }
  //     ]);
  //   }

  //   beforeEach(() => {
  //     token = new User().generateAuthToken();      
  //     title = 'req.body.title'; 
  //   })

  //   it('should return 401 if client is not logged in', async () => {
  //     token = ''; 

  //     const res = await exec();

  //     expect(res.status).toBe(401);
  //   });

  //   it('should return 400 if article is less than 5 characters', async () => {
  //     title = 'req'; 
      
  //     const res = await exec();

  //     expect(res.status).toBe(400);
  //   });

  //   it('should return 400 if article title is more than 50 characters', async () => {
  //     title = new Array(52).join('a');

  //     const res = await exec();

  //     expect(res.status).toBe(400);
  //   });

  //   it('should save the article if it is valid', async () => {
  //     await exec();

  //     const article = await Article.find({ title: 'req.body.title' });

  //     expect(article).not.toBeNull();
  //   });

  //   it('should return the article if it is valid', async () => {
  //     const res = await exec();

  //     expect(res.body).toHaveProperty('_id');
  //     expect(res.body).toHaveProperty('title', 'req.body.title');
  //   });
  // });

  // describe('PUT /:id', () => {
  //   let token; 
  //   let newTitle; 
  //   let article; 
  //   let id; 

  //   const exec = async () => {
  //     return await request(server)
  //       .put('/api/articles/' + id)
  //       .set('x-auth-token', token)
  //       .send({ title: newTitle });
  //   }

  //   beforeEach(async () => {
  //     // Before each test we need to create a genre and 
  //     // put it in the database.      
  //     article = new Article({ title: 'req.body.title' });
  //     await article.save();
      
  //     token = new User().generateAuthToken();     
  //     id = article._id; 
  //     newTitle= 'updatedTitle'; 
  //   })

  //   it('should return 401 if client is not logged in', async () => {
  //     token = ''; 

  //     const res = await exec();

  //     expect(res.status).toBe(401);
  //   });

  //   it('should return 400 if article title is less than 5 characters', async () => {
  //     newTitle = '1234'; 
      
  //     const res = await exec();

  //     expect(res.status).toBe(400);
  //   });

  //   it('should return 400 if article is more than 50 characters', async () => {
  //     newTitle = new Array(52).join('a');

  //     const res = await exec();

  //     expect(res.status).toBe(400);
  //   });

  //   it('should return 404 if id is invalid', async () => {
  //     id = 1;

  //     const res = await exec();

  //     expect(res.status).toBe(404);
  //   });

  //   it('should return 404 if article with the given id was not found', async () => {
  //     id = mongoose.Types.ObjectId();

  //     const res = await exec();

  //     expect(res.status).toBe(404);
  //   });

  //   it('should update the genre if input is valid', async () => {
  //     await exec();

  //     const updatedArticle = await Article.findById(article._id);

  //     expect(updatedArticle.title).toBe(newTitle);
  //   });

  //   it('should return the updated article if it is valid', async () => {
  //     const res = await exec();

  //     expect(res.body).toHaveProperty('_id');
  //     expect(res.body).toHaveProperty('updatedTitle', newTitle);
  //   });
  // });  

  // describe('DELETE /:id', () => {
  //   let token; 
  //   let article; 
  //   let id; 

  //   const exec = async () => {
  //     return await request(server)
  //       .delete('/api/article/' + id)
  //       .set('x-auth-token', token)
  //       .send();
  //   }

  //   beforeEach(async () => {
  //     // Before each test we need to create a genre and 
  //     // put it in the database.      
  //     article = new Article({ title: 'req.body.title' });
  //     await article.save();
      
  //     id = article._id; 
  //     token = new User({ isAdmin: true }).generateAuthToken();     
  //   })

  //   it('should return 401 if client is not logged in', async () => {
  //     token = ''; 

  //     const res = await exec();

  //     expect(res.status).toBe(401);
  //   });

  //   it('should return 403 if the user is not an admin', async () => {
  //     token = new User({ isAdmin: false }).generateAuthToken(); 

  //     const res = await exec();

  //     expect(res.status).toBe(403);
  //   });

  //   it('should return 404 if the id is invalid', async () => {
  //     id = 1; 
      
  //     const res = await exec();

  //     expect(res.status).toBe(404);
  //   });

  //   it('should return 404 if no article with the given id was found', async () => {
  //     id = mongoose.Types.ObjectId();

  //     const res = await exec();

  //     expect(res.status).toBe(404);
  //   });

  //   it('should delete the article if input is valid', async () => {
  //     await exec();

  //     const articleInDb = await Article.findById(id);

  //     expect(articleInDb).toBeNull();
  //   });

  //   it('should return the removed article', async () => {
  //     const res = await exec();

  //     expect(res.body).toHaveProperty('_id', article._id.toHexString());
  //     expect(res.body).toHaveProperty('req.body.title', article.title);
  //   });
  // });  
});