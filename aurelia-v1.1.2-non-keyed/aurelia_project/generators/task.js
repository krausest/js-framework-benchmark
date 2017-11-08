import {inject} from 'aurelia-dependency-injection';
import {Project, ProjectItem, CLIOptions, UI} from 'aurelia-cli';

@inject(Project, CLIOptions, UI)
export default class TaskGenerator {
  constructor(project, options, ui) {
    this.project = project;
    this.options = options;
    this.ui = ui;
  }

  execute() {
    return this.ui
      .ensureAnswer(this.options.args[0], 'What would you like to call the task?')
      .then(name => {
        let fileName = this.project.makeFileName(name);
        let functionName = this.project.makeFunctionName(name);

        this.project.tasks.add(
          ProjectItem.text(`${fileName}.js`, this.generateSource(functionName))
        );

        return this.project.commitChanges()
          .then(() => this.ui.log(`Created ${fileName}.`));
      });
  }

  generateSource(functionName) {
    return `import gulp from 'gulp';
import changed from 'gulp-changed';
import project from '../aurelia.json';

export default function ${functionName}() {
  return gulp.src(project.paths.???)
    .pipe(changed(project.paths.output, {extension: '.???'}))
    .pipe(gulp.dest(project.paths.output));
}

`;
  }
}
