# project-tool

This repository contains the base library for a personal project tool.
The tool is written as an exercise and from a peculiar need of the author.
The actual repository does not contain a project tool, but rather
classes, structures, and functions to create one in different environments
(like CLI or web). Future applications will be listed in this repository to keep
track of different applications.

## Installation

Should someone besides the author want to use it, installation requires
setting up your local npm with packages deployed on GitHub. This can be done
by updating the `.npmrc` in your repository with the following lines:

```
# For pipelines use ${{ secrets.GITHUB_TOKEN }}
# For local use Github personal access token
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@pawel-kuznik:registry=https://npm.pkg.github.com
```

A potential user would need to generate a GitHub personal access token that
has `packages:read` access to this repository. Afterwards, installation could
be done with:

```
npm install --save @pawel-kuznik/project-tool
```

Notably, the repository requires access to `@pawel-kuznik/iventy` package as well
as it's a dependency of this repository.

If you are a prospective recruiter or a team lead interested in hiring the author
of this repository, just shoot me a message and access can be arranged :)

## Basic usage

The entry point of the package is a `Repository` class. This class allows
for creation and management of lists of tasks. Tasks are singular and actionable
assignments (the single "todo" in a "todo" application). Basic management could 
look like:

```
// Create a repository instance
const repository = new Repository();

// Create a new task inside the repository. This will fire events allowing UI applications
// to react to creation having only access to repository.
const task = repository.createTask()
    .setTitle("Show how to use a task");

// This is how a task can be managed. Consider it done.
task.setStatus("done");
```

## License

One can look at the code. For now, don't do anything else with it without prior permission from the author.