(function(imageproc) {
    "use strict";

    /*
     * Apply negation to the input data
     */
    imageproc.negation = function(inputData, outputData) {
        console.log("Applying negation...");

        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]     = 255 - inputData.data[i];
            outputData.data[i + 1] = 255 - inputData.data[i + 1];
            outputData.data[i + 2] = 255 - inputData.data[i + 2];
        }
    }

    /*
     * Convert the input data to grayscale
     */
    imageproc.grayscale = function(inputData, outputData) {
        console.log("Applying grayscale...");

        /**
         * TODO: You need to create the grayscale operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
            var simpleAverage = (inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3;
           
            // Change the RGB components to the resulting value

            outputData.data[i]     = simpleAverage;
            outputData.data[i + 1] = simpleAverage;
            outputData.data[i + 2] = simpleAverage;
        }
    }

    /*
     * Applying brightness to the input data
     */
    imageproc.brightness = function(inputData, outputData, offset) {
        console.log("Applying brightness...");

        /**
         * TODO: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by adding an offset
            // and Handle clipping of the RGB components
            outputData.data[i]     = Math.min(Math.max(inputData.data[i] + offset,0),255);
            outputData.data[i + 1] = Math.min(Math.max(inputData.data[i + 1] + offset,0),255);
            outputData.data[i + 2] = Math.min(Math.max(inputData.data[i + 2] + offset,0),255);
        }
    }

    /*
     * Applying contrast to the input data
     */
    imageproc.contrast = function(inputData, outputData, factor) {
        console.log("Applying contrast...");

        /**
         * TODO: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by multiplying a factor
            // and Handle clipping of the RGB components
            outputData.data[i]     = Math.min(inputData.data[i] * factor,255);
            outputData.data[i + 1] = Math.min(inputData.data[i + 1] * factor,255);
            outputData.data[i + 2] = Math.min(inputData.data[i + 2] * factor,255);
        }
    }

    /*
     * Make a bit mask based on the number of MSB required
     */
    function makeBitMask(bits) {
        var mask = 0;
        for (var i = 0; i < bits; i++) {
            mask >>= 1;
            mask |= 128;
        }
        return mask;
    }

    /*
     * Apply posterization to the input data
     */
    imageproc.posterization = function(inputData, outputData,
                                       redBits, greenBits, blueBits) {
        console.log("Applying posterization...");

        /**
         * TODO: You need to create the posterization operation here
         */

        // Create the red, green and blue masks
        // A function makeBitMask() is already given
        var redMask = makeBitMask(redBits);
        var greenMask = makeBitMask(greenBits);
        var blueMask = makeBitMask(blueBits);

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Apply the bitmasks onto the RGB channels

            outputData.data[i]     = inputData.data[i] & redMask;
            outputData.data[i + 1] = inputData.data[i + 1] & greenMask;
            outputData.data[i + 2] = inputData.data[i + 2] & blueMask;
        }
    }

    /*
     * Apply threshold to the input data
     */
    imageproc.threshold = function(inputData, outputData, thresholdValue) {
        console.log("Applying thresholding...");

        /**
         * TODO: You need to create the thresholding operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
            // You will apply thresholding on the grayscale value
            var simpleAverage = (inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3;
           
            // Change the colour to black or white based on the given threshold
            if (simpleAverage < thresholdValue)
            {
                outputData.data[i] = outputData.data[i + 1] = outputData.data[i + 2] = 0;
            }
            else
            {
                outputData.data[i] = outputData.data[i + 1] = outputData.data[i + 2] = 255;
            }
        }
    }

    /*
     * Build the histogram of the image for a channel
     */
    function buildHistogram(inputData, channel) {
        var histogram = [];
        for (var i = 0; i < 256; i++)
            histogram[i] = 0;

        /**
         * TODO: You need to build the histogram here
         */

        // Accumulate the histogram based on the input channel
        // The input channel can be:
        // "red"   - building a histogram for the red component
        // "green" - building a histogram for the green component
        // "blue"  - building a histogram for the blue component
        // "gray"  - building a histogram for the intensity
        //           (using simple averaging)
        var value;
        for (var i = 0; i < inputData.data.length; i+=4)
        {
            switch (channel)
            {
                case "red":
                    value = inputData.data[i];
                    break;
                case "green":
                    value = inputData.data[i + 1];
                    break;
                case "blue":
                    value = inputData.data[i + 2];
                    break;
                case "gray":
                    value = Math.round((inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3);
                    break;
            }
            histogram[value]++;
        }

        return histogram;
    }

    /*
     * Find the min and max of the histogram
     */
    function findMinMax(histogram, pixelsToIgnore) {
        var min = 0, max = 255;

        /**
         * TODO: You need to build the histogram here
         */
        var remainingPixel = pixelsToIgnore;
        // Find the minimum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        for (min = 0; min <= 255; min++)
        {
            if (histogram[min] > 0)
            {
                remainingPixel -= histogram[min];
                if (remainingPixel <= 0) break;
            }
        }
       
        remainingPixel = pixelsToIgnore;
        // Find the maximum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        for (max = 255; max >= 0; max--)
        {
            if (histogram[max] > 0)
            {
                remainingPixel -= histogram[max];
                if (remainingPixel <= 0) break;
            }
        }
        
        return {"min": min, "max": max};
    }

    /*
     * Apply automatic contrast to the input data
     */
    imageproc.autoContrast = function(inputData, outputData, type, percentage) {
        console.log("Applying automatic contrast...");

        // Find the number of pixels to ignore from the percentage
        var pixelsToIgnore = (inputData.data.length / 4) * percentage;

        var histogram, minMax;
        if (type == "gray") {
            // Build the grayscale histogram
            histogram = buildHistogram(inputData, "gray");

            // Find the minimum and maximum grayscale values with non-zero pixels
            minMax = findMinMax(histogram, pixelsToIgnore);
            console.log(minMax.min + "    " + minMax.max);

            var min = minMax.min, max = minMax.max, range = max - min;

            /**
             * TODO: You need to apply the correct adjustment to each pixel
             */
            var factor = 255 / range;
            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each pixel based on the minimum and maximum values

                outputData.data[i]     = Math.min(Math.max((inputData.data[i] - min) * factor, 0),255);
                outputData.data[i + 1] = Math.min(Math.max((inputData.data[i + 1] - min) * factor, 0), 255);
                outputData.data[i + 2] = Math.min(Math.max((inputData.data[i + 2] - min) * factor, 0), 255);
            }
        }
        else {

            /**
             * TODO: You need to apply the same procedure for each RGB channel
             *       based on what you have done for the grayscale version
             */
            var redHistogram, greenHistogram, blueHistogram;
            var redMinMax, greenMinMax, blueMinMax;

            //build three histograms
            redHistogram = buildHistogram(inputData, "red");
            greenHistogram = buildHistogram(inputData, "green");
            blueHistogram = buildHistogram(inputData, "blue");

            redMinMax = findMinMax(redHistogram, pixelsToIgnore);
            greenMinMax = findMinMax(greenHistogram, pixelsToIgnore);
            blueMinMax = findMinMax(blueHistogram, pixelsToIgnore);

            var redFactor, greenFactor, blueFactor;
            redFactor = 255 / (redMinMax.max - redMinMax.min);
            greenFactor = 255 / (greenMinMax.max - greenMinMax.min);
            blueFactor = 255 / (blueMinMax.max - blueMinMax.min);

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each channel based on the histogram of each one

                outputData.data[i]     = Math.min(Math.max((inputData.data[i] - redMinMax.min) * redFactor, 0), 255);
                outputData.data[i + 1] = Math.min(Math.max((inputData.data[i + 1] - greenMinMax.min) * greenFactor, 0), 255);
                outputData.data[i + 2] = Math.min(Math.max((inputData.data[i + 2] - blueMinMax.min) * blueFactor, 0), 255);
            }
        }
    }

}(window.imageproc = window.imageproc || {}));
