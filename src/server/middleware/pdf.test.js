/* eslint-env node, mocha */
/* eslint-disable func-names, prefer-arrow-callback */

/* TODO get code coverage up */
import _fs from 'fs';
import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { Template } from 'nunjucks';
// import pdfjs from 'pdfjs-dist';
import Promise from 'bluebird';
import chaiAsPromised from 'chai-as-promised';

const fs = Promise.promisifyAll(_fs);

import { filters, createTemplate, renderData, generatePDF }
  from './pdf.js';
import { janeDoeData } from '~/test/data';

chai.use(dirtyChai);
chai.use(chaiAsPromised);

describe('compilation logic', function () {
  const emptyString = '';
  describe('custom njunjucks filters', function () {
    describe('#escapeTex()', function () {
      const escapeTex = filters.escapeTex;
      it('makes strings LaTeX-friendly', function () {
        expect(escapeTex(emptyString)).to.equal(emptyString);

        const backslash = '\\';
        const specialSymbols = '{}_#%&$';
        const tilde = '~';
        const caret = '^';
        const doubleQuotes = '"';
        const ellipsis = '...';

        const escapedBackslash = escapeTex(backslash);
        const escapedSpecialSymbols = escapeTex(specialSymbols);
        const escapedTilde = escapeTex(tilde);
        const escapedCaret = escapeTex(caret);
        const escapedDoubleQuotes = escapeTex(doubleQuotes);
        const escapedEllipsis = escapeTex(ellipsis);

        expect(escapedBackslash).to.equal('\\textbackslash');
        expect(escapedSpecialSymbols).to.equal('\\{\\}\\_\\#\\%\\&\\$');
        expect(escapedTilde).to.equal('\\~{}');
        expect(escapedCaret).to.equal('\\^{}');
        expect(escapedDoubleQuotes).to.equal('\'\'');
        expect(escapedEllipsis).to.equal('\\ldots');
      });
    });

    describe('#latexCommand()', function () {
      const latexCommand = filters.latexCommand;
      it('makes a string a LaTeX command', function () {
        expect(latexCommand(emptyString)).to.equal(emptyString);

        const raw = 'command';
        const cmd = latexCommand(raw);
        expect(cmd).to.equal('\\command');
      });
    });

    describe('#awesomeName()', function () {
      const awesomeName = filters.awesomeName;
      it('creates custom LaTeX command that splits the name into two parts', function () {
        expect(awesomeName(emptyString)).to.equal(emptyString);

        let combinedName = 'John Smith';
        let splitName = awesomeName(combinedName);
        expect(splitName).to.equal('\\name{John}{Smith}');

        combinedName = 'John Jacob Jingleheimer Schmidt';
        splitName = awesomeName(combinedName);
        expect(splitName).to.equal('\\name{John Jacob Jingleheimer}{Schmidt}');
      });
    });

    describe('#awesomeDate()', function () {
      const awesomeDate = filters.awesomeDate;
      it('converts jsonresume date to Date object to awesome resume date string', function () {
        expect(awesomeDate(emptyString)).to.equal(emptyString);

        const rawDate = '2014-12-01';
        const fmtDate = awesomeDate(rawDate);
        expect(fmtDate).to.equal('Dec 2014');
      });
    });
  });

  describe('nunjucks rendering', function () {
    describe('#createTemplate()', function () {
      it('creates a nunjucks template object', function () {
        const path = './test';
        const filename = 'jane_doe.tex';
        const tmpl = createTemplate(path, filename);
        expect(tmpl instanceof Template).to.be.true();
      });
    });

    describe('#generatePDF()', function () {
      it('returns null when no document generated', function () {
        const path = '.';
        const filename = 'empty.tex';
        let tmpl;
        fs.writeFileAsync(filename, emptyString).then(() => {
          tmpl = createTemplate(path, filename);
          generatePDF(path, tmpl, {}).then((pdfPath) => {
            expect(pdfPath).to.be.null();
          });
        }).catch(() => {
          fs.unlinkSync(filename);
        });
      });

      it('returns a path to the resulting PDF', function () {
        const path = './test';
        const filename = 'jane_doe.tex';
        const tmpl = createTemplate(path, filename);
        const latexCode = renderData(tmpl, janeDoeData);

        const res = generatePDF(latexCode, path, {});
        return expect(res).to.eventually.be.fulfilled();
      });

      // it('returns a path to a valid PDF with data matching the template', function (done) {
      //   const path = './test';
      //   const filename = 'jane_doe.tex';
      //   const tmpl = createTemplate(path, filename);
      //   const latexCode = renderData(tmpl, janeDoeData);
      //
      //   const res = generatePDF(latexCode, path, {});
      //   res.then((pdfPath) => {
      //     fs.statAsync(pdfPath).then((stats) => {
      //       expect(stats.isFile()).to.be.true();
      //       done();
      //       // const data = new Uint8Array(fs.readFileSync(pdfPath));
      //
      //     //   pdfjs.getDocument(data).then((doc) => {
      //     //     const numPages = getNumPages(doc);
      //     //     expect(numPages).to.equal(1);
      //     //
      //     //     const pdfText = getPDFText(doc);
      //     //     expect(pdfText.includes('Cartesian')).to.be.true();
      //     //     done();
      //     //   }, (pdfErr) => {
      //     //     done(pdfErr);
      //     //   });
      //     // }, (statsErr) => {
      //     //   done(statsErr);
      //     // });
      //     }, (err) => {
      //       done(err);
      //     });
      //   });
      // });
    });
  });
});
