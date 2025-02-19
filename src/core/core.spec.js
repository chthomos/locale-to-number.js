const { constructExtractionRegex, cleanNumberRepresentation } = require('./core');

beforeEach(() => {
  // Making sure the `console.error` implementation is empty
  // in order to avoid tests failing when a warning is logged.
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('Testing `constructExtractionRegex` function', () => {
  test(`It should construct the extraction regex for non-Indian notation by placing the
      thousand and the decimal separator in the correct places`, () => {
    expect(constructExtractionRegex('\\,', '\\.')).toEqual(
      new RegExp('^[+|-]?([1-9]{1}[0-9]{0,2}(\\,[0-9]{3})*|0)(\\.[0-9]+)?$')
    );

    expect(constructExtractionRegex('\\.', '\\,')).toEqual(
      new RegExp('^[+|-]?([1-9]{1}[0-9]{0,2}(\\.[0-9]{3})*|0)(\\,[0-9]+)?$')
    );

    expect(constructExtractionRegex('[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]', '\\.')).toEqual(
      new RegExp('^[+|-]?([1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s][0-9]{3})*|0)(\\.[0-9]+)?$')
    );

    expect(constructExtractionRegex('[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]', '\\,')).toEqual(
      new RegExp('^[+|-]?([1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s][0-9]{3})*|0)(\\,[0-9]+)?$')
    );

    expect(constructExtractionRegex("['΄’]", '\\.')).toEqual(
      new RegExp("^[+|-]?([1-9]{1}[0-9]{0,2}(['΄’][0-9]{3})*|0)(\\.[0-9]+)?$")
    );
  });

  test(`It should construct the extraction regex for Indian notation by placing the
      thousand and the decimal separator in the correct places`, () => {
    expect(constructExtractionRegex('\\,', '\\.', true)).toEqual(
      new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\,)+([0-9]{2}\\,)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$')
    );

    expect(constructExtractionRegex('\\.', '\\,', true)).toEqual(
      new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\.)+([0-9]{2}\\.)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$')
    );

    expect(constructExtractionRegex('[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]', '\\.', true)).toEqual(
      new RegExp(
        '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'
      )
    );

    expect(constructExtractionRegex('[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]', '\\,', true)).toEqual(
      new RegExp(
        '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'
      )
    );

    expect(constructExtractionRegex("['΄’]", '\\.', true)).toEqual(
      new RegExp("^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$")
    );
  });
});

describe('Testing `cleanNumber` function', () => {
  test(`It should clean the number representation (non-Indian) in order to match 
      the decimal literal format`, () => {
    // Preparing multiple test cases consisting of various locale configurations.
    const testCases = [
      {
        numberRepresentation: '20.000',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\.([0-9]{3}))*(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '20000',
      },
      {
        numberRepresentation: '20.000,5',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\.([0-9]{3}))*(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: '20.000,567',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\.([0-9]{3}))*(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200,5',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\.([0-9]{3}))*(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '200.5',
      },
      {
        numberRepresentation: '1.200,00',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\.([0-9]{3}))*(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\.([0-9]{3}))*(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '50',
      },
      {
        numberRepresentation: '20,000',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\,([0-9]{3}))*(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '20000',
      },
      {
        numberRepresentation: '20,000.5',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\,([0-9]{3}))*(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: '20,000.567',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\,([0-9]{3}))*(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200.5',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\,([0-9]{3}))*(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '200.5',
      },
      {
        numberRepresentation: '1,200.00',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\,([0-9]{3}))*(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\,([0-9]{3}))*(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '50',
      },
      {
        numberRepresentation: '20 000',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\.[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '20000',
      },
      {
        numberRepresentation: '20 000.5',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\.[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: '20 000.567',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\.[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200.5',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\.[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '200.5',
      },
      {
        numberRepresentation: '1 200.00',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\.[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\.[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '50',
      },
      {
        numberRepresentation: '20 000',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\,[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '20000',
      },
      {
        numberRepresentation: '20 000,5',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\,[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: '20 000,567',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\,[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200,5',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\,[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '200.5',
      },
      {
        numberRepresentation: '1 200,00',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\,[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\,[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '50',
      },
      {
        numberRepresentation: "20'000",
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\.[0-9]+)?$"),
        localeConfiguration: {
          thousands: "'",
          decimal: "['΄’]",
        },
        result: '20000',
      },
      {
        numberRepresentation: "20'000.5",
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\.[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: "20'000.567",
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\.[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200.5',
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\.[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '200.5',
      },
      {
        numberRepresentation: "1'200.00",
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\.[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\.[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '50',
      },
      {
        numberRepresentation: "20'000",
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\,[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '20000',
      },
      {
        numberRepresentation: "20'000,5",
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\,[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: "20'000,567",
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\,[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200,5',
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\,[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '200.5',
      },
      {
        numberRepresentation: "1'200,00",
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\,[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\,[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '50',
      },
    ];

    testCases.forEach((testCase) => {
      expect(
        cleanNumberRepresentation(testCase.numberRepresentation, testCase.regex, testCase.localeConfiguration)
      ).toEqual(testCase.result);
    });
  });

  test(`It should clean the number representation (Indian) in order to match 
      the decimal literal format`, () => {
    // Preparing multiple test cases consisting of various locale configurations.
    const testCases = [
      {
        numberRepresentation: '20.000',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\.)+([0-9]{2}\\.)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '20000',
      },
      {
        numberRepresentation: '20.000,5',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\.)+([0-9]{2}\\.)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: '20.000,567',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\.)+([0-9]{2}\\.)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200,5',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\.)+([0-9]{2}\\.)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '200.5',
      },
      {
        numberRepresentation: '1.200,00',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\.)+([0-9]{2}\\.)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\.)+([0-9]{2}\\.)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
        result: '50',
      },
      {
        numberRepresentation: '20,000',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\,)+([0-9]{2}\\,)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '20000',
      },
      {
        numberRepresentation: '20,000.5',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\,)+([0-9]{2}\\,)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: '20,000.567',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\,)+([0-9]{2}\\,)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200.5',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\,)+([0-9]{2}\\,)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '200.5',
      },
      {
        numberRepresentation: '1,200.00',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\,)+([0-9]{2}\\,)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp('^[+|-]?(([1-9]{1}[0-9]{0,1}\\,)+([0-9]{2}\\,)*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\,',
          decimal: '\\.',
        },
        result: '50',
      },
      {
        numberRepresentation: '20 000',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '20000',
      },
      {
        numberRepresentation: '20 000.5',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: '20 000.567',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200.5',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '200.5',
      },
      {
        numberRepresentation: '1 200.00',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
        result: '50',
      },
      {
        numberRepresentation: '20 000',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '20000',
      },
      {
        numberRepresentation: '20 000,5',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: '20 000,567',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200,5',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '200.5',
      },
      {
        numberRepresentation: '1 200,00',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp(
          '^[+|-]?(([1-9]{1}[0-9]{0,1}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])+([0-9]{2}[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$'
        ),

        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
        result: '50',
      },
      {
        numberRepresentation: "20'000",
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$`),

        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '20000',
      },
      {
        numberRepresentation: "20'000.5",
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: "20'000.567",
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200.5',
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '200.5',
      },
      {
        numberRepresentation: "1'200.00",
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\.[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
        result: '50',
      },
      {
        numberRepresentation: "20'000",
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '20000',
      },
      {
        numberRepresentation: "20'000,5",
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '20000.5',
      },
      {
        numberRepresentation: "20'000,567",
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '20000.567',
      },
      {
        numberRepresentation: '200,5',
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '200.5',
      },
      {
        numberRepresentation: "1'200,00",
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '1200.00',
      },
      {
        numberRepresentation: '50',
        regex: new RegExp(`^[+|-]?(([1-9]{1}[0-9]{0,1}['΄’])+([0-9]{2}['΄’])*[0-9]{3}|[1-9]{1}[0-9]{0,2}|0)(\\,[0-9]+)?$`),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
        result: '50',
      },
    ];

    testCases.forEach((testCase) => {
      expect(
        cleanNumberRepresentation(testCase.numberRepresentation, testCase.regex, testCase.localeConfiguration)
      ).toEqual(testCase.result);
    });
  });

  test(`It should return 'null' when number representations do not match
  the given regex`, () => {
    const testCases = [
      {
        numberRepresentation: '50,000.12',
        regex: new RegExp('^([+|-])?[1-9]{1}[0-9]{0,2}(\\.([0-9]{3}))*(\\,[0-9]+)?$'),
        localeConfiguration: {
          thousands: '\\.',
          decimal: '\\,',
        },
      },
      {
        numberRepresentation: '50,000.12',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\.[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\.',
        },
      },
      {
        numberRepresentation: '50.000,12',
        regex: new RegExp(
          '^([+|-])?[1-9]{1}[0-9]{0,2}([\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]([0-9]{3}))*(\\,[0-9]+)?$'
        ),
        localeConfiguration: {
          thousands: '[\\u202F\\u00A0\\u2000\\u2001\\u2003\\s]',
          decimal: '\\,',
        },
      },
      {
        numberRepresentation: '50.000,12',
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\,[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\,',
        },
      },
      {
        numberRepresentation: '50.000,12',
        regex: new RegExp("^([+|-])?[1-9]{1}[0-9]{0,2}(['΄’]([0-9]{3}))*(\\.[0-9]+)?$"),
        localeConfiguration: {
          thousands: "['΄’]",
          decimal: '\\.',
        },
      },
    ];

    testCases.forEach((testCase) => {
      expect(
        cleanNumberRepresentation(testCase.numberRepresentation, testCase.regex, testCase.localeConfiguration)
      ).toEqual(null);
    });
  });
});
