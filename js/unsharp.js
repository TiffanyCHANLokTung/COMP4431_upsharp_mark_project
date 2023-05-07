(function(imageproc) {
    "use strict";

    imageproc.unsharp = function(inputData, outputData, amount, radius, threshold, outputImageType) {

        console.log("Applying Unsharp Mask...");
        var kernel = []; // Gaussian kernel
        // sigma
        var sigma = (radius + 1) / Math.sqrt(2 * Math.log(255));
        // kernel size
        var EdgeToCenter = Math.ceil(radius * sigma);
        var kernelSize = 2 * EdgeToCenter + 1;
        console.log("Radius: ", radius, ", Sigma: ", sigma, ", Size: ", kernelSize, ", EdgeToCenter: ", EdgeToCenter);

        // Apply gaussian kernel
        var sum = 0;
        for (var j = -EdgeToCenter; j <= EdgeToCenter; j++) {
            kernel.push([]);
            for (var i = -EdgeToCenter; i <= EdgeToCenter; i++) {
                var value = 1 / (2 * Math.PI * sigma * sigma) * Math.exp(-(i * i + j * j) / (2 * sigma * sigma));
                kernel[j + EdgeToCenter].push(value);
                sum += value;
            }
        }

        // make sure the sum of values in the kernel = 1
        for (var j = 0; j < kernelSize; j++) {
            for (var i = 0; i < kernelSize; i++) {
                kernel[j][i] /= sum;
                //console.log(kernel[j][i]);
            }
        }

        console.log("Finish constructing kernel, start process data")

        // Determine the output image
        if (outputImageType == 'unsharp') { // Output image = unsharp mask
            // get the blurred image, by applying gaussian kernel
            var blurredData = imageproc.createBuffer(outputData);
            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    // Use imageproc.getPixel() to get the pixel values
                    var redSum = 0, greenSum = 0, blueSum = 0;
                    for (var j = -EdgeToCenter; j <= EdgeToCenter; j++) {
                        for (var i = -EdgeToCenter; i <= EdgeToCenter; i++) {
                            var pixel = imageproc.getPixel(inputData, x+i, y+j);
                            redSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.r;
                            greenSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.g;
                            blueSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.b;
                        }
                    }
                    // Then set the blurred result to the output data
                    var i = (x + y * blurredData.width) * 4;
                    blurredData.data[i]     = redSum;
                    blurredData.data[i + 1] = greenSum;
                    blurredData.data[i + 2] = blueSum;
                }
            }
            console.log("Finish unsharp mask - blurring");
            //subtraction and transform to black white image by threshold
            var subtractedData = imageproc.createBuffer(outputData);
            for (var i = 0; i < blurredData.data.length; i += 4) {
                // Change the RGB components to the resulting value
                subtractedData.data[i]     = (inputData.data[i] - blurredData.data[i]) > threshold? inputData.data[i] - blurredData.data[i] : 0;
                subtractedData.data[i + 1] = (inputData.data[i + 1] - blurredData.data[i + 1]) > threshold? inputData.data[i + 1] - blurredData.data[i + 1] : 0;
                subtractedData.data[i + 2] = (inputData.data[i + 2] - blurredData.data[i + 2]) > threshold? inputData.data[i + 2] - blurredData.data[i + 2] : 0;
                // Addition with orginal image after multiply with amount
                outputData.data[i]     = inputData.data[i] + subtractedData.data[i] * amount;
                outputData.data[i + 1] = inputData.data[i + 1] + subtractedData.data[i + 1] * amount;
                outputData.data[i + 2] = inputData.data[i + 2] + subtractedData.data[i + 2] * amount;
            }
            console.log("Display unsahrp mask image");
        } else if (outputImageType == 'blurred') {  // Output image = Gaussian Blur Image
            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    // Use imageproc.getPixel() to get the pixel values
                    var redSum = 0, greenSum = 0, blueSum = 0;
                    for (var j = -EdgeToCenter; j <= EdgeToCenter; j++) {
                        for (var i = -EdgeToCenter; i <= EdgeToCenter; i++) {
                            var pixel = imageproc.getPixel(inputData, x+i, y+j);
                            redSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.r;
                            greenSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.g;
                            blueSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.b;
                        }
                    }
                    // Then set the blurred result to the output data
                    var i = (x + y * outputData.width) * 4;
                    outputData.data[i]     = redSum;
                    outputData.data[i + 1] = greenSum;
                    outputData.data[i + 2] = blueSum;
                }
            }
            console.log("Display Gaussian blur image");
        } else { // Output image = Subtracted Image
            // get the blurred image, by applying gaussian kernel
            var blurredData = imageproc.createBuffer(outputData);
            for (var y = 0; y < inputData.height; y++) {
                for (var x = 0; x < inputData.width; x++) {
                    // Use imageproc.getPixel() to get the pixel values
                    var redSum = 0, greenSum = 0, blueSum = 0;
                    for (var j = -EdgeToCenter; j <= EdgeToCenter; j++) {
                        for (var i = -EdgeToCenter; i <= EdgeToCenter; i++) {
                            var pixel = imageproc.getPixel(inputData, x+i, y+j);
                            redSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.r;
                            greenSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.g;
                            blueSum += kernel[EdgeToCenter + j][EdgeToCenter + i] * pixel.b;
                        }
                    }
                    // Then set the blurred result to the output data
                    var i = (x + y * blurredData.width) * 4;
                    blurredData.data[i]     = redSum;
                    blurredData.data[i + 1] = greenSum;
                    blurredData.data[i + 2] = blueSum;
                }
            }
            console.log("Finish subtracted image - blurring")
            // subtraction and transform to black white image by threshold
            for (var i = 0; i < blurredData.data.length; i += 4) {
            // Change the RGB components to the resulting value
                outputData.data[i]     = (inputData.data[i] - blurredData.data[i]) > threshold? inputData.data[i] - blurredData.data[i] : 0;
                outputData.data[i + 1] = (inputData.data[i + 1] - blurredData.data[i + 1]) > threshold? inputData.data[i + 1] - blurredData.data[i + 1] : 0;
                outputData.data[i + 2] = (inputData.data[i + 2] - blurredData.data[i + 2]) > threshold? inputData.data[i + 2] - blurredData.data[i + 2] : 0;
            }
            console.log("Display subtracted image");
        }
        console.log("Finish Unsharp Mask")
    }
}(window.imageproc = window.imageproc || {}));
