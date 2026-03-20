/**
 * rewrite test-list.txt based on user query
 * - if test-list.txt doesn't exist, create it empty
 * - filter data from metadata_tests.json based on user query and write to test-list.txt
 * - if user query is empty, write all tests to test-list.txt
 */
const TestFilter = require('./filter_tests.js');
const fs = require('fs');
const path = require('path');

class TestListGenerator {
  constructor() {
    this.testMetadataPath = 'metadata_tests.json';
    this.testListPath = 'test-list.txt';
    this.testsMetadata = [];
  }

  fetchTestsMetadata() {
    try {
      if (fs.existsSync(this.testMetadataPath)) {
        const data = fs.readFileSync(this.testMetadataPath, 'utf8');
        this.testsMetadata = JSON.parse(data);
        if (!Array.isArray(this.testsMetadata)) {
          this.testsMetadata = [];
        }
      } else {
        fs.writeFileSync(this.testMetadataPath, JSON.stringify([]));
        this.testsMetadata = [];
      }
      console.log(`Fetched ${this.testsMetadata.length} tests metadata.`);
    } catch (error) {
      console.error('Error reading tests metadata:', error);
      this.testsMetadata = [];
    }
  }

  generateTestList(tests) {
    try {
      if (!fs.existsSync(this.testListPath)) {
        fs.writeFileSync(this.testListPath, '');
      }
      fs.writeFileSync(this.testListPath, tests.map((test) => test.path).join('\n'));
      console.log(`Generated test list with ${tests.length} tests.`);
    } catch (error) {
      console.error('Error generating test list:', error);
    }
  }

  filterTests(query) {
    const queryJSON = typeof query === 'string' ? JSON.parse(query) : query;
    const filter = new TestFilter(this.testsMetadata);
    return filter.filter(queryJSON);
  }

  writeJson (filePath, data) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
}

// const query = {};

// const geneator = new TestListGenerator();
// geneator.fetchTestsMetadata();

// const findedTests = geneator.filterTests(query)
// geneator.generateTestList(findedTests);

module.exports = TestListGenerator;
