process.env.GITHUB_REPOSITORY = 'VFGroup-MyVodafone-OnePlatform/MyVodafone-OneApp'

const { hideBin } = require('yargs/helpers');
const yargs = require('yargs/yargs');
const Moment = require("moment");
const fs = require('fs');
const github = require('@actions/github')
const utils = require('./utils');
const core = require('@actions/core')
const { Octokit } = require("@octokit/rest");


const { getOctokit, context } = require("@actions/github");
const yargsOptions = [
  { name: 'latestReleaseDate', params: { alias: 'l', string: true } },
  { name: 'currentReleaseDate', params: { alias: 'c', string: true } },
  { name: 'filePath', params: { alias: 'f', string: true } },
  { name: "githubToken", params: { alias: "t", string: true } },
  { name: "baseBranch", params: { alias: "b", string: true } },
];

const setupArgs = (extraArgs) => {
  const yargsObj = yargs(hideBin(process.argv));

  yargsOptions.forEach((arg) => {
    yargsObj.option(arg.name, arg.params);
  });

  extraArgs?.forEach((arg) => yargsObj.option(arg.name, arg.params));

  return yargsObj.help().argv;
};

const argv = setupArgs();

console.log('yargsOptions:');
Object.entries(argv)
  .filter(([key]) => key !== '_')
  .forEach(([key, value]) => {
    const formattedKey =
      key.length > 1 ? `${key} (${yargsOptions.find((opt) => opt.params.alias === key)?.name || key})` : key;
    console.log(`${formattedKey}:`, value);
  });

const Constants = Object.freeze({
  ticketRegex: /https?:\/\/cps\.jira\.agile\.vodafone\.com\/browse\/[a-zA-Z0-9]+-[0-9]+/gim,
  ticketFixedPart: 'https://cps.jira.agile.vodafone.com/browse/',
});

const octokit = new Octokit({
    baseUrl: "https://github.vodafone.com/api/v3", // Replace with your enterprise URL
    auth: argv.githubToken,
  });
  const { owner, repo } = context.repo;
  
async function createReleaseNotes(latestReleaseDate, currentReleaseDate, filePath, baseBranch) {
     
    if (
        Moment("2024-03-12T11:31:21Z").isBetween(
          Moment("2024-03-01T15:44:15+02:00"),
          Moment("2024-03-12T13:31:20+02:00"),
          undefined,
          '(]',
        )){
            console.log("Rigggggggggt")
        }
  const prList = await utils.getRepoPullRequests(
    octokit,
   owner,
        repo,
    latestReleaseDate,
    currentReleaseDate,
    baseBranch
  );

  // Format the release notes into a table to show them into workflow summary.
  let releaseNotesSummary = `## Release Notes

  | PR | Title | Jira ticket | Author
  |--- |--- | --- | --- |
`
  const formattedPRs = prList.map((pr) => {
    const mergedAtDate = Moment(pr.merged_at).format("DD-MM-YYYY HH:mm Z");
    const ticketsLinks = Array.from(
        new Set(pr.body?.match(Constants.ticketRegex))
      );
    const tickets = ticketsLinks?.map(element => {
        return `[${element.replace(Constants.ticketFixedPart, "")}](${element})`
    });
    // concat the ticket and it's link together. ex [OPB-16885](https://cps.jira.agile.vodafone.com/browse/OPB-16885)
    const ticketHyperLink = tickets.length ? `${tickets.join(",")}` : "";
    // format the ticket to add parenthesis around.
    const ticketsString = ticketHyperLink!=="" ? ` (${ticketHyperLink})` : "";
    // replace | with space - handle special chars in md table
    const escapedTitle = pr.title.replace(/\|/g, "\\|");
    // assemble releaseNotesSummary text
    releaseNotesSummary = releaseNotesSummary.concat(` ${escapedTitle} \n`)
    return `${pr.title} (#[${pr.number}](${pr.link}))${ticketsString} - by ${pr.owner} (${mergedAtDate})`;
  });
  console.log(releaseNotesSummary)

}

createReleaseNotes(argv.latestReleaseDate, argv.currentReleaseDate, argv.filePath, argv.baseBranch);