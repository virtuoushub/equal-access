/******************************************************************************
     Copyright:: 2020- IBM, Inc

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  *****************************************************************************/

/*******************************************************************************
 * NAME: onSpecComplete.js
 * DESCRIPTION: Used to test the onSpecComplete function in
 *              ACReporter.js

 *******************************************************************************/

'use strict';

// Load all the modules that are needed
var test = require('ava');
var path = require('path');
var decache = require('decache');
var EventEmitter = require('events').EventEmitter;

// Load the function that will be tester
var ACReporter = require(path.join(__dirname, '..', '..', '..', '..', 'src', 'lib', 'reporters', 'ACReporter'));
var ACCommon = require(path.join(__dirname, '..', '..', '..', '..', 'src', 'lib', 'ACCommon'));
var ACReporterCommon = require(path.join(__dirname, '..', '..', '..', '..', 'src', 'lib', 'reporters', 'ACReporterCommon'));

// Load a mock logger and set it in to ACReporterCommon
ACCommon.log = require(path.join(__dirname, '..', '..', 'unitTestCommon', 'commonTestHelpers', 'logger'));

// Stores the unitTest common objects
var unitTestCommon;

// Path to the unitTest common module
var unitTestCommonModule = path.join(__dirname, '..', '..', 'unitTestCommon', 'commonTestHelpers', 'unitTestCommon');

// Mock baseReporterDecorator function, which is needed by karma reporter
var baseReporterDecorator = function (base) {

};

// Build an emitter to mock dispatch emmiter events to be picked up
// by the karma ACReporter
var emitter = new EventEmitter();

test.beforeEach(function () {
    decache(unitTestCommonModule);
    unitTestCommon = require(unitTestCommonModule);
});

test('onSpecComplete(browser, result) should not profile to metrics server', function (ava) {

    // Create a new object for ACReporter
    var ACReporterObject = new ACReporter(baseReporterDecorator, unitTestCommon.configMock, ACCommon.log, emitter);

    // Call the onSpecComplete function to identify when a browser has started
    // Sending empty result object currently as we don't make use of it currently
    // Send only browser.name in the browser object as that is all we are making use of
    ACReporterObject.onSpecComplete({ name: "Firefox 44.0.0 (Mac OS X 10.11.0)" }, {});

    ava.is(true, true);
});

test('onSpecComplete(browser, result) should parse the results.log[0] and write it to a file and also profile for metrics server', function (ava) {

    delete unitTestCommon.configMock.ACProfile;

    // Create a new object for ACReporter
    var ACReporterObject = new ACReporter(baseReporterDecorator, unitTestCommon.configMock, ACCommon.log, emitter);

    // Call the onRunStart function to init the summary
    ACReporterObject.onRunStart();

    // stringify the scan results example
    var resultsString = JSON.stringify(unitTestCommon.scanPageOutput);

    // Build the results object which would be built by the karma reporter when called
    // Only add log, as that is all that is used currently.
    var results = {
        log: [resultsString + "'"],
        time: 23
    };

    // Call the onSpecComplete function identify that the test has finished, and also parse the results
    // Send only browser.name in the browser object as that is all we are making use of
    ACReporterObject.onSpecComplete({ name: "Firefox 44.0.0 (Mac OS X 10.11.0)" }, results);

    ava.is(true, true);
});

test.afterEach.always(function () {
    decache(unitTestCommonModule);
    unitTestCommon = undefined;
});