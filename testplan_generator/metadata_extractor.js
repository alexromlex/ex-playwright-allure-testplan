/**
 * Extract data fom test results and update tests metadata file
 */
class MetadataExecuter {
  constructor() {
    this.testResultsPath = 'test-results.json';
    this.testMetadataPath = 'metadata_tests.json';
    this.testsMetadata = [];
    this.testResults = [];
  }

  fetchTestsMetadata() {
    const fs = require('fs');
    
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
    } catch (error) {
      console.error('Error reading tests metadata:', error);
      this.testsMetadata = [];
    }
  }

  fetchTestResults() {
    const fs = require('fs');
    
    try {
      if (!fs.existsSync(this.testResultsPath)) {
        throw new Error(`Test results file not found: ${this.testResultsPath}`);
      }
      
      const data = fs.readFileSync(this.testResultsPath, 'utf8');
      this.testResults = JSON.parse(data);
    } catch (error) {
      console.error('Error reading test results:', error);
      this.testResults = { suites: [] };
    }
  }

  extractTestsFromSuites(suites, parentPath = '', collectedTests = []) {
    if (!Array.isArray(suites)) return collectedTests;
    
    suites.forEach(suite => {
      const currentPath = parentPath ? `${parentPath} › ${suite.title}` : suite.title;
      
      if (suite.specs && Array.isArray(suite.specs)) {
        suite.specs.forEach(spec => {
          const specPath = `${currentPath} › ${spec.title}`;
          const tags = spec.tags || [];
          if (spec.tests && Array.isArray(spec.tests)) {
            spec.tests.forEach(test => {
              collectedTests.push({
                ...test,
                group: suite.title !== suite.file ? suite.title : '',
                title: spec.title,
                fullPath: specPath,
                file: suite.file || spec.file,
                specId: spec.id,
                tags: tags,
              });
            });
          }
        });
      }
      
      if (suite.suites && Array.isArray(suite.suites)) {
        this.extractTestsFromSuites(suite.suites, currentPath, collectedTests);
      }
    });
    
    return collectedTests;
  }

  decodeBase64(body) {
    if (typeof body === 'string') {
      return Buffer.from(body, 'base64').toString('utf8');
    } else if (body && body.type === 'Buffer' && Array.isArray(body.data)) {
      return Buffer.from(body.data).toString('utf8');
    }
    return body.toString('utf8');
  }

  extract_check_metadata() {
    if (!this.testResults || !this.testResults.suites) {
      console.log('No test results found');
      return;
    }
    
    const allTests = this.extractTestsFromSuites(this.testResults.suites);
    console.log(`Found ${allTests.length} tests in results`);
    
    allTests.forEach(test => {
      const test_metadata = {
        id: '',
        group: test.group || '',
        name: test.title || '',
        path: test.fullPath || '',
        file: test.file || '',
        labels: [],
      };
      // console.log('test: ', test);
      if(test.tags.length) test_metadata.labels.push({ tag: test.tags });
      if (test.results && Array.isArray(test.results) && test.results.length > 0) {
        test.results.forEach(result => {
          if (result.attachments && Array.isArray(result.attachments)) {
            result.attachments.forEach(attachment => {
              if (!attachment.body) return;
              if (!attachment.name.includes('Allure Metadata')) return;
              
              try {
                const bodyString = this.decodeBase64(attachment.body);
                if (!bodyString) return;
                
                const metadataJSON = JSON.parse(bodyString);
                
                if (metadataJSON.data) {
                  if (metadataJSON.data.labels && Array.isArray(metadataJSON.data.labels)) {
                    metadataJSON.data.labels.forEach(label => {
                      
                      const { name, value } = label;
                      if (['ALLURE_ID', 'id'].includes(name)) {
                        test_metadata.id = value;
                      } else if (name === 'tag') {
                        let tagObj = test_metadata.labels.find(l => 'tag' in l);
                        if (!tagObj) {
                          tagObj = { tag: [] };
                          test_metadata.labels.push(tagObj);
                        }
                        
                        if (tagObj.tag && Array.isArray(tagObj.tag)) {
                          tagObj.tag.push(value);
                        }
                      } else {
                        test_metadata.labels.push({ [name]: value });
                      }
                    });
                  }
                }
              } catch (e) {
                console.log('Failed to parse attachment:', e.message);
              }
            });
          }
        });
      }
      const existingTestIndex = this.testsMetadata.findIndex(t => {
        if (test_metadata.id) {
          return (
            t.id === test_metadata.id &&
            t.name === test_metadata.name &&
            t.file === test_metadata.file
          );
        }
        return (
          t.name === test_metadata.name &&
          t.file === test_metadata.file &&
          t.path === test_metadata.path
        );
      });
      // console.log('test_metadata: ', existingTestIndex, test_metadata);
      if (existingTestIndex >= 0) {
        this.testsMetadata[existingTestIndex] = test_metadata;
      } else {
        if (test_metadata.id || test_metadata.name) {
          this.testsMetadata.push(test_metadata);
        }
      }
    });
  }

  updateTestsMetadata() {
    const fs = require('fs');
    
    try {
      fs.writeFileSync(
        this.testMetadataPath, 
        JSON.stringify(this.testsMetadata, null, 2)
      );
      console.log(`Tests metadata updated: ${this.testMetadataPath}`);
      console.log(`Total tests in metadata: ${this.testsMetadata.length}`);
    } catch (error) {
      console.error('Error updating tests metadata:', error);
    }
  }
}

const executer = new MetadataExecuter();
executer.fetchTestsMetadata();
executer.fetchTestResults();
executer.extract_check_metadata();
executer.updateTestsMetadata();

module.exports = MetadataExecuter;