import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main'

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options);
  await createProject(options);
}

const parseArgumentsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      // arguements 
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      // aliases
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install'
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false
  }
}

const promptForMissingOptions = async (options) => {
  const defaultTemplate = 'Javascript';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    }
  }
  const questions = [];

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use ',
      choices: ['Javascript', 'Typescript', 'JavascriptModel'],
      default: defaultTemplate
    })
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository ?',
      default: false
    })
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git
  }

}