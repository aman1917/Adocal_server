# GSTIN Validator

* Validates GSTIN number for length (15 digits), format (State code, PAN, Entity Number, Z, Checksum) and checksum as per the algorithm published at [GSTN portal](http://developer.gstsystem.co.in/pages/apiportal/data/gsp/download/GSTIN_Validation_SampleCode.zip)

![build](https://gitlab.com/srikanthlogic/gstin-validator/badges/master/build.svg)
![npm](https://img.shields.io/npm/dw/gstin-validator.svg)


## Installation 

    npm install gstin-validator

## Use

    var validator = require('gstin-validator');
    validator.isValidGSTNumber('12AAACI1681G1Z0');
	validator.ValidateGSTIN('47AAACI1681G1Z0');
	validator.getGSTINInfo('12AAACI1681G1Z0');

## Test

    npm test
	npm run test-coverage
