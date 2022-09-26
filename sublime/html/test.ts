export type Dictionary<T = any> = { [key: string]: T };
const a: Dictionary = { key: 1 };

export interface FetchPrefixOptions {
  prefix?: string;
}
export interface FetchSuffixOptions {
  suffix?: string;
}
// 为ts官方自带请求参数类型RequestInit
// Omit 为剔除后面参数 headers
export interface FetchInitOptions extends Omit<RequestInit, "headers"> {
  headers?: Dictionary;
  demo: string;
}

//未传必传项
const aa: FetchInitOptions = { body: null, headers: { aaaa: 1111 } };

//Partial<T> 将后面的类型全部定义为可选
export type FetchOptions = Partial<FetchInitOptions> &
  FetchPrefixOptions &
  FetchSuffixOptions;

const aaa: FetchOptions = { body: null, headers: { aaaa: 1111 } };

export interface FetchRequest extends FetchInitOptions {
  url: string;
}
export interface FetchResult<T = any> {
  request: FetchRequest;
  response: Response;
  data: T;
}

//FetchDataHandlerOptions<FetchOptions, R>;
//FetchOptions 为T , R就是为N R也就是PerformanceResponseData
export interface FetchDataHandlerOptions<T, N> {
  //dataHandler为一个函数
  //返回值是一个promise
  //例子在67行
  dataHandler?: (
    res: FetchResult<T>,
    executor: (res: FetchResult<T>, type: string) => Promise<any>
  ) => Promise<N>;
}

export interface PerformanceResponseData<T = any> {
  code: string;
  msg?: string;
  body: T;
}

//R为类型参数 也是返回值的类型
export type FetchWithResultOptions<R> = FetchOptions &
  //FetchDataHandlerOptions 37行定义
  // 根据类型可得出FetchDataHandlerOptions<FetchOptions, PerformanceResponseData>
  FetchDataHandlerOptions<FetchOptions, R>;

// const aaaaa: FetchDataHandlerOptions<FetchOptions, PerformanceResponseData> = {
//   dataHandler: async (res, executor) => {
//     const _data = await executor(res, "json");
//   },
// };

//泛型类型“FetchWithResultOptions”需要 1 个类型参数。
const aaaa: FetchWithResultOptions<{ code: string }> = {
  headers: { aaaa: 1111 },
  dataHandler: async (res, executor) => {
    const _data = await executor(res, "json");
    const data = {
      code: typeof _data.code !== "string" ? `${_data.code}` : _data.code,
      //   body: _data,
    };

    return data;
  },
};

const obj: { options?: FetchWithResultOptions<PerformanceResponseData> } = {
  options: {
    // body: null,
    headers: { aaa: 111 },
    dataHandler: async (res, executor): Promise<any> => {
      const _data = await executor(res, "json");
      const data: any = {
        code: typeof _data.code !== "string" ? `${_data.code}` : _data.code,
        body: _data,
        msg: _data.msg,
      };

      return data;
    },
  },
};
