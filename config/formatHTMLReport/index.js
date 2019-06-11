const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../');
const configFilePath = root + '/reports/linters/html-lint-report.log';
fs.readFile(configFilePath, 'utf8', (err, data) => {
  if (err) return console.log(err);
  console.log(data);
  var result = data.replace(/[[]\d+[m]/g, '');

  fs.writeFile(configFilePath, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });

}); 
