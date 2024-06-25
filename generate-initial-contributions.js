#!/usr/bin/env node

const { execSync } = require('child_process')
const { readFileSync, existsSync } = require('fs')
const { join } = require('path')

const args = process.argv.slice(2)
const [gitReposDirPath, startDate, endDate, author, outRepo] = args
if (!gitReposDirPath || !startDate || !endDate || !author || !outRepo) {
  throw new Error(
    'Please provide all arguments: gitReposDirPath, startDate, endDate, author, outPath'
  )
}

const currentRepoDirPath = join(outRepo)
const contributionsFile = join(outRepo, 'contributions.txt')
// find all git repositories in ${gitReposDirPath} git repositories
const gitRepos = execSync(`find ${gitReposDirPath} -name .git -type d -prune`, {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)
  .map((repo) => repo.replace('/.git', ''))

const executeCommit = (commitDate, commitMessage) => {
  const file = readFileSync(`${contributionsFile}`, { cwd: currentRepoDirPath })
  if (file.includes(commitMessage)) return
  if (commitMessage.length === 0) return
  if (!existsSync(contributionsFile))
    execSync(`touch ${contributionsFile}`, { cwd: currentRepoDirPath })
  execSync(`echo "${commitMessage}" >> ${contributionsFile}`, {
    cwd: currentRepoDirPath,
  })
  execSync(`git add .`, { cwd: currentRepoDirPath })
  execSync(
    `GIT_COMMITTER_DATE="${commitDate}" git commit --date="${commitDate}" -m "${commitMessage.replaceAll('"', '')}"`,
    { cwd: currentRepoDirPath }
  )
}

gitRepos.forEach((repo) => {
  let gitContributions
  try {
    gitContributions = execSync(
      `git log --pretty=format:"%ad - %an: %s" --after="${startDate}" --until="${endDate}" --author="${author}"`,
      { cwd: repo }
    ).toString()
  } catch (err) {
    console.error(`Error getting all contributions for ${repo}: ${err.message}`)
  }

  gitContributions?.split('\n').forEach((contribution) => {
    const contributionArray = contribution.split(' ')
    const commitDate = contributionArray.slice(0, 6).join(' ')
    const commitMessage = contributionArray.slice(8).join(' ')
    executeCommit(commitDate, commitMessage)
  })
})
