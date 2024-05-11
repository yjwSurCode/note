/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import axios from 'axios';

import promiseLimit from './promise-limit';
const App: React.FC = () => {
  //! 1
  // useEffect(() => {
  //   console.log(axios, 'axios');
  //   const limit = promiseLimit(2);

  //   const jobs = ['a', 'b', 'c', 'd', 'e'];

  //   Promise.all(
  //     jobs.map((name) => {
  //       return limit(() => job(name));
  //     })
  //   ).then((results) => {
  //     console.log();
  //     console.log('results:', results);
  //   });

  //   function job(name: any) {
  //     const text = `job ${name}`;
  //     console.log('started', text);

  //     return new Promise(function (resolve) {
  //       setTimeout(() => {
  //         console.log('       ', text, 'finished');
  //         resolve(text);
  //       }, 100);
  //     });
  //   }
  // }, []);

  // const delay = function delay(interval: any) {
  //   return new Promise((resolve, reject) => {
  //     // console.log(reject, 'reject');
  //     setTimeout(() => {
  //       resolve('666' + interval);
  //     }, interval);
  //   });
  // };

  //! 2
  const createLimitRequest = (tasks: any, pool: number = 2) => {
    pool = pool || 5;
    const results: any = [];
    let together = new Array(pool).fill(null);
    let index = 0;

    // 记录文件上传失败的次数

    const retryArr = [];
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
        const formData: any = new FormData();
        formData.append('type', 'upload' + interval);
        axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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

  const copiedArray = Array.from({ length: 100 }, () => [...tasks]).flat();

  createLimitRequest(copiedArray, 3)
    // createLimitPromise(1000, tasks)
    .then((results) => {
      console.log('success->', results);
    })
    .catch((reason) => {
      console.log('fail->', reason);
    });

  //! 3

  return <div></div>;
};
export default App;
