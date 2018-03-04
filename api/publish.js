const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.exports = function publish (Bucket, id) {
  const backupKey = `backup/${Date.now()}.html`
  const previewKey = `preview/${id}.html`
  return s3.copyObject({
    CopySource: `${Bucket}/index.html`,
    Bucket,
    Key: backupKey,
    ContentType: 'text/html'
  })
  .promise()
  .then(() => {
    return s3.copyObject({
      Bucket,
      Key: 'index.html',
      CopySource: `${Bucket}/${previewKey}`,
      ContentType: 'text/html'
    }).promise().then(() => 'index.html')
  })
  .catch((err) => {
    console.error(err)
    throw new Error(`Error publishing ${previewKey}. Backup: ${backupKey}`)
  })

}
