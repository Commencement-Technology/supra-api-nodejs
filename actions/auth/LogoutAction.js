const { RequestRule, AppError, errorCodes } = require('supra-core')
const BaseAction = require('../BaseAction')
const SessionDAO = require('../../dao/SessionDAO')
const AuthModel = require('../../models/AuthModel')

/**
 * remove current session
 */
class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static get validationRules () {
    return {
      body: {
        refreshToken: new RequestRule(AuthModel.schema.refreshToken)
      },
      cookies: {
        refreshToken: new RequestRule(AuthModel.schema.refreshToken)
      }
    }
  }

  static async run (ctx) {
    // take refresh token from any possible source
    const refreshToken = ctx.cookies.refreshToken || ctx.body.refreshToken
    if (!refreshToken) {
      throw new AppError({ ...errorCodes.VALIDATION, message: 'Refresh token not provided' })
    }

    await SessionDAO.baseRemoveWhere({ refreshToken })

    return this.result({ message: 'User is logged out from current session.' })
  }
}

module.exports = LogoutAction
