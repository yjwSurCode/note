/*标准时间转日期格式：dateFormat("YYYY-mm-dd HH:MM:SS", new Date())   2022-06-01 11:22:30  */
function dateFormat(fmt, date) {
    if (!fmt) {
        throw console.error("fmt:YYYY-mm-dd HH:MM:SS");
    }
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        console.log(ret, "ret");
        if (ret) {
            fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
        }
    }
    return fmt;
}

function obtainTime(n) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    /* 返回今天是这个星期的星期几 */
    const day = now.getDay();
    n = day == 0 ? n + 6 : n + (day - 1);
    now.setDate(now.getDate() - n);
    const date = now.getDate();
    const s = year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (date < 10 ? "0" + date : date);
    return s;
}
//上周的开始时间
// console.log(getTime(7));
//上周的结束时间
// console.log(getTime(1));
//本周的开始时间
// console.log(getTime(0));
//本周的结束时间
// console.log(getTime(-6));
//下周的开始时间
// console.log(getTime(-7));
//下周结束时间
// console.log(getTime(-13));
//["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"][new Date().getDay()];

/* 两个时间戳相隔时间  ${days}天${hours}时${minutes}分${scends}秒 */
console.log("11111");

const BinarySearch = (arr, target, start, end) => {
    var idx = Math.floor((start + end) / 2);
    if (idx == start && arr[idx] != target) {
        return -1;
    }
    else if (idx == start && arr[idx] == target) {
        return idx;
    }
    if (target < arr[idx]) {
        return BinarySearch(arr, target, start, idx);
    }
    else if (target > arr[idx]) {
        return BinarySearch(arr, target, idx, end);
    }
    else {
        return idx;
    }
};
BinarySearch([{ id: 1 }, { id: 2 }], { id: 1 }, 0, 2);
console.log(BinarySearch([{ id: 1 }, { id: 2 }], { id: 1 }, 0, 2), "1111");
// const foo1 = <T>(x: T): T => x;
// const foo2 = <T extends {}>(x: T): T => x;
// const foo3 = <T extends Record<string, unknown>>(x: T): T => x;
// const foo4: <T>(x: T) => T = (x) => x;
// const foo5 = <T>(arg: T): T => {
//   console.log(arg);
//   return arg;
// };

/**
 * const bem = createBEM('button');
   className={classnames(bem(), className)}
   
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */
function classnames(...classNames) {
    let i = 0, tmp, x, str = "";
    while (i < arguments.length) {
        if ((tmp = classNames[i++])) {
            if ((x = toVal(tmp))) {
                str && (str += " ");
                str += x;
            }
        }
    }
    return str;
}
function createBEM(name) {
    return function (el, mods) {
        if (el && typeof el !== "string") {
            mods = el;
            el = "";
        }
        el = el ? `${name}__${el}` : name;
        return `${el}${gen(el, mods)}`;
    };
}
function toVal(mix) {
    let k, y, str = "";
    if (typeof mix === "string" || typeof mix === "number") {
        str += mix;
    }
    else if (typeof mix === "object") {
        if (Array.isArray(mix)) {
            for (k = 0; k < mix.length; k++) {
                if (mix[k]) {
                    if ((y = toVal(mix[k]))) {
                        str && (str += " ");
                        str += y;
                    }
                }
            }
        }
        else {
            for (k in mix) {
                if (mix[k]) {
                    str && (str += " ");
                    str += k;
                }
            }
        }
    }
    return str;
}
function gen(name, mods) {
    if (!mods) {
        return "";
    }
    if (typeof mods === "string") {
        return ` ${name}--${mods}`;
    }
    if (Array.isArray(mods)) {
        return mods.reduce((ret, item) => ret + gen(name, item), "");
    }
    return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? gen(name, key) : ""), "");
}

/**
 * 产生一个成功的结果
 *
 * @export
 * @template R 结果类型
 * @param value 结果参数
 * @returns
 */
function okRes(value) {
    return { isError: false, value };
}
/**
 * 产生一个失败的结果
 *
 * @export
 * @template E 失败类型
 * @param error 失败参数
 * @returns
 */
function errRes(error) {
    return { isError: true, error };
}

function fixProto(target, prototype) {
  var setPrototypeOf = Object.setPrototypeOf;
  setPrototypeOf ? setPrototypeOf(target, prototype) : target.__proto__ = prototype;
}

function fixStack(target, fn) {
  if (fn === void 0) {
    fn = target.constructor;
  }

  var captureStackTrace = Error.captureStackTrace;
  captureStackTrace && captureStackTrace(target, fn);
}

var __extends = function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) {
          d[p] = b[p];
        }
      }
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var CustomError = function (_super) {
  __extends(CustomError, _super);

  function CustomError(message) {
    var _newTarget = this.constructor;

    var _this = _super.call(this, message) || this;

    Object.defineProperty(_this, 'name', {
      value: _newTarget.name,
      enumerable: false,
      configurable: true
    });
    fixProto(_this, _newTarget.prototype);
    fixStack(_this);
    return _this;
  }

  return CustomError;
}(Error);

// https://github.com/adriengibrat/ts-custom-error/blob/master/README.md
const TYPE = Symbol.for("ArtisanError#type");
var ErrorType;
(function (ErrorType) {
    ErrorType["BUILTIN"] = "BUILTIN";
    ErrorType["ERROR"] = "ERROR";
    ErrorType["EXCEPTION"] = "EXCEPTION";
})(ErrorType || (ErrorType = {}));
class ArtisanThrowable extends CustomError {
    constructor(options) {
        super((options === null || options === void 0 ? void 0 : options.message) || "");
        this.options = options || {};
        this.code = this.options.code || "";
    }
    static getType(err) {
        return err[TYPE] || ErrorType.BUILTIN;
    }
    static from(err, ...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const ErrorClass = this;
        const newErr = new ErrorClass(...args);
        newErr.message = err.message;
        newErr.stack = err.stack;
        for (const key of Object.keys(err)) {
            newErr[key] = err[key];
        }
        return newErr;
    }
}
class ArtisanBaseException extends ArtisanThrowable {
    constructor(options) {
        super(options);
        this[TYPE] = ErrorType.EXCEPTION;
    }
}
/** main */
/** ArtisanException is system error. */
class ArtisanException extends ArtisanBaseException {
    constructor(message) {
        super({
            code: "ARTISAN_EXCEPTION",
            message: message || "",
        });
    }
}

export { ArtisanBaseException, ArtisanException, ArtisanThrowable, classnames, createBEM, dateFormat, errRes, obtainTime, okRes };

if(typeof window !== 'undefined') {
  window._Dry_VERSION_ = '0.0.6'
}
