// const { hideBin } = require("yargs/helpers");
// const yargs = require("yargs/yargs");
// const { getOctokit, context } = require("@actions/github");
// const utils = require("./utils");

// const yargsOptions = [
//   { name: "currentTag", params: { alias: "t", string: true } },
//   { name: "githubToken", params: { alias: "g", string: true } },
//   { name: "prerelease", params: { alias: "p", boolean: true } },
//   { name: "platform", params: { alias: "o", string: true } },
//   { name: "tenant", params: { alias: "m", string: true } },
//   { name: "baseBranch", params: { alias: "b", string: true } },
// ];

// const setupArgs = (extraArgs) => {
//   const yargsObj = yargs(hideBin(process.argv));

//   yargsOptions.forEach(arg => {
//     yargsObj.option(arg.name, arg.params);
//   });

//   extraArgs?.forEach(arg => yargsObj.option(arg.name, arg.params));

//   return yargsObj.help().argv;
// };

// const argv = setupArgs();

// console.log('yargsOptions:');
// Object.entries(argv)
//   .filter(([key]) => key !== '_')
//   .forEach(([key, value]) => {
//     const formattedKey = key.length > 1 ? `${key} (${yargsOptions.find(opt => opt.params.alias === key)?.name || key})` : key;
//     console.log(`${formattedKey}:`, value);
//   });

// const octokit = getOctokit(argv.githubToken);
// const { owner, repo } = context.repo;

// async function createRelease(currentTag, tenant, platform, prerelease, baseBranch) {
//   try {
//     // List tags
//     const { data: tagsList } = await octokit.rest.repos.listTags({
//       owner,
//       repo,
//       per_page: 100,
//     });

//     // Filter tags
//     const filteredTags = tagsList.filter(item =>
//       item.name.includes(`${tenant}-${platform}`) &&
//       item.name.includes("beta")
//     );

//     console.log("filteredTags:", filteredTags);

//     const latestTag = filteredTags?.[0]?.name;

//     console.log("latestTag:", latestTag);

//      // Create a new release
//         await octokit.rest.repos.createRelease({
//           owner,
//           repo,
//           tag_name: currentTag,
//           target_commitish: baseBranch,
//           name: currentTag,
//           body: "",
//           generate_release_notes: false,
//           draft: false,
//           prerelease: prerelease,
//         });

//     // Create a new release
//     const {release_id} = await octokit.rest.repos.createRelease({
//       owner,
//       repo,
//       tag_name: currentTag,
//       target_commitish: baseBranch,
//       name: currentTag,
//       body: newChangeLogData,
//       generate_release_notes: false,
//       draft: false,
//       prerelease: prerelease,
//     });

//  const newChangeLogData = await utils.createGithubReleaseNotes(octokit, owner, repo, currentTag, latestTag, baseBranch);

//     octokit.rest.repos.updateRelease({
//       owner,
//       repo,
//       release_id,
//       body:newChangeLogData
//     });
//   } catch (error) {
//     console.error("Error creating GitHub Release:", error);
//   }
// }

// createRelease(argv.currentTag, argv.tenant, argv.platform, argv.prerelease, argv.baseBranch);
console.log("hi")