const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, './package.json'));
let packageJson = JSON.parse(content);

gulp.task('package', async function() {
  delete packageJson.scripts;
  delete packageJson.devDependencies;
  packageJson.engines = {
    node: '>=6'
  };
  await fs.writeFileSync(
    path.resolve(__dirname, './lib/package.json'),
    JSON.stringify(packageJson, null, 2)
  );
});

gulp.task('build', function() {
  return gulp.src(['./index.js', './README.md']).pipe(gulp.dest('./lib/'));
});
