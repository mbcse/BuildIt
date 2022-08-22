
import database from '../../database'
import server from '../../bin/www.js'
// import { conn as queue } from '../queueUtils'
import sleep from '../sleep'

export async function shutDown (onError = false) {
  console.log('XX-SERVER SHUTDOWN REQUEST RECIEVED-XX')
  if (onError) await sleep(50000)
  console.info(`Shutting Down Server and Resources ${onError ? 'Due to Error, For More Info Check Logs' : ''}`)
  console.log('Closing http server.')
  server.close(async () => {
    // console.log('Closing Queue Connection.')
    // if (queue) await queue.close()
    console.log('Closing Database Connection.')
    // boolean means [force], see in mongoose doc
    database.close(false, () => {
      console.log('Shutdown Successfull!')
      process.exit(0)
    })
  })
}
