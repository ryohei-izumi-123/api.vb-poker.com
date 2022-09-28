// const assert = require('assert')
const should = require('should')
const request = require('supertest')
const app = require('../../app')
const TestHelper = require('../helper')
const agent = request(app)
const Helper = new TestHelper(agent)
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 */
describe('TEST controllers/currency', () => {
  before(Helper.attemptLogin())
  it('GREEN: CASE1', done => {
    agent
      .get('/api/currency')
      .set(Helper.getAuthorizationHeader())
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(200))
      .expect(res => should(res.body).Array)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
  it('GREEN: CASE2', done => {
    agent
      .get('/api/currency')
      .set(Helper.getAuthorizationHeader())
      .query({
        type: 'fiat'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(200))
      .expect(res => should(res.body).Array)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
  it('GREEN: CASE3', done => {
    agent
      .get('/api/currency')
      .set(Helper.getAuthorizationHeader())
      .query({
        order: 'ASC'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(200))
      .expect(res => should(res.body).Array)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
  it('GREEN: CASE4', done => {
    agent
      .get('/api/currency')
      .set(Helper.getAuthorizationHeader())
      .query({
        sort: 'id'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(200))
      .expect(res => should(res.body).Array)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
  it('GREEN: CASE5', done => {
    agent
      .get('/api/currency')
      .set(Helper.getAuthorizationHeader())
      .query({
        filter: 'jp'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(200))
      .expect(res => should(res.body).Array)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
  it('GREEN: CASE6', done => {
    agent
      .get('/api/currency/1')
      .set(Helper.getAuthorizationHeader())
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(200))
      .expect(res => should(res.body.id).equal(1))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
  it('GREEN: CASE7', done => {
    agent
      .get('/api/currency/XRP')
      .set(Helper.getAuthorizationHeader())
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(200))
      .expect(res => should(res.body.name).equal('XRP'))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        done()
      })
  })
  it('RED: CASE1', done => {
    agent
      .get('/api/currency/0')
      .set(Helper.getAuthorizationHeader())
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(500))
      .expect(res => should(res.body.err).equal(CONSTANT.ERROR.DB_RECORD_NOT_FOUND))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
  it('RED: CASE2', done => {
    agent
      .get('/api/currency/invalidcurrency')
      .set(Helper.getAuthorizationHeader())
      .query({
        type: 'invalid'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(500))
      .expect(res => should(res.body.err).equal(CONSTANT.ERROR.DB_RECORD_NOT_FOUND))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
  it('RED: CASE3', done => {
    agent
      .get('/api/currency')
      .set(Helper.getAuthorizationHeader())
      .query({
        type: 'invalid'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(500))
      .expect(res => should(res.body.err).equal(CONSTANT.ERROR.VALIDATION))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
  it('RED: CASE4', done => {
    agent
      .get('/api/currency')
      .set(Helper.getUnauthorizationHeader())
      .expect(res => should(res.status).equal(401))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
  it('RED: CASE5', done => {
    agent
      .get('/api/currency')
      .set(Helper.getInvalidAuthorizationHeader())
      .expect(res => should(res.status).equal(401))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
  it('RED: CASE6', done => {
    agent
      .get(`/api/currency/${1e8}`)
      .set(Helper.getAuthorizationHeader())
      .query({
        type: 'invalid'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(500))
      .expect(res => should(res.body.err).equal(CONSTANT.ERROR.DB_RECORD_NOT_FOUND))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
  it('RED: CASE7', done => {
    agent
      .get('/api/currency/AAABBBCCC')
      .set(Helper.getAuthorizationHeader())
      .query({
        type: 'invalid'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(500))
      .expect(res => should(res.body.err).equal(CONSTANT.ERROR.DB_RECORD_NOT_FOUND))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
  it('RED: CASE8', done => {
    agent
      .get('/api/currency/-3')
      .set(Helper.getAuthorizationHeader())
      .query({
        type: 'invalid'
      })
      .expect('Content-Type', /json/)
      .expect(res => should(res.status).equal(404))
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return done()
      })
  })
})
