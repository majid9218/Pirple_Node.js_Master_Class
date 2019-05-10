/* TEST RUNNER */

//set app obj
_app = {};

//set app tests obj
_app.tests = {};

//set unit tests
_app.tests.unit = require('./unit');

//get number of tests
_app.countTests = () => {
    let count = 0;
    for(let key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            let unitTest = _app.tests[key];
            for(let testName in unitTest){
                if(unitTest.hasOwnProperty(testName)){
                    count ++;
                }
            }
        }
    }
    return count;
};

//run all tests
_app.runTests = () => {
    //set counter, successes, limit and errors variables
    let counter = 0;
    let successes = 0;
    const limit = _app.countTests();
    const errors = [];
    //loop for all test units and assert every test
    for(let key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            let unitTest = _app.tests[key];
            for(let testName in unitTest){
                if(unitTest.hasOwnProperty(testName)){
                    (() => {
                        const currentTestName = testName;
                        const currentTestValue = unitTest[testName];
                        try{
                            //if the function callback without throwing
                            currentTestValue(() => {
                                console.log('\x1b[32m%s\x1b[0m', currentTestName);
                                counter ++;
                                successes ++;
                                if(counter == limit){
                                    _app.produceTestReport(limit, successes, errors);
                                }
                            });
                        }catch(e){
                            //if the function throws an error
                            console.log('\x1b[31m%s\x1b[0m', currentTestName);
                            counter ++;
                            errors.push({
                                'name': currentTestName,
                                'error': e
                            });
                            if(counter == limit){
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    })();
                }
            }
        }
    }
};

//producing test report
_app.produceTestReport = (limit, successes, errors) => {
    console.log('');
    console.log('---------- BEGING TEST REPORT ----------');
    console.log('');
    console.log('Total Tests: ', limit);
    console.log('Pass:        ', successes);
    console.log('Fail:        ', errors.length);
    console.log('');
    //if there is errors, produce error report
    if(errors.length > 0){
        console.log('---------- BEGING ERROR REPORT ----------');
        console.log('');
        errors.forEach(err => {
            console.log('\x1b[31m%s\x1b[0m', err.name);
            console.log(err.error);
            console.log('');
        });
        console.log('---------- END ERROR REPORT ----------');
        console.log('');
    }
    console.log('---------- END TEST REPORT ----------');
    console.log('');
    process.exit(0);
};

//run all tests
_app.runTests();
