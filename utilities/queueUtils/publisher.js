import { channel } from '.'

export default async function publishToQueue (queueName, data) {
  // console.log(queueName,data);
  console.log('----------------------inserted to queue----------------')
  await channel.assertQueue(queueName)
  // eslint-disable-next-line
  const respData = channel.sendToQueue(queueName, new Buffer.from(JSON.stringify(data)), { persistent: true })
  console.log(respData, '---------------')
}
