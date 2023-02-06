# What does this script do?

This script will go through every .git repository under a specified directory recursively and it will take all of the commits for the specified author in the specified time frame. Then for each commit it will take the commit date and the commit message and it will append each commit message to the specified out file in a separate line. For each commit message the script will make a separate commit in the specified git repository with the date of the actual commit.

# Why?

Most of the developers work in companies where their projects are usually scattered all over the place like Github, Gitlab, Bitbucket & other git servers. So, the idea of this script is to take all of the contributions for the specified author in a specific time frame and add those commits to a dummy repository on Github. That way all of the contributions will be added to the Github graph.

# Usage

```shell
yarn start <gitReposDirPath> <startDate> <endDate> <author> <outPath>
```

# Example

```shell
yarn start ~/git-repos 2022-01-01 2022-12-31 "John Doe" ~/dummy-outRepo
```
