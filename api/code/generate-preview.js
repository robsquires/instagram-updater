const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.exports = function generatePreview (Bucket, id) {
  return s3.getObject({ Bucket, Key: 'index.html'})
    .promise()
    .then(({ Body }) => {
      const html = Body.toString()
      const newHTML = html.replace(/(data-instgrm-permalink="https:\/\/www.instagram.com\/p\/)([^\/]*)/, `$1${id}`)
      const path = `preview/${id}.html`
      return s3.putObject({
        Bucket,
        Key: path,
        Body: new Buffer(newHTML, 'utf8'),
        ContentType: 'text/html'
      }).promise().then(() => path)
    })
}
