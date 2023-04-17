(function(imageproc) {
    "use strict";

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
        console.log("Applying blur...");

        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [];

        for (var j = 0; j < kernelSize; j++) {
            kernel.push([]);
            for (var i = 0; i < kernelSize; i++) {
                kernel[j].push(1);
            }
        }

        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */
        var EdgeToCenter = (kernelSize - 1) / 2;
        var divisor = kernelSize * kernelSize;

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel
                var redSum = 0, greenSum = 0, blueSum = 0;
                for (var j = -1 * EdgeToCenter; j <= EdgeToCenter; j++) {
                    for (var i = -1 * EdgeToCenter; i <= EdgeToCenter; i++) {
                        var pixel = imageproc.getPixel(inputData, x+i, y+j);
                        redSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.r;
                        greenSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.g;
                        blueSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.b;
                    }
                }
                
                // Then set the blurred result to the output data
                
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = redSum / divisor;
                outputData.data[i + 1] = greenSum / divisor;
                outputData.data[i + 2] = blueSum / divisor;
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
