const Jwt = require('@fizz.js/node-jwt/libs')
const CONSTANT = require('@fizz.js/node-constant/libs')

/**
 *
 *
 * @class TestHelper
 */
class TestHelper {
  /**
   *Creates an instance of TestHelper.
   * @param {*} agent
   * @memberof TestHelper
   */
  constructor(agent) {
    this.agent = agent
    this.session = null
    this.token = null
  }

  /**
   *
   *
   * @param {*} agent
   * @memberof TestHelper
   */
  attachAgent(agent) {
    this.agent = agent
  }

  /**
   *
   *
   * @returns {Object}
   * @memberof TestHelper
   */
  getAuthorizationHeader() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    }
  }

  /**
   *
   *
   * @returns {Object}
   * @memberof TestHelper
   */
  getUnauthorizationHeader() {
    return {
      'Content-Type': 'application/json'
    }
  }

  /**
   *
   *
   * @returns {Object}
   * @memberof TestHelper
   */
  getInvalidAuthorizationHeader() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}-${this.token}`
    }
  }

  /**
   * @returns {{id: number,name: string, key: string, secret: string}}
   * @memberof TestHelper
   */
  getTestMerchant() {
    return {
      id: 1,
      name: 'testMerchant',
      key: 'N8t3XQcOtcHBC98zAToER0wXYo2lHJ5g',
      secret: 'tp2YufMnXNExYN3nNFYgCtay1tbRMNudxRJvkswsby1oNqOnVw1SpA4sTQp126P8'
    }
  }

  /**
   * @returns {{id: number, merchantId: number, username: string}}
   * @memberof TestHelper
   */
  getTestUser() {
    const merchantId = this.getTestMerchant().id
    return {
      id: 1,
      merchantId: merchantId,
      username: 'testuser'
    }
  }

  /**
   *
   *
   * @returns {*}
   * @memberOf TestHelper
   */
  attemptLogin() {
    return done => {
      this.agent
        .post('/api/auth/login')
        .set(this.getUnauthorizationHeader())
        .send(this.getTestMerchant())
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            throw err
          }

          this.token = res.body.result
          this.session = await Jwt.verify(this.token).catch(_ => undefined)
          if (!this.session) {
            throw new Error(CONSTANT.ERROR.INVALID_TOKEN)
          }

          return done()
        })
    }
  }
}

module.exports = TestHelper
