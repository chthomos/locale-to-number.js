# locale-to-number.js

## Introduction
At the time of writing there is no concrete solution to the problem of transforming a string representation of a number in a certain locale, to the actual decimal literal Javascript can understand. There are utilities that perform the exact opposite, like [Intl.NumberFormat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) constructor or the [Number.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toLocaleString). Both of those, take into consideration, via an argument, the desired locale output in its BCP 47 language tag and work generically for every locale. However, currently there is no such counterpart. One can find some basic solutions that, almost, any one of them deals with representations that use `comma` and `dot` as the `thousands` and `decimal` delimiters.

The purpose of this library is to create such a solution so one can get the actual decimal literal while providing its string representation and the corresponding locale. The library must work for every locale available. The process will be incremental, meaning that extra locales will be supported in each release version. On version `1.0.0` every available locale must be supported.

## Development Process
The release scheduling will not be strict and will be adjusted according to the actual effort. The versioning will follow the `major.minor.bug-fix` convention. Until the first major release we will increment `minor` versions when at least one new locale is supported and `bug-fix` versions for bug fixes and code refactoring processes in general.

Regarding the branches, the `main` branch will contain the latest released version publicly available via `npm`. The `integration` branch will contain the code that is actively being developed and tested. Each new locale, code refactoring or bug fix, will be handled in a separate branch. When the actual implementation is over and the needed unit tests are written, the developer can create a PR on the `integration` branch. Until the first major release the package will not be publicly available. Thus, the integration branch will not be used.