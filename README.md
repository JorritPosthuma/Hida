# Hida

Hida is a javascript DICOM viewer and analysis tool. It is developed as part of a research internship at the Academic Medical Center in Amsterdam. Its initial goal was to provide a future proof rebuild of a Liver Uptake measurement algoritm, but has quickly grown as a general purpose web-based DICOM tool.

The requirements were as follows:
  - Provide basic DICOM viewing tools
    - Windowing (level and width)
    - Adding and editing of ROI's
  - Implement HIDA algoritm based on [Liver uptake function measured by IODIDA clearance rate in liver transplant patients and healthy volunteers.](http://www.ncbi.nlm.nih.gov/pubmed/8692492)
  - Enable distributable as multiplatform application using [Node-Webkit](rogerwang/node-webkit)
    - Supported platforms: Windows / OS X / Linux
    - Node-Webkit version has access to file-system
  - Enable online HTML5 application

By running the complete application in your browser or in a Node-Webkit container, there is no nead to upload files in any sort of way. This means that all code is executed only on your computer, and privacy issues are not an issue!

![Hida Screencapture](/docs/img/capture.gif)

## Used technologies

### Application

  * Languages:
    * CoffeeScript (http://coffeescript.org/)
      * Running on NodeJS and compiled to javascript to run in the browser
    * SASS (http://sass-lang.com/)
  * Frameworks / libraries / technologies:
    * AngularJS (https://angularjs.org)
    * Paper.js (http://paperjs.org)
    * HTML5 Web Workers (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
    * For more detail, see `package.json` and `bower.json`

### Tooling

  * NW.js (http://nwjs.io/, formerly Node-Webkit)
  * Webpack (https://webpack.github.io/)

## Requirements

### Windows

* Git (https://git-scm.com, choose option to make available on prompt)
* NodeJS (https://nodejs.org, with NPM)
* All dependencies of Node-Gyp (https://github.com/TooTallNate/node-gyp)
  * Python 2.7
  * Visual Studio

You might want to use https://chocolatey.org/

### OS X

We assume homebrew is installed (http://brew.sh).

  * NodeJS: `brew install node`

## Installation

Just do an `npm install`. This will install all dependancies.

## Usage

  * `npm start` Starts the webpack development server and NW.js development application
  * `npm run app` Runs clean production application (without compiling it into a distributable versions)
  * `npm run build ` Cleans everything and build production distributable versions of the app

These commands are combinations of the following single tasks:

  * `npm run wp-clean` **Webpack** cleans application bundle
  * `npm run wp-compile` **Webpack** compiles source into application bundle
  * `npm run wp-server` **Webpack** runs development server
  * `npm run nw-build` **NW.js** builds webpack bundle into application
  * `npm run nw-clean` **NW.js** cleans build folder
  * `npm run nw-dev` **NW.js** runs development application *(use with development server)*
  * `npm run nw-open` **NW.js** opens build folder
  * `npm run nw-run` **NW.js** directly runs application bundle

## Backlog

  * Professionalize
    * Automated testing
  * Remove ROI's
  * Window moving relative to magnitude (e.g. higher number = higher steps)
  * Export Images
  * Reenable simplification of ROI's
    * Needs additional point
