'use strict'
// @ts-check

require('@fizz.js/node-acl/typings.d')
require('@fizz.js/node-acl-v2/typings.d')
require('@fizz.js/node-acl-v3/typings.d')
require('@fizz.js/node-alibaba-cloud/typings.d')
require('@fizz.js/node-authenticate/typings.d')
require('@fizz.js/node-base64/typings.d')
require('@fizz.js/node-cache/typings.d')
require('@fizz.js/node-cluster-handler/typings.d')
require('@fizz.js/node-common/typings.d')
require('@fizz.js/node-constant/typings.d')
require('@fizz.js/node-context/typings.d')
require('@fizz.js/node-controller/typings.d')
require('@fizz.js/node-cron/typings.d')
require('@fizz.js/node-error-reporter/typings.d')
require('@fizz.js/node-errors/typings.d')
require('@fizz.js/node-file-client/typings.d')
require('@fizz.js/node-geoip/typings.d')
require('@fizz.js/node-google-authenticator/typings.d')
require('@fizz.js/node-jwt/typings.d')
require('@fizz.js/node-logger/typings.d')
require('@fizz.js/node-markdown/typings.d')
require('@fizz.js/node-model/typings.d')
require('@fizz.js/node-mongodb/typings.d')
require('@fizz.js/node-openssl/typings.d')
require('@fizz.js/node-process-handler/typings.d')
require('@fizz.js/node-rabbitmq/typings.d')
require('@fizz.js/node-redis/typings.d')
require('@fizz.js/node-request/typings.d')
require('@fizz.js/node-request-logger/typings.d')
require('@fizz.js/node-response-formatter/typings.d')
require('@fizz.js/node-route/typings.d')
require('@fizz.js/node-security/typings.d')
require('@fizz.js/node-sendgrid/typings.d')
require('@fizz.js/node-sentry-middleware/typings.d')
require('@fizz.js/node-server-handler/typings.d')
require('@fizz.js/node-static-server/typings.d')
require('@fizz.js/node-twilio/typings.d')
require('@fizz.js/node-validate/typings.d')
require('@fizz.js/node-worker/typings.d')
require('@fizz.js/node-scaffolding/typings.d')
require('@fizz.js/node-interface-generator/typings.d')
require('@fizz.js/node-interface-generator/libs')
/**
 *
 * @typedef IModelAttributes
 * @type { { [k: string]: IModelAttribute } }
 * */

/**
 *
 * @typedef IModelAttribute
 * @type {Object}
 * @property {IModelAttributeType} type
 * @property {boolean} [allowNull=undefined]
 * @property {boolean} [readOnly=undefined]
 * @property {boolean} [noUpdate=undefined]
 * @property {boolean} [primaryKey=undefined]
 * @property {boolean} [unique=undefined]
 * @property {boolean} [autoIncrement=undefined]
 * @property {any} [defaultValue=undefined]
 * @property {any[]} [values=undefined]
 * @property {IModelAttributeValidations} [validate=undefined]
 * @property {string} field
 * @property {string} fieldName
 * @property {Function} [get=undefined]
 * @property {Function} [set=undefined]
 * @property {string} Model
 * */

/**
 *
 * @typedef IModelAttributeValidations
 * @type { { [k: string]: any } }
 * */

/**
 *
 * @typedef IModelTimestampAttributes
 * @type { { [k: string]: string } }
 * */

/**
 *
 * @typedef IModelAttributeType
 * @type {Object}
 * @property {string} key
 * @property {IModelAttributeMetadata} [options=undefined]
 * @property {Function} toSql
 * */

/**
 *
 * @typedef IModelAttributeMetadata
 * @type {Object}
 * @property {any[]} [values=undefined]
 * @property {number} [length=undefined]
 * @property {boolean} [unsigned=undefined]
 * */

/**
 * @typedef ICurrency
 * @type {'USD'|'JPY'}
 */

/**
 * @typedef ITwilioStatus
 * @type {'sent'|'received'|'delivered'|'accepted'|'queued'|'undelivered'|'failed'}
 */

/**
 * @typedef ITwilioDirection
 * @type {'outbound-api'|'outbound-reply'|'inbound'}
 */

/**
 * @typedef IEnv
 * @type {'development'|'test'|'staging'|'production'}
 */

/**
 *
 * @typedef ITotpSeed
 * @type {Object}
 * @property {string} ascii
 * @property {string} hex
 * @property {string} base32
 * @property {string} otpauth_url
 * */

/**
 * @typedef ITotpMethod
 * @type {'google'|null}
 */

/**
 *
 * @typedef IUserConfig
 * @type {Object}
 * @property {IUserConfigDefault} default
 * @property {IUserConfigSecurity} security
 * */

/**
 *
 * @typedef IUserConfigSecurity
 * @type {Object}
 * @property {ITotpSeed} seed
 * @property {ITotpMethod} method
 * */

/**
 *
 * @typedef IUserConfigDefault
 * @type {Object}
 * */

/**
 * @typedef IAccountLevel
 * @type {'administrator'|'agent'|'player'}
 */

/**
 *
 * @typedef IStrings
 * @type {string|string[]}
 */

/**
 *
 * @typedef IAclBackendStrategy
 * @type {'memory'|'redis'|'mongodb'}
 */

/**
 *
 * @typedef IAclAllow
 * @type {Object}
 * @property {IStrings} resources
 * @property {IStrings} permissions
 */

/**
 *
 * @typedef IAclSet
 * @type {Object}
 * @property {IStrings} roles
 * @property {IAclAllow} allows
 */

/**
 *
 * @typedef ICliConfig
 * @type {Object}
 * @property {string} template
 * @property {ICliDirectoryOptions} dir
 */

/**
 *
 * @typedef ICliDirectoryOptions
 * @type {Object}
 * @property {string} controllers
 * @property {string} routes
 * @property {string} models
 * @property {string} schemas
 */

/**
 *
 * @typedef INotificationPayload
 * @type {Object}
 * @property {string} subject
 * @property {string} body
 * @property {Object} replacement
 */

/**
 *
 * @typedef IBaseError
 * @type {Object}
 * @property {string} message
 * @property {string} stack
 * @property {string} name
 * @property {number} status
 */

/**
 * @typedef IEmptyObject
 * @type {Object}
 */

/**
 * @typedef IVal
 * @type {string|number}
 */

/**
 * @typedef IVals
 * @type {IVal|IVal[]}
 */

/**
 * @typedef INumberLike
 * @type {string|number|BigNumber}
 */

/**
 * @typedef IStatus
 * @type {'active'|'active'|'pending'}
 */

/**
 * @typedef ISendNotificationType
 * @type {'normal'|'system'|'verification'|'notification'}
 */

/**
 * @typedef ISendgridPayload
 * @type {Object}
 * @property {string} from
 * @property {string} to
 * @property {string} subject
 * @property {string} text
 * @property {string} html
 * @property {string} templateId
 * @property {Object} dynamicTemplateData
 */

/**
 * @typedef ITwilioPayload
 * @type {Object}
 * @property {IIntlPhoneNumberFormat} to
 * @property {IIntlPhoneNumberFormat} from
 * @property {string} body
 * @property {'man'} voice
 * @property {'ja-jp'} language
 */

/**
 * @typedef ITwilioResponsePayload
 * @type {Object}
 * @property {Function} callback
 * @property {Date} dateSent
 * @property {Date} dateSentAfter
 * @property {Date} dateSentBefore
 * @property {Function} done
 * @property {string} from
 * @property {number} limit
 * @property {number} pageSize
 * @property {string} to
 * @property {string} sid
 */

/**
 * @typedef ITwilioResponse
 * @type {Object}
 * @property {string} accountSid
 * @property {string} apiVersion
 * @property {string} body
 * @property {Date} dateCreated
 * @property {Date} dateUpdated
 * @property {Date} dateSent
 * @property {ITwilioDirection} direction
 * @property {string} errorCode
 * @property {string} errorMessage
 * @property {string} from
 * @property {string} messagingServiceSid
 * @property {number} numMedia
 * @property {number} numSegments
 * @property {number} price
 * @property {ICurrency} priceUnit
 * @property {string} sid
 * @property {ITwilioStatus} status
 * @property {string} to
 * @property {string} uri
 * @property {ITwilioResponseSubresource} uri
 */

/**
 * @typedef ITwilioResponseSubresource
 * @type {Object}
 * @property {string} media
 * @property {string} subresourceUris
 */

/**
 * @typedef IIntlPhoneNumberFormat
 * @type {Object}
 * @property {string} phoneNumber
 * @property {string} callPrefix
 */

/**
 * @typedef INotificationProviderResponse
 * @type {Object}
 * @property {number} statusCode
 * @property {string} status
 */

/**
 * @typedef SendHandlerInput
 * @type {Object}
 * @property {string} address
 * @property {number} tag
 * @property {string} transactionId
 * @property {ICurrency} currency
 * @property {IStatus} status
 */

/**
 *
 * @typedef {Object} Model
 * @property {number} id
 * @property {IStatus} status
 * @property {number} createdId
 * @property {Date} createdAt
 * @property {number} updatedId
 * @property {Date} updatedAt
 * @property {number} deletedId
 * @property {Date} deletedAt
 * @property {Function} create
 * @property {Function} update
 * @property {Function} findOne
 * @property {Function} findAll
 * @property {Function} findByPk
 * @property {Model} dataValues
 * */

/**
 *
 * @typedef {Object} ModelPlayers
 * @property {number} id
 * @property {IEnv} env
 * @property {number} organizationId
 * @property {string} username
 * @property {string} password
 * @property {string} confirmPassword
 * @property {number} balance
 * @property {IStatus} status
 * @property {number} createdId
 * @property {Date} createdAt
 * @property {number} updatedId
 * @property {Date} updatedAt
 * @property {number} deletedId
 * @property {Date} deletedAt
 * @property {Function} create
 * @property {Function} update
 * @property {Function} upsert
 * @property {Function} destroy
 * @property {Function} findOne
 * @property {Function} findAll
 * @property {Function} findByPk
 * @property {Function} findAndCountAll
 * @property {Function} findOrCreate
 * @property {Function} findCreateFind
 * @property {Function} bulkCreate
 * @property {Function} truncate
 * @property {Function} restore
 * @property {ModelPlayers} dataValues
 * */

/**
 *
 * @typedef ModelSmsHistories
 * @type {Object}
 * @property {number} id
 * @property {ISendNotificationType} sendType
 * @property {string} from
 * @property {string} to
 * @property {string} body
 * @property {string} text
 * @property {string} sid
 * @property {string} intlFrom
 * @property {string} intlTo
 * @property {IStatus} status
 * @property {ITwilioStatus} delivery_status
 * @property {number} createdId
 * @property {Date} createdAt
 * @property {number} updatedId
 * @property {Date} updatedAt
 * @property {number} deletedId
 * @property {Date} deletedAt
 * @property {Function} create
 * @property {Function} update
 * @property {Function} findOne
 * @property {Function} findAll
 * @property {Function} findByPk
 * @property {ModelSmsHistories} dataValues
 * */

/**
 *
 * @typedef ModelMailHistories
 * @type {Object}
 * @property {number} id
 * @property {ISendNotificationType} sendType
 * @property {string} from
 * @property {string} to
 * @property {string} subject
 * @property {string} text
 * @property {string} templateId
 * @property {Object} dynamicTemplateData
 * @property {IStatus} status
 * @property {number} createdId
 * @property {Date} createdAt
 * @property {number} updatedId
 * @property {Date} updatedAt
 * @property {number} deletedId
 * @property {Date} deletedAt
 * @property {Function} create
 * @property {Function} update
 * @property {Function} findOne
 * @property {Function} findAll
 * @property {Function} findByPk
 * @property {ModelMailHistories} dataValues
 * */
