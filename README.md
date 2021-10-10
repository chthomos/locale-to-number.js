# locale-to-number.js

## Introduction
At the time of writing there is no concrete solution to the problem of transforming a string representation of a number in a certain locale, to the actual decimal literal Javascript can understand. There are utilities that perform the exact opposite, like [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) constructor or the [Number.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString). Both of those, take into consideration, via an argument, the desired locale output in its BCP 47 language tag and work generically for every locale. However, currently there is no such counterpart. One can find some basic solutions that, almost, any one of them deals with representations that use `comma` and `dot` as the `thousands` and `decimal` delimiters.

The purpose of this library is to create such a solution so one can get the actual decimal literal while providing its string representation and the corresponding locale. The library must work for every locale available. The process will be incremental, meaning that extra locales will be supported in each release version. On version `1.0.0` every available locale must be supported.

## Development Process
The release scheduling will not be strict and will be adjusted according to the actual effort. The versioning will follow the `major.minor.bug-fix` convention. Until the first major release we will increment `minor` versions when at least one new locale is supported and `bug-fix` versions for bug fixes and code refactoring processes in general.

### Branching
Regarding branching, the `main` branch will contain the latest released version publicly available via `npm`. The `integration` branch will contain the code that is actively being developed and tested. Each new locale, code refactoring or bug fix, will be handled in a separate branch. When the actual implementation is over and the needed unit tests are written, the developer can create a PR on the `integration` branch. Until the first major release the package will not be publicly available. Thus, the integration branch will not be used.

All branch names must be in lowercase where each word is separated by a hyphen, for example `add-locale-en`. Also, when naming use the imperative, present tense:  "add" not "added" nor "adds". For now, all branches must come from `main`.

Commit summary must start with a capital letter, while their ending must be marked by a period. Summaries must use past tense: "added" not "add" nor "adds". Commit description are not required. However, they must follow summaries' rules.

When a branch satisfies the [Definition of Done](#dod), the developer can submit a PR. In PR's summary the imperative, present tense must be used, while in its description one must use past tense. After submitting the PR, a maintainer will review the branch and proceed accordingly. **Do not delete** the branch unless a maintainer says so.

### Code Conventions
The source files are located in the `src` folder. Each utility is organized in a separate module. Each module is in its own folder and consists of 2 files: the actual module and the spec file. When naming a module one must use lowecase letters where words are separated by a hyphen. The specs file must have the same name followed by the `.spec` extension. So, a module should look like this:
```
locale-to-number.js    
│
└───src
│   │
│   └───locale-en
│       │   locale-en.js
│       │   local-en.spec.js      
```
The actual module name must follow the `camelCase` convention. In the aforementioned example, the module must be named `localeEn`. For more details, check the `create-template-string.js` file.

Every module file must export only the basic function. All helper functions must stay *hidden* from the outside world. Every function in a module must be properly commented using the [JSDoc](https://jsdoc.app/) convention.

In the spec file, there must be an extensive and well-covered suite of test cases. The actual testing is done by the [Jest](https://github.com/facebook/jest) library. To run the unit-test, execute the following:
```bash
npm run test

### <a id="dod"></a> Definition of Done
One task is completed when:
1) All the requirements of the task that are defined are met when running the unit-tests.
2) The unit-test coverage is at least at 95% (if the 100% mark can be reached, then it must be reached).
3) The code is well-commented and uses the JSDoc convention properly.

### Reasons of Rejection
A PR can be rejected if at least one of the following occurs:
1) The branch does not follow the proper naming conventions.
2) The commits messages do not follow the proper naming conventions.
3) The PR does not follow the proper naming conventions.
4) The requirements of the task are not met entirely.
5) The unit-test coverage is insufficient.
6) The code is not well-commented.
7) The JSDoc convention is invalid or insufficient.