const core = require('@actions/core')
const github = require('@actions/github')

try{
    const name = core.getInput('who-to-greet')
    console.log(`Hello ${name}!`)
    const time = (new Date()).toTimeString()
    core.setOutput("time",time)
    const payload = JSON.stringify(github.context.payload,undefined,2)
    console.log(`The event paylod: ${payload}`)
  
   await core.summary
  .addHeading('Test Results')
  .addLink('View staging deployment!', 'https://github.com')
  .write()
}
catch(error){
    core.setFailed(error.message)
}
