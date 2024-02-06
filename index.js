//const core = require('@actions/core')
//const github = require('@actions/github')
//
//  core.summary
//  .addHeading('Test Results')
//  .addLink('View staging deployment!', 'https://github.com')
//  .write()
//
//try{
//    const name = core.getInput('who-to-greet')
//    console.log(`Hello ${name}!`)
//    const time = (new Date()).toTimeString()
//    core.setOutput("time",time)
//    const payload = JSON.stringify(github.context.payload,undefined,2)
//    console.log(`The event paylod: ${payload}`)
//
//}
//catch(error){
//    core.setFailed(error.message)
//}

const { hideBin } = require('yargs/helpers');
const yargs = require('yargs/yargs');
const Moment = require("moment");
const fs = require('fs');
const { getOctokit, context } = require("@actions/github");
const utils = require('../../helpers/utils');
const core = require('@actions/core')

//const yargsOptions = [
//  { name: 'latestReleaseDate', params: { alias: 'l', string: true } },
//  { name: 'currentReleaseDate', params: { alias: 'c', string: true } },
//  { name: 'filePath', params: { alias: 'f', string: true } },
//  { name: "githubToken", params: { alias: "t", string: true } },
//  { name: "baseBranch", params: { alias: "b", string: true } },
//];
//
//const setupArgs = (extraArgs) => {
//  const yargsObj = yargs(hideBin(process.argv));
//
//  yargsOptions.forEach((arg) => {
//    yargsObj.option(arg.name, arg.params);
//  });
//
//  extraArgs?.forEach((arg) => yargsObj.option(arg.name, arg.params));
//
//  return yargsObj.help().argv;
//};
//
//const argv = setupArgs();
//
//console.log('yargsOptions:');
//Object.entries(argv)
//  .filter(([key]) => key !== '_')
//  .forEach(([key, value]) => {
//    const formattedKey =
//      key.length > 1 ? `${key} (${yargsOptions.find((opt) => opt.params.alias === key)?.name || key})` : key;
//    console.log(`${formattedKey}:`, value);
//  });
//
//const Constants = Object.freeze({
//  ticketRegex: /https?:\/\/cps\.jira\.agile\.vodafone\.com\/browse\/[a-zA-Z0-9]+-[0-9]+/gim,
//  ticketFixedPart: 'https://cps.jira.agile.vodafone.com/browse/',
//});

const octokit = getOctokit(argv.githubToken);
const { owner, repo } = context.repo;

async function createReleaseNotes() {

 const prList = await  octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: "HanaaMAldaly",
            repo: "hello-world-js-action",
            state: 'open'
        })



  const formattedPRs = prList.map((pr) => {
    return `${pr.title} (#[${pr.number}](${pr.link})) - by ${pr.owner}`;
  });

  // Write formatted PRs to release notes file
  const releaseNotes = formattedPRs.join('\n')
  fs.appendFileSync(filePath, releaseNotes);
  core.summary.addDetails('Release Notes Summary', releaseNotes).write({overwrite: true})
}

createReleaseNotes();
