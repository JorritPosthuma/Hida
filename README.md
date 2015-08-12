# Hida

Hida is a javascript DICOM viewer. It is developed as part of a research internship at the Academic Medical Center in Amsterdam. Its initial goal was to provide a future proof rebuild of a Liver Uptake measurement algoritm, but has quickly grown as a general purpose web-based DICOM tool.

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

To give you an idea about the application, the following shows a multi-frame DICOM image with three ROI's:

![Hida Screenshot](/docs/img/screen.png)

![Hida Screencapture](/docs/img/capture.gif)

## TODO

 * Resultaten view maken

## Backlog

 * Window moving relative to magnitude (e.g. higher number = higher steps)
 * Export

## Installation

### Windows

 * Git (https://git-scm.com, choose option to make available on prompt)
 * NodeJS (https://nodejs.org, with NPM)
 * All dependencies of Node-Gyp (https://github.com/TooTallNate/node-gyp)

### OS X

 We assume homebrew is installed (http://brew.sh).