/* 生成MD5
 * @files {object} 文件对象
 */
import SparkMD5 from './spark-md5.min';

const createMD5 = (files) => {
    return new Promise(resolve => {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            file = files,
            chunkSize = 2097152, // read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            frOnload = function (e) {
                spark.append(e.target.result); // append array buffer
                currentChunk++;
                if (currentChunk < chunks)
                    loadNext();
                else
                    // callback.call(spark, spark.end());
                    resolve(spark.end())
            },
            frOnerror = function () {
                throw new Error("\noops, 报错.");
            };

        function loadNext() {
            var fileReader = new FileReader();
            fileReader.onload = frOnload;
            fileReader.onerror = frOnerror;
            var start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        };

        loadNext();
    })
}

export default createMD5
