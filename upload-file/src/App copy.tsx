/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const fileObj = useRef<{ file: any; chunkList: any }>({
    file: null,
    chunkList: [],
  });
  // const [fileList, setFileList] = useState<File[]>([]);
  const worker = useRef<Worker>();

  // 计算分片hash值,为每个切片生成一个MD5值，切片的MD5用来实现续传的功能
  // 服务器告知客户端该文件是否已经存在，如果存在，是否完整。如果文件已经存在且不完整，则返回已上传的切片信息
  
  // 计算整个文件的hash值 实现秒传功能

  // 用完一定要销毁web worker
  const calculateHash1 = async (fileChunk: any) => {
    if (typeof Worker !== 'undefined') {
      return new Promise<string>((resolve) => {
        // 具体请看Vite中使用Worker线程(https://cn.vitejs.dev/guide/features.html#web-workers)
        worker.current = new Worker(new URL('./worker.ts', import.meta.url), {
          type: 'module',
        });
        worker.current.postMessage(fileChunk);
        worker.current.postMessage(fileChunk);
        worker.current.onmessage = (e: any) => {
          const { percentage, hash } = e.data;
          console.log(percentage, hash, '000');
          if (hash) {
            resolve(hash);
          }
        };
      });
    }
  };

  // 计算文件内容hash值
  const calculateHash2 = (file: File): Promise<string> => {
    worker.current = new Worker(new URL('./worker.js', import.meta.url));
    console.log(worker, 'worker');

    // 切割file对象
    worker.current.postMessage(file);
    worker.current.onmessage = (e: any) => {
      const { percentage, hash } = e.data;
      console.log(percentage, hash, '000');
      // if (hash) {
      //   resolve(hash);
      // }
    };

    return;

    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function (e) {
        const spark = new SparkMD5.ArrayBuffer();
        spark.append((e.target as FileReader).result as ArrayBuffer);
        resolve(spark.end());
      };
    });
  };
  // 文件分片
  const createFileChunk = (file: any, chunkSize = 1024 * 1024 * 5) => {
    const chunks = [];
    let currentSize = 0;
    let index = 0;
    while (currentSize < file?.size) {
      chunks.push({
        file: file.slice(currentSize, currentSize + chunkSize),
        index,
      });
      currentSize += chunkSize;
      index++;
    }
    return chunks;
  };

  // 切片数组 封装成 http 请求
  const createChunkPromiseList = (
    chunkList: any = [],
    name: string = '',
    TOKEN: string = 'token'
  ) => {
    return chunkList
      .map((chunk: any, index: any) => {
        console.log(chunk, 'chunk');
        const formData: any = new FormData();
        formData.append('type', 'upload');
        formData.append('name', name);
        formData.append('token', TOKEN);
        formData.append('chunk', chunk);
        formData.append('index', index);
        return formData;
      })
      .map((formData: any) => {
        console.log(formData.get('type'));
        return axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });
  };

  // 串行请求 上一个切片上传完成后，才可以执行下一个切片上传
  const serialRequest = async (params: any, total: any) => {
    let item = params.shift();
    while (item && !this.isCancelToken) {
      // uploadShard 为分片上传的接口
      let flag = await this.uploadShard(item, total);
      if (flag) {
        item = params.shift();
      } else {
        item = null;
      }
    }
  };

  // 控制并发
  const createLimitPromise = async (limitNum: number, promiseListRaw: any) => {
    const resArr: any = [];
    let handling = 0;
    let resolvedNum = 0;
    const promiseList: any = [...promiseListRaw];
    const runTime: any = promiseListRaw.length;

    console.log(runTime, 'runTime');

    return new Promise((resolve) => {
      //并发执行limitNum 次
      const times = Math.min(limitNum, promiseListRaw.length);
      for (let i = 1; i <= limitNum; i++) {
        run();
        console.log('run');
      }

      function run() {
        if (!promiseList.length) return;
        handling += 1;
        console.log('cur handling:' + handling);
        handle(promiseList.shift())
          .then((res) => {
            resArr.push(res);
          })
          .catch((e: any) => {
            //ignore
            console.log('catch error', e);
          })
          .finally(() => {
            handling -= 1;
            resolvedNum += 1;
            console.log(`resolvedNum : ${resolvedNum}`);
            if (resolvedNum === runTime) {
              resolve(resArr);
            }
            run();
          });
      }

      function handle(promise: any) {
        return new Promise((resolve, reject) => {
          promise.then((res: any) => resolve(res)).catch((e: any) => reject(e));
        });
      }
    });
  };

  const createLimitRequest = (tasks: any, pool: number = 2) => {
    pool = pool || 5;
    const results: any = [];
    let together = new Array(pool).fill(null);
    let index = 0;
    together = together.map((item: any, i: any) => {
      return new Promise((resolve, reject) => {
        console.log('AAA', item, i);
        const run = function run() {
          if (index >= tasks.length) {
            resolve('');
            return;
          }
          const old_index: any = index;
          // 从任务池拿任务，由于index是升级作用域的变量，所以多个Promise共享一个index
          // 这样可以让一个数组里面的任务一次执行
          const task = tasks[index++];
          console.log('BBB', index);
          task()
            .then((result: any) => {
              // 将返回的结果放置在results里面，实现请求数据的集中存储。
              results[old_index] = result;
              // 只有在上一个任务执行成功后才会执行一个异步任务
              run();
            })
            .catch((reason: any) => {
              reject(reason);
            });
        };
        run();
      });
    });
    console.log(together, 'together');
    // 多个promise同时处理，根据pool来限制同一时刻并发请求的个数
    return Promise.all(together).then(() => results);
  };

  const delay = function delay(interval: any) {
    return new Promise((resolve, reject) => {
      console.log(reject, 'reject');
      setTimeout(() => {
        resolve(interval);
      }, interval);
    });
  };

  const tasks = [
    () => {
      return delay(1000);
    },
    () => {
      return delay(1001);
    },
    () => {
      return delay(1002);
    },
    () => {
      return delay(1003);
    },
    () => {
      return delay(1004);
    },
    () => {
      return delay(1005);
    },
  ];

  createLimitRequest(tasks, 3)
    // createLimitPromise(1000, tasks)
    .then((results) => {
      console.log('success->', results);
    })
    .catch((reason) => {
      console.log('fail->', reason);
    });

  const handleFileChange = async (event: any) => {
    console.log('123');
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    fileObj.current.file = selectedFile;
    console.log(fileObj.current.file, '2222');

    //! 多文件上传就遍历处理

    //! step 1
    const fileChunkList = createFileChunk(
      fileObj.current.file,
      1024 * 1024 * 3
    );
    const calculateHash = await calculateHash1(fileChunkList);
    console.log(fileChunkList, '333', calculateHash);

    //! step 2
    const _fileChunkList = (fileChunkList || []).map(({ file }, index) => ({
      file,
      size: file.size, // 处理的每个小分片的大小
      percent: 0,
      chunkName: `${fileObj?.current?.file?.name || 'NAME'}+${index}`,
      fileName: fileObj?.current?.file?.name,
      index,
    }));

    console.log('------------------');
    console.log(_fileChunkList, '444');

    //! step 3
    const promiseList = createChunkPromiseList(_fileChunkList, 'NAME', 'TOKEN');
    console.log(promiseList, '555');

    //! step 4 并发控制 上传
    // await createLimitPromise(2, promiseList);
    await createLimitRequest(promiseList, 2);
    //  createLimitRequest(tasks, 3)
    // .then((results) => {
    //   console.log('success->', results);
    // })
    // .catch((reason) => {
    //   console.log('fail->', reason);
    // });

    // 上传切片

    console.log('-------------------------------------');
  };
  return (
    <>
      123
      <input type="file" onChange={handleFileChange} id="fileInput" />
    </>
  );
}

export default App;
