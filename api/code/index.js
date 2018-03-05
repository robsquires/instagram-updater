const generatePreview = require('./generate-preview')
const publish = require('./publish')

exports.generatePreview = (event, context, callback) => {
  const { bucketName, siteUrl } = getEnvs()

  if (writeOptionsResponse(event, callback)) {
    return
  }

  if (writeAuthResponse(event, callback)) {
    return
  }

  const { id } = JSON.parse(event.body)
  generatePreview(bucketName, id)
    .then(path => {
      callback(null, {
        statusCode: 201,
        body: JSON.stringify({
          url: `${siteUrl}/${path}`
        }),
        headers: getCorsHeaders()
      })
    })
    .catch(err => {
      console.error(err)
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({error: err.message}),
        headers: getCorsHeaders()
      })
    })
}

exports.publish = (event, context, callback) => {
  const { bucketName, siteUrl } = getEnvs()

  if (writeOptionsResponse(event, callback)) {
    return
  }

  if (writeAuthResponse(event, callback)) {
    return
  }
  const { id } = JSON.parse(event.body)
  publish(bucketName, id)
    .then(path => {
      callback(null, {
        statusCode: 201,
        body: JSON.stringify({
          url: `${siteUrl}/${path}`
        }),
        headers: getCorsHeaders()
      })
    })
    .catch(err => {
      console.error(err)
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({error: err.message}),
        headers: getCorsHeaders()
      })
    })
}

function getEnvs() {
  return {
    bucketName: process.env.BUCKET_NAME,
    siteUrl: process.env.SITE_URL,
    authKey: process.env.AUTH_KEY,
    allowedHost: process.env.ALLOWED_HOST
  }
}


function writeOptionsResponse(event, callback) {
  if (event.httpMethod === 'OPTIONS') {
    callback(null, {
      statusCode: 200,
      headers: getCorsHeaders()
    })
    return true
  }
}

function writeAuthResponse(event, callback) {
  const authToken = event.headers['X-Auth-Token']
  if (!authToken || authToken !== getEnvs().authKey) {
    callback(null, {
      statusCode: 401
    })
    return true
  }
}

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': getEnvs().allowedHost,
    'Access-Control-Allow-Headers': 'X-Auth-Token,Content-Type'
  }
}
