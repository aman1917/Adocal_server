'use strict';
function calcCheckSum(gstin) {
    var GSTN_CODEPOINT_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    factor = 2,
    sum = 0,
    checkCodePoint = 0,
    mod = GSTN_CODEPOINT_CHARS.length,
    i;

  for (i = gstin.length - 2; i >= 0; i--) {
    var codePoint = -1;
    for (var j = 0; j < GSTN_CODEPOINT_CHARS.length; j++) {
      if (GSTN_CODEPOINT_CHARS[j] == gstin[i]) {
        codePoint = j;
      }
    }
    var digit = factor * codePoint;
    factor = (factor == 2) ? 1 : 2;
    digit = Math.floor(digit / mod) + (digit % mod);
    sum += digit;
  }
  checkCodePoint = (mod - (sum % mod)) % mod;
  return GSTN_CODEPOINT_CHARS[checkCodePoint];
}

function validatePattern(gstin) {
  'use strict';
  var gstinRegexPattern = /^([0-2][0-9]|[3][0-8])[A-Z]{3}[ABCFGHLJPTK][A-Z]\d{4}[A-Z][A-Z0-9][Z][A-Z0-9]$/;
  return gstinRegexPattern.test(gstin); // Regex validation result GSTIN of 15 digits.
}

function isValidGSTNumber(gstin) {
  gstin = gstin.toUpperCase();
  if (gstin.length != 15) {
    return false;
  }
  if (validatePattern(gstin)) {
    return (gstin[14] == calcCheckSum(gstin.toUpperCase()));
  }
  return false;
}

 function getInfo(gstin) {
    var states = [{state_name: 'Andaman and Nicobar Islands', state_code: '35', state_shortcode: 'AN'},
      {state_name: 'Andhra Pradesh', state_code: '28', state_shortcode: 'AP'},
      {state_name: 'Andhra Pradesh (New)', state_code: '37', state_shortcode: 'AD'},
      {state_name: 'Arunachal Pradesh', state_code: '12', state_shortcode: 'AR'},
      {state_name: 'Assam', state_code: '18', state_shortcode: 'AS'},
      {state_name: 'Bihar', state_code: '10', state_shortcode: 'BH'},
      {state_name: 'Chandigarh', state_code: '04', state_shortcode: 'CH'},
      {state_name: 'Chattisgarh', state_code: '22', state_shortcode: 'CT'},
      {state_name: 'Dadra and Nagar Haveli', state_code: '26', state_shortcode: 'DN'},
      {state_name: 'Daman and Diu', state_code: '25', state_shortcode: 'DD'},
      {state_name: 'Delhi', state_code: '07', state_shortcode: 'DL'},
      {state_name: 'Goa', state_code: '30', state_shortcode: 'GA'},
      {state_name: 'Gujarat', state_code: '24', state_shortcode: 'GJ'},
      {state_name: 'Haryana', state_code: '06', state_shortcode: 'HR'},
      {state_name: 'Himachal Pradesh', state_code: '02', state_shortcode: 'HP'},
      {state_name: 'Jammu and Kashmir', state_code: '01', state_shortcode: 'JK'},
      {state_name: 'Jharkhand', state_code: '20', state_shortcode: 'JH'},
      {state_name: 'Karnataka', state_code: '29', state_shortcode: 'KA'},
      {state_name: 'Kerala', state_code: '32', state_shortcode: 'KL'},
      {state_name: 'Ladakh', state_code: '38', state_shortcode: 'LA'},
      {state_name: 'Lakshadweep Islands', state_code: '31', state_shortcode: 'LD'},
      {state_name: 'Madhya Pradesh', state_code: '23', state_shortcode: 'MP'},
      {state_name: 'Maharashtra', state_code: '27', state_shortcode: 'MH'},
      {state_name: 'Manipur', state_code: '14', state_shortcode: 'MN'},
      {state_name: 'Meghalaya', state_code: '17', state_shortcode: 'ME'},
      {state_name: 'Mizoram', state_code: '15', state_shortcode: 'MI'},
      {state_name: 'Nagaland', state_code: '13', state_shortcode: 'NL'},
      {state_name: 'Odisha', state_code: '21', state_shortcode: 'OR'},
      {state_name: 'Pondicherry', state_code: '34', state_shortcode: 'PY'},
      {state_name: 'Punjab', state_code: '03', state_shortcode: 'PB'},
      {state_name: 'Rajasthan', state_code: '08', state_shortcode: 'RJ'},
      {state_name: 'Sikkim', state_code: '11', state_shortcode: 'SK'},
      {state_name: 'Tamil Nadu', state_code: '33', state_shortcode: 'TN'},
      {state_name: 'Telangana', state_code: '36', state_shortcode: 'TS'},
      {state_name: 'Tripura', state_code: '16', state_shortcode: 'TR'},
      {state_name: 'Uttar Pradesh', state_code: '09', state_shortcode: 'UP'},
      {state_name: 'Uttarakhand', state_code: '05', state_shortcode: 'UT'},
      {state_name: 'West Bengal', state_code: '19', state_shortcode: 'WB'}];
    var panTypes = [{code: 'C', pan_type: 'Company'},
      {code: 'P', pan_type: 'Person'},
      {code: 'H', pan_type: 'HUF (Hindu Undivided Family)'},
      {code: 'F', pan_type: 'Firm'},
      {code: 'A', pan_type: 'Association of Persons (AOP)'},
      {code: 'T', pan_type: 'AOP (Trust)'},
      {code: 'B', pan_type: 'Body of Individuals (BOI)'},
      {code: 'L', pan_type: 'Local Authority'},
      {code: 'J', pan_type: 'Artificial Juridical Person '},
      {code: 'G', pan_type: 'Government'}];

    var gstin = gstin.toUpperCase();

    if (!isValidGSTNumber(gstin))
      return 'Invalid GSTIN';

    var state = states.find(function (o) { return o.state_code === gstin.slice(0, 2); } );
    var info_msg = "The GSTIN " + gstin + " is entity #" + parseInt(gstin.slice(12,13),36) + " belonging to " + panTypes.find(function (o) { return o.code === gstin[5] }).pan_type + " whose PAN is " + gstin.slice(2,12) + " registered in " + state.state_name + " (" + state.state_shortcode + ")";
    return info_msg;
  }

module.exports = {
  isValidGSTNumber: isValidGSTNumber,

  ValidateGSTIN: function(gstin) {
	gstin = gstin.toUpperCase();
    if (gstin.length != 15) {
      return 'Enter a valid 15 character GSTIN';
    }
    if (!validatePattern(gstin)) {
      return 'Invalid GSTIN format';
    } else {
      if (gstin.toUpperCase()[14] != calcCheckSum(gstin.toUpperCase())) {
        return 'Invalid checksum character in GSTIN';
      } else
        return 'Valid GSTIN';
    }
  },

  getGSTINInfo: getInfo
};
