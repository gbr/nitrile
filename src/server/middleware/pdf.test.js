/* eslint-env node, mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import _fs from 'fs';
import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { Template } from 'nunjucks';
import pdfjs from 'pdfjs-dist';
import Promise from 'bluebird';
import chaiAsPromised from 'chai-as-promised';
import glob from 'glob';
import path from 'path';

import { filters, createTemplate, renderData, generatePDF }
  from './pdf.js';

const fs = Promise.promisifyAll(_fs);

import { janeDoeData } from '~/test/fixtures/assets/data';

const testAssets = path.resolve('./test/fixtures/assets');
pdfjs.PDFJS.workerSrc = '~/node_modules/pdfjs-dist/build/pdf.worker.js';

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
        const filename = 'jane_doe.tex';
        const tmpl = createTemplate(testAssets, filename);
        expect(tmpl instanceof Template).to.be.true();
      });
    });

    afterEach(function () {
      glob(`${testAssets}/texput*`, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.unlinkSync(file);
        }
      });
    });

    describe('#generatePDF()', function () {
      it('generates empty page when given no LaTeX code', function (done) {
        const res = generatePDF(testAssets);
        expect(res).to.eventually.be.fulfilled();
        done();
      });

      it('returns a testAssets to the resulting PDF', function (done) {
        const filename = 'jane_doe.tex';
        const tmpl = createTemplate(testAssets, filename);
        const latexCode = renderData(tmpl, janeDoeData);

        const res = generatePDF(testAssets, latexCode);
        expect(res).to.eventually.be.fulfilled();
        done();
      });

      it('returns a path to a valid PDF with data matching the template', function (done) {
        const filename = 'jane_doe.tex';
        const tmpl = createTemplate(testAssets, filename);
        const latexCode = renderData(tmpl, janeDoeData);

        const res = generatePDF(testAssets, latexCode);
        res.then((pdfPath) => {
          fs.statAsync(pdfPath).then((stats) => {
            expect(stats.isFile()).to.be.true();
            const data = new Uint8Array(fs.readFilSync(pdfPath));

            pdfjs.getDocument(data).then((doc) => {
              const numPages = doc.numPages;
              expect(numPages).to.equal(1);

              const pdfText = doc.getTextContent().then((content) => {
                content.items.map((item) => item.str);
              });
              expect(pdfText.includes('Cartesian')).to.be.true();
              done();
            },
            (pdfErr) => {
              done(pdfErr);
            });
          },
          (statsErr) => {
            done(statsErr);
          });
        },
        (err) => {
          done(err);
        });
        done();
      });
    });
  });
});
