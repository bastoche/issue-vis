# issue-vis
[![Build Status](https://travis-ci.org/bastoche/issue-vis.svg?branch=master)](https://travis-ci.org/bastoche/issue-vis)

Visualize github issues.

## Requirements

- [node](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/en/docs/install)

## Setup

### Install dependencies

```sh
yarn
```

### Local configuration

Create a file named `.env.local` at the root of the project and fill in the following properties:
- REACT_APP_GITHUB_TOKEN={your_github_oauth_token}
- REACT_APP_REPOSITORIES={the_comma_separated_list_of_repositories_you_are_interested_in}

## Launch

```sh
yarn start
```