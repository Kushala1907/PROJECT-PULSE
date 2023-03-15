//jest should make req to express app
const app=require('../server');

const request = require("supertest");

const jwt=require("jsonwebtoken")

//test for registration
test('should create a new user', async () => {
    const res = await request(app)
      .post('/user-api/register-user')
      .send({
        email:"gdotest@westagilelabs.com",
        employee_name:"gdotest",
        password:"gdotest"
      });
    expect(res.status).toEqual(200);
})
