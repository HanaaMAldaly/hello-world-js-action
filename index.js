const core = require('@actions/core')
const github = require('@actions/github')

  core.summary
  .addHeading('Test Results')
  .addLink('View staging deployment!', 'https://github.com')
  .write()

try{
    const name = core.getInput('who-to-greet')
    console.log(`Hello ${name}!`)
    const time = (new Date()).toTimeString()
    core.setOutput("time",time)
    const payload = JSON.stringify(github.context.payload,undefined,2)
    console.log(`The event paylod: ${payload}`)
  
}
catch(error){
    core.setFailed(error.message)
}
