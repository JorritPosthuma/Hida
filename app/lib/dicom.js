//
// This is a cornerstone image loader for WADO requests.  It currently does not support compressed
// transfer syntaxes or big endian transfer syntaxes.  It will support implicit little endian transfer
// syntaxes but explicit little endian is strongly preferred to avoid any parsing issues related
// to SQ elements.  To request that the WADO object be returned as explicit little endian, append
// the following on your WADO url: &transferSyntax=1.2.840.10008.1.2.1
//

var cornerstoneWADOImageLoader = (function ($, cornerstone, cornerstoneWADOImageLoader) {

    "use strict";

    if(cornerstoneWADOImageLoader === undefined) {
        cornerstoneWADOImageLoader = {};
    }



    function isColorImage(photoMetricInterpretation)
    {
        if(photoMetricInterpretation === "RGB" ||
            photoMetricInterpretation === "PALETTE COLOR" ||
            photoMetricInterpretation === "YBR_FULL" ||
            photoMetricInterpretation === "YBR_FULL_422" ||
            photoMetricInterpretation === "YBR_PARTIAL_422" ||
            photoMetricInterpretation === "YBR_PARTIAL_420" ||
            photoMetricInterpretation === "YBR_RCT")
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function createImageObject(dataSet, imageId, frame)
    {
        if(frame === undefined) {
            frame = 0;
        }

        // make the image based on whether it is color or not
        var photometricInterpretation = dataSet.string('x00280004');
        var isColor = isColorImage(photometricInterpretation);
        if(isColor === false) {
            return cornerstoneWADOImageLoader.makeGrayscaleImage(imageId, dataSet, dataSet.byteArray, photometricInterpretation, frame);
        } else {
            return cornerstoneWADOImageLoader.makeColorImage(imageId, dataSet, dataSet.byteArray, photometricInterpretation, frame);
        }
    }

    var multiFrameCacheHack = {};

    function loadImage(imageId) {
        // create a deferred object
        // TODO: Consider not using jquery for deferred - maybe cujo's when library
        var deferred = $.Deferred();

        var fs = require('fs');
        var url = imageId.substring(10);

        fs.readFile(url, function (err, buffer) {
            var byteArray = new Uint8Array(buffer);
            var dataSet = dicomParser.parseDicom(byteArray);

            var imagePromise = createImageObject(dataSet, imageId, 0);
            imagePromise.then(function(image) {
                deferred.resolve(image);
            }, function() {
                deferred.reject();
            });
        });

        return deferred;
    }

    // steam the http and https prefixes so we can use wado URL's directly
    cornerstone.registerImageLoader('dicomfile', loadImage);

    return cornerstoneWADOImageLoader;
}($, cornerstone, cornerstoneWADOImageLoader));