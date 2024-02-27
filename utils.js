const Moment = require('moment');

const Constants = Object.freeze({
  ticketRegex: /https?:\/\/cps\.jira\.agile\.vodafone\.com\/browse\/[a-zA-Z0-9]+-[0-9]+/gim,
  ticketFixedPart: 'https://cps.jira.agile.vodafone.com/browse/',
  groupingRegex: /\(\s?Part\s?\d+\s?\/\s?\d+\s?\)/gim,
  manualPRregex: /\[Manual-PR\]/i,
  manualMergeRegex: /\[Manual-Merge\]/i,
  autoPRregex: /\[Auto-PR\]/i,
  botUser: 'vfcoreappdeployment',
  botUser2: 'vfgroupfunc-oneplatform',
});

const endPoints = Object.freeze({
  pullRequests: 'GET /repos/{owner}/{repo}/pulls',
});

const getRepoPullRequests = async (octokit, owner, repo, latestReleaseDate, currentReleaseDate, baseBranch) =>
  new Promise(async (resolve, _) => {
    {
      let endReached = false;
      let pageNumber = 1;
      let PRsList = [];

      while (!endReached) {
        const data = await octokit.request(endPoints.pullRequests, {
          owner: owner,
          repo: repo,
          state: 'closed',
          base: baseBranch,
          per_page: 100,
          page: pageNumber,
          sort: 'updated',
          direction: 'desc',
        });
        if (data.data.length === 0) {
          endReached = true;
          break;
        }
        data.data
          .filter(
            (item) =>
              item.merged_at &&
              !!!item.title.match(Constants.manualPRregex) &&
              !!!item.title.match(Constants.manualMergeRegex) &&
              !!!item.title.match(Constants.autoPRregex) &&
              item.user.login !== Constants.botUser &&
              item.user.login !== Constants.botUser2,
          )
          .some((item) => {
            if (Moment(item.updated_at).isBefore(latestReleaseDate)) {
              endReached = true;
              return true;
            }

            if (
              Moment(item.merged_at).isBetween(
                Moment(latestReleaseDate),
                Moment(currentReleaseDate),
                undefined,
                '(]',
              ) ||
              // If current date is null then the tags hasn't created yet.
              currentReleaseDate == null && Moment(item.merged_at).isAfter(latestReleaseDate)
            )
              PRsList.push({
                title: item.title,
                merged_at: item.merged_at,
                updated_at: item.updated_at,
                owner: item.user.login,
                number: item.number,
                link: item._links.html.href,
                body: item.body,
              });
          });
        pageNumber++;
      }

      if (endReached && PRsList) {
        resolve(PRsList);
      }
    }
  });

const removePartPattern = (item) => item.replace(Constants.groupingRegex, '');

const convertForCompare = (item) => removePartPattern(item.title.trim().toLowerCase());

const grouping = (list) => {
  const handledLinksList = list.map((item) => ({
    ...item,
    link: `[#${item.number}](${item.link})`,
  }));

  const grouped = [];

  handledLinksList.forEach((element) => {
    const index = grouped.findIndex((item) => convertForCompare(item) === convertForCompare(element));
    if (index !== -1) {
      grouped[index].link += ` ${element.link}`;
      grouped[index].doubled = true;
      grouped[index].body += `\n ${element.body}`;
    } else grouped.push(element);
  });

  return grouped;
};

const sortChangeLogTitles = (changeLogs) => {
  const sortedChangeLogs = changeLogs
    .map((item) => {
      const withTicket = Array.from(new Set(item.body?.match(Constants.ticketRegex)));

      const ticketsString = withTicket.length
        ? `(${withTicket.map((element) => {
            return `[${element.replace(Constants.ticketFixedPart, '')}](${element})`;
          })})`
        : '';

      return `${item.doubled ? removePartPattern(item.title) : item.title} ${ticketsString} ${item.link}`;
    })
    .sort((title1, title2) => {
      if (title1.includes('feat:')) return -1;
      else if (title1.includes('fix:') && !title2.includes('feat:')) return -1;
      else if (title1.includes('refactor:') && !title2.includes('feat:') && !title2.includes('fix:'))
        return -1;
      else if (
        title1.includes('build:') &&
        !title2.includes('feat:') &&
        !title2.includes('refactor:') &&
        !title2.includes('fix:')
      )
        return -1;
      else if (
        title1.includes('chore:') &&
        !title2.includes('feat:') &&
        !title2.includes('refactor:') &&
        !title2.includes('build:') &&
        !title2.includes('fix:')
      )
        return -1;
    });

  return sortedChangeLogs;
};

const headingsSplitting = (list) => {
  const feats = [];
  const fixes = [];
  const others = [];
  list.map((item) => {
    if (item.startsWith('feat:')) feats.push(item);
    else if (item.startsWith('fix:')) fixes.push(item);
    else others.push(item);
  });
  return { feats: feats, fixes: fixes, others: others };
};

const formatNewChangeLogData = (newData, newVersion, repo, oldVersion) => {
  let repoChangeLog = `## What's Changed\n`;

  const data = headingsSplitting(newData ?? []);

  if (data.feats.length) {
    repoChangeLog += '### Features and enhancements\n';
    data.feats.map((element) => (repoChangeLog += `- ${element}\n`));
  }

  if (data.fixes.length) {
    repoChangeLog += '### Fixed bugs\n';
    data.fixes.map((element) => (repoChangeLog += `- ${element}\n`));
  }

  if (data.others.length) {
    repoChangeLog += '### Other changes\n';
    data.others.map((element) => (repoChangeLog += `- ${element}\n`));
  }

  const fullLogs = `\n**Full Changelog**: [${oldVersion}...${newVersion}](https://github.vodafone.com/VFGroup-MyVodafone-OnePlatform/${repo}/compare/${oldVersion}...${newVersion})`;
  repoChangeLog += fullLogs;

  return repoChangeLog;
};
// Get the tag commit date.
async function getTagCommitDate(octokit,owner, repo, tag) {
  try {
    const { data: tagInfo } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `tags/${tag}`
    });

    const { data: commit } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: tagInfo.object.sha
    });

    return commit.author.date;
  } catch (error) {
    console.error("Error fetching tag creation date:", error.message);
    return null;
  }
}

const createGithubReleaseNotes = async (octokit, owner, repo, currentTag, previousTag, baseBranch) => {
  const previousRelease = await octokit.rest.repos.getReleaseByTag({
    owner: owner,
    repo: repo,
    tag: previousTag,
  });
  const previousReleaseDate = previousRelease.data.created_at;

  console.log('previousReleaseDate:', previousReleaseDate);

 // The current tag hasn't been released yet, So we get the date of tag commit.
  const currentReleaseDate = await getTagCommitDate(octokit,owner,repo, currentTag)
  console.log('currentReleaseDate:', currentReleaseDate);

  const repoChangeLog = await getRepoPullRequests(
    octokit,
    owner,
    repo,
    previousReleaseDate,
    currentReleaseDate,
    baseBranch,
  );

  //grouping similar PRs
  const groupedLogs = grouping(repoChangeLog);

  // getting sorted changleLogs
  const sortedChangeLogs = sortChangeLogTitles(groupedLogs);

  // generating final Changelogs
  const newChangeLogData = formatNewChangeLogData(sortedChangeLogs, currentTag, repo, previousTag);

  console.log('[Console] Github Release notes:\n', newChangeLogData);

  return newChangeLogData;
};

module.exports.getRepoPullRequests = getRepoPullRequests;
module.exports.createGithubReleaseNotes = createGithubReleaseNotes;

