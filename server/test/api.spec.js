const request = require('supertest');

const server = require('../server');

describe('API SERVER', () => {
  let api;
  let testPatient = {
    name: 'Aaron',
    age: 22,
  };

  beforeAll(() => {
    // start the server and store it in the api variable
    api = server.listen(5000, () =>
      console.log('Test server running on port 5000')
    );
  });

  afterAll((done) => {
    // close the server, then run done
    console.log('Gracefully stopping test server');
    api.close(done);
  });

  it('responds to get / with status 200', (done) => {
    request(api).get('/').expect(200, done);
  });

  it('responds to get /patient with status 200', (done) => {
    request(api).get('/patient').expect(200, done);
  });

  it('responds to post /patient with status 201', (done) => {
    request(api)
      .post('/patient')
      .send(testPatient)
      .expect(201)
      .expect({ id: 4, ...testPatient }, done);
  });

  it('retrieves a patient by id', (done) => {
    request(api)
      .get('/patient/3')
      .expect(200)
      .expect({ id: 3, name: 'Robert', age: 56 }, done);
  });

  it('responds to a unknown patient id with a 404', (done) => {
    request(api).get('/patient/42').expect(404).expect({}, done);
  });

  it('responds to delete /patient/:id with status 204', async () => {
    await request(api).delete('/patient/4').expect(204);

    const updatedPatients = await request(api).get('/patient');

    expect(updatedPatients.body.length).toBe(3);
  });

  it('responds to non existing paths with 404', (done) => {
    request(api).get('/no').expect(404, done);
  });

  it('responds to invalid method request with 405', (done) => {
    request(api).post('/').expect(405, done);
  });
});
