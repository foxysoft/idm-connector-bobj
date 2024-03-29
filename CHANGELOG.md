# Change Log
All notable changes to idm-connector-bobj will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
- Nothing at this time

## [1.2.0] - 2022-05-05
- Public release of all changes in 1.2.0-RC1

## [1.2.0-RC1] - 2022-04-29
### Added
- Add support for Sybase ASE

### Fixed
- Fix 1000 row limit for ALIAS table
- Fix BCM initialization error related to SAP note 2451365
- Fix "property not found" exception related to SAP note 2356828

## [1.1.0] - 2017-02-07
### Fixed
- Fix error handling of task "Delete BOBJ User"

## [1.1.0-RC1] - 2017-01-31
### Added
- Add support for SAP IDM 8.0

## [1.0.2] - 2016-09-09
### Fixed
- Fix SQLSTATE=42704 in DB2 initial load
- Rename artifact and project to idm-connector-bobj

## [1.0.1] - 2016-07-21
### Fixed
- Exclude Everyone group from initial load
- Fix INSTALL instructions for dispatcher classpath

## 1.0.0 - 2016-07-18
### Added
- First public release

[Unreleased]: ../../compare/1.2.0...HEAD
[1.2.0]:      ../../compare/1.2.0-RC1...1.2.0
[1.2.0-RC1]:  ../../compare/1.1.0...1.2.0-RC1
[1.1.0]:      ../../compare/1.1.0-RC1...1.1.0
[1.1.0-RC1]:  ../../compare/1.0.2...1.1.0-RC1
[1.0.2]:      ../../compare/1.0.1...1.0.2
[1.0.1]:      ../../compare/1.0.0...1.0.1

