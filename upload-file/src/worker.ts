import SparkMD5 from 'spark-md5';

onmessage = (e) => {
  // console.log(type, 'type');
  const [...fileChunk] = e.data;

  const spark = new SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;

  const loadNext = (index: number) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(fileChunk[index].file);
    fileReader.onload = (e) => {
      count++;
      spark.append(e.target?.result as ArrayBuffer);
      if (count === fileChunk.length) {
        postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        close();
      } else {
        percentage += 100 / fileChunk.length;
        postMessage({
          percentage,
        });
        loadNext(count);
      }
    };
  };
  loadNext(0);
};
