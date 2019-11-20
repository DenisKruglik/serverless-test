var serverlessSDK = require('./serverless_sdk/index.js')
serverlessSDK = new serverlessSDK({
tenantId: 'deniskruglik',
applicationName: 'aws-test',
appUid: 'JSZVVZp1y12fYHjdz8',
tenantUid: '9DSQrvyQ4gFSrp1MSP',
deploymentUid: '35af5dc4-1182-40cd-8f50-75611a04dbcb',
serviceName: 'aws-test',
stageName: 'dev',
pluginVersion: '3.2.3'})
const handlerWrapperArgs = { functionName: 'aws-test-dev-hello', timeout: 6}
try {
  const userHandler = require('./handler.js')
  module.exports.handler = serverlessSDK.handler(userHandler.addMessage, handlerWrapperArgs)
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs)
}
