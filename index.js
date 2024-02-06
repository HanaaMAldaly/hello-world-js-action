//const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs');
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

//const { hideBin } = require('yargs/helpers');
//const yargs = require('yargs/yargs');
//const Moment = require("moment");
//const fs = require('fs');
//const { getOctokit, context } = require("@actions/github");
//const utils = require('../../helpers/utils');
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

const token = core.getInput("token")
const octokit = github.getOctokit(token);

async function createReleaseNotes() {

 const prList2 = await  octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: "HanaaMAldaly",
            repo: "hello-world-js-action",
            state: 'open'
        })


const prList =[{title: 'one',number:1,link:"wwww",owner:"hanaa"},
{title: 'two',number:2,link:"wwww",owner:"hanaa"},
{title: 'three',number:3,link:"wwww",owner:"hanaa"}]

  const formattedPRs = prList.map((pr) => {
    return `${pr.title} (#[${pr.number}](${pr.link})) - by ${pr.owner}`;
  });

  // Write formatted PRs to release notes file
  const releaseNotes =[
  //'Generated by GitHub SaaS action run: https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/actions/runs/823348',

  {title:'fix: CMSUnderAgeContract path',
  number:3179,
  link:'[3117](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3117',
  owner: 'marwan-salem',
  ticketsString:'OPB-16885'
  }]
  //(#[3179](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3179)) ([OPB-16885](https://cps.jira.agile.vodafone.com/browse/OPB-16885)) - by marwan-salem (05-02-2024 16:25 +00:00)',
//  '- feat: Add general error boundary  (#[3104](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3104)) ([OPB-17039](https://cps.jira.agile.vodafone.com/browse/OPB-17039)) - by hassan-mostafa2 (05-02-2024 16:22 +00:00)',
//  '- fix: security settings app id issue (#[3150](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3150)) ([OPB-18072](https://cps.jira.agile.vodafone.com/browse/OPB-18072)) - by iman-hegazy (05-02-2024 16:15 +00:00)',
//  '- fix: map behaviours in android (#[3120](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3120)) ([OPB-17911](https://cps.jira.agile.vodafone.com/browse/OPB-17911)) - by ester-antunes1 (05-02-2024 16:01 +00:00)',
//  '- fix: IOS crash when restart (#[3177](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3177)) ([OPB-18196](https://cps.jira.agile.vodafone.com/browse/OPB-18196)) - by ahmed-shaarawyshehata (05-02-2024 15:37 +00:00)',
//  '- feat: converged purchase calendar (#[3054](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3054)) ([OPB-16922](https://cps.jira.agile.vodafone.com/browse/OPB-16922)) - by andre-dargains (05-02-2024 15:24 +00:00)',
//  '- fix: removed vf-project header for al journeys (#[3124](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3124)) - by uendi-xhimo1 (05-02-2024 15:19 +00:00)',
//  '- feat: refill cms integration (#[3117](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3117)) ([OPB-16558](https://cps.jira.agile.vodafone.com/browse/OPB-16558)) - by luis-susaj (05-02-2024 15:19 +00:00)',
//  '- fix: changing rewards preprod url (#[3175](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp/pull/3175)) - by farah-elsayed (05-02-2024 15:17 +00:00)']
  fs.appendFileSync("release_notes.txt", releaseNotes.join('\n'));
  const tableData = [
    {data: 'PR', header: true},
    {data: 'Title', header: true},
    {data: 'Jira ticket', header: true},
    {data: 'Author', header: true},
    {data: 'link', header:true}
  ]

  let myMarkdown = `## My Header

  | PR | Title | Jira ticket | Author
  |--- |--- | --- | --- |
`

//   let myMarkdown = `## My Header
//
//     | PR | Title | Jira ticket | Author |
//     |--- |--- | --- | --- |
//`
  releaseNotes.map((pr)=>{
   //myMarkdown = myMarkdown.concat(`| ${pr.number} | ${pr.title} | ${pr.ticketsString} | ${pr.owner} | `)
  })
//  core.summary
//  .addHeading(releaseNotes[0],'2')
//  .addList(releaseNotes.slice(1,releaseNotes.length)).write({overwrite: true})
core.setOutput("time", releaseNotes.join('\n'))
//core.summary
//   .addTable([tableData])
//   .write()



//core.summary.addRaw(myMarkdown2).write()
    core.summary.addRaw(myMarkdown).write()
}

createReleaseNotes();
