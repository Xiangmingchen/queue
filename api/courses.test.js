/* eslint-env jest */
const request = require('supertest')
const app = require('../app')
const testutil = require('../testutil')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

describe('Courses API', () => {
  test('GET /api/courses', async () => {
    const res = await request(app).get('/api/courses')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0].name).toBe('CS225')
    expect(res.body[1].name).toBe('CS241')
  })

  test('GET /api/courses/2', async () => {
    const res = await request(app).get('/api/courses/2')
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(2)
    expect(res.body.name).toBe('CS241')
    expect(res.body).toHaveProperty('queues')
    expect(res.body.queues).toHaveLength(1)
    expect(res.body.queues[0].id).toBe(2)
    expect(res.body.queues[0].location).toBe('There')
    expect(res.body).toHaveProperty('staff')
    expect(res.body.staff).toHaveLength(1)
    expect(res.body.staff[0].netid).toBe('241staff')
    expect(res.body.staff[0].id).toBe(3)
  })

  describe('POST /api/courses', () => {
    test('should succeed for an admin', async () => {
      const course = { name: 'CS423' }
      const res = await request(app).post('/api/courses?forceuser=admin').send(course)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('CS423')
      expect(res.body.id).toBe(3)
    })
    test('should fail for a non-admin', async () => {
      const course = { name: 'CS423' }
      const res = await request(app).post('/api/courses?forceuser=student').send(course)
      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/courses/1/staff/1', () => {
    test('should succeed for an admin', async () => {
      const res = await request(app).delete('/api/courses/1/staff/2?forceuser=admin')
      expect(res.statusCode).toBe(202)
      console.log(res.body)
      const res2 = await request(app).get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body.queues).toHaveLength(1)
      expect(res2.body.queues[0].id).toBe(1)
      expect(res2.body.queues[0].location).toBe('Here')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(0)
    })
    test('should fail for a non-admin', async () => {
      const res = await request(app).delete('/api/courses/1/staff/1?forceuser=student')
      expect(res.statusCode).toBe(403)
    })
  })

})
