const fs = require('fs-promise');
const path = require('path');
const cheerio = require('cheerio');
const async = require('async');
const await = require('await');

// Configuration Nd Constants

const root = path.resolve(__dirname, '../../src/app/');
const dirNameArr = ['core', 'experience', 'root', 'support'];
const ERROR_DESC_HEAD = 'ERROR: ';
const ERROR_DESC_TAIL = ': Add href="javascript:void(0)" instead of href=""';

// Flattening the array and filtering with .html extension
// return filtered html file names

const flattenNdFilterHtml = (arr) => Array.prototype
  .concat(...arr)
  .filter(fileName => fileName.indexOf('.html') >= 0);
  
// Check html content for given lint violation 
// @param html: string - HTML content
// @return boolean 

const violationCheck = (html) => {
  var $ = cheerio.load(html);
  return $("a").attr('href') === "";
}

// Parse files and console violations if any through printViolations()
// @param htmlFiles: string[] - html files array from the read directory fn

const parseFilesAndPrint = (htmlFiles) => {
  const printViolations = (violations) => {
    if (violations.length) {
      console.log(violations.join('\n'));
      process.exit(1);
    }else{
      console.log('All files passed html linting.');
    }
  };
  parseHTMLFiles(htmlFiles).then(printViolations);
};

// Read all html files and extract files with violation 
// @param htmlFiles: string[] - html file names
// @return violationArr: string[] - Violation description with filenames  

async function parseHTMLFiles(htmlFiles) {
  const violationArr = [];
  for (let htmlFile of htmlFiles) {
    await fs.readFile(htmlFile, 'utf-8')
      .then((htmlContent) => {
        if (violationCheck(htmlContent)) {
          violationArr.push(ERROR_DESC_HEAD.concat(htmlFile, ERROR_DESC_TAIL));
        }
      });
  }
  return await Promise.all(violationArr);
};

// Asynchronous fn to read html files from a directory including subfolders
// @param dirPath: string - Directory path
// @return string[] html file names

async function getFileDescendents(dirPath) {
  let files = await fs.readdir(dirPath);
  let result = files.map(file => {
    let p = path.join(dirPath, file);
    return fs.stat(p).then(stat => stat.isDirectory() ? getFileDescendents(p) : p);
  });
  return flattenNdFilterHtml(await Promise.all(result));
};

// Scan all folders and sub folders from 'folderNameArr' for html files asynchronously
// @return  htmlFiles: string[]. Collection of html files after reading all directories

async function parseAllFolders() {
  const htmlFiles = [];
  const separator = '\\';
  const pushFiles = (data) => {
    htmlFiles.push(...data);
  };
  for (let dirName of dirNameArr) {
    await getFileDescendents(root
        .concat(separator, dirName))
      .then(pushFiles);
  }
  return await Promise.all(htmlFiles);
}

// Start 
parseAllFolders().then(parseFilesAndPrint);
