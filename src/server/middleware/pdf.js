import nunjucks, { Template } from 'nunjucks';
// import winston, { Logger } from 'winston';
import { spawn } from 'child_process';
import _fs from 'fs';
import path from 'path';
import _ from 'lodash';
import _tmp from 'tmp';
import Promise from 'bluebird';

import { isNonEmptyString } from '../utils';

const awesomeFiles = './resources/awesome';
const resumeFile = 'resume.tex';

const fs = Promise.promisifyAll(_fs);
const tmp = Promise.promisifyAll(_tmp);

// TODO re-add logging later under a different module
// const pdfLogger = new(Logger)({
//   transports: [
//     new(winston.transports.Console)({ level: 'warn' }),
//     new(winston.transports.File)({ filename: 'logs/latex.log' }),
//   ],
// });

/* TODO find a place to put the below code when we start doing PDF generation with thunks */
// generateAwesomeResume(JSON.parse(fs.readFileSync('test/claudepark.json'), 'utf8'))
// .then((pdfPath) => {
//   fs.rename(pdfPath, './resume.pdf', (err) => {
//     if (err) throw err;
//     appLogger.log('info', 'PDF successfully generated and moved');
//   });
// });
/* END TODO */

const filters = {
  // Filter to make symbols LaTeX-friendly
  escapeTex: (raw) => {
    if (!isNonEmptyString(raw)) { return ''; }

    const latexSubs = [
      [/\\/g, '\\textbackslash'],
      [/([{}_#%&$])/g, '\\$1'],
      [/~/g, '\\~{}'],
      [/\^/g, '\\^{}'],
      [/"/g, '\'\''],
      [/\.\.\.+/g, '\\ldots'],
    ];
    let texString = raw;
    for (const rule of latexSubs) {
      texString = texString.replace(new RegExp(rule[0]), rule[1]);
    }

    return texString;
  },

  // Filter to make a string a LateX command
  latexCommand: (name) => {
    if (!isNonEmptyString(name)) { return ''; }

    return `\\${name}`;
  },

  // Filter to create custom LaTeX command specific to the awesome resume template
  awesomeName: (name) => {
    if (!isNonEmptyString(name)) { return ''; }

    const split = name.lastIndexOf(' ');
    return `\\name{${name.substring(0, split)}}{${name.substring(split + 1)}}`;
  },

  // Filter to turn jsonresume date to Date object to awesome resume date string
  awesomeDate: (date) => {
    if (!isNonEmptyString(date) && !_.isDate(date)) { return ''; }

    let dt;
    if (_.isString(date)) {
      const rawPattern = /(\d{2})\-(\d{2})\-(\d{4})/;
      dt = new Date(date.replace(rawPattern, '$3-$2-$1'));
    } else {
      dt = date;
    }
    const dtStr = dt.toUTCString();
    const ftmPattern = /^\w{3}, \d{2} (\w{3}) (\d{4}).*/;
    return dtStr.replace(ftmPattern, '$1 $2');
  },
};

function createTemplate(filepath, filename) {
  if (!isNonEmptyString(filepath)) {
    throw new Error('filepath is not a valid string');
  } else if (!isNonEmptyString(filename)) {
    throw new Error('filename is not a valid string');
  }

  const env = nunjucks.configure(filepath, {
    autoescape: false,
    trimBlocks: true,
    tags: {
      blockStart: '((*',
      blockEnd: '*))',
      variableStart: '(((',
      variableEnd: ')))',
      commentStart: '((#',
      commentEnd: '#))',
    },
  });
  Object.getOwnPropertyNames(filters).forEach((val) => {
    env.addFilter(val, filters[val]);
  });
  return env.getTemplate(filename, true);
}

function renderData(tmpl, userData, tmplData) {
  if (!(tmpl instanceof Template)) {
    throw new Error('template is not an instance of Template');
  } else if (_.isNil(userData)) {
    throw new Error('no data given');
  }

  let data = userData;
  if (!_.isNil(tmplData)) {
    data = _.merge(userData, tmplData);
  }
  return tmpl.render(data);
}

function getLatexArgs(options) {
  const args = ['--halt-on-error'];
  if (options.outputDir) args.push(`--output-directory=${options.outputDir}`);
  return args;
}

function generatePDF(texCode, filepath, options) {
  if (!isNonEmptyString(texCode)) {
    throw new Error('bad TeX code');
  } else if (!isNonEmptyString(filepath)) {
    throw new Error('filepath not a valid string');
  } else if (!_.isNil(options) && !_.isPlainObject(options)) {
    throw new Error('bad options');
  }
  const pdfPath = `${filepath}/texput.pdf`;

  return new Promise((resolve, reject) => {
    const xelatex = spawn('xelatex', getLatexArgs(options), { cwd: filepath });
    xelatex.stdin.write(texCode);

    // xelatex.stdout.on('data', (data) => {
    //   pdfLogger.log('info', `stdout: ${data}`);
    // });

    xelatex.on('close', (code) => {
      if (code === 0) {
        fs.statAsync(pdfPath).then((stats) => {
          if (!stats.isFile()) {
            reject(new Error('No PDF generated'));
          }
          resolve(pdfPath);
        });
      }});

    xelatex.on('disconnect', reject);
    xelatex.on('error', reject);
  });
}

function generateAwesomeResume(data) {
  if (!_.isPlainObject(data)) {
    throw new Error('inalid data object');
  }
  const tmpl = createTemplate(awesomeFiles, resumeFile);
  const texCode = renderData(tmpl, data);

  return new Promise((resolve) => {
    tmp.dirAsync({ unsafeCleanup: true }).then((tmpPath) => {
      fs.readdirAsync(`${awesomeFiles}`).then((filenames) => {
        const newFiles = [];
        for (const filename of filenames) {
          newFiles.push(fs.symlinkAsync(path.resolve(`${awesomeFiles}/${filename}`),
                        path.resolve(`${tmpPath}/${filename}`)));
        }
        const res = generatePDF(texCode, tmpPath, {});
        Promise.all(newFiles).then(res.then((pdf) => (resolve(pdf))));
      });
    });
  });
}

// filters object
export { filters };

// functions
export { createTemplate, renderData, generatePDF, generateAwesomeResume };
