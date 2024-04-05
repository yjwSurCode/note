# 初始化
npx create-next-app@latest node 版本 21
npx create-next-app@13 node 版本 18.17.0
yarn global add create-next-app
![](../note/sublime/assets/note2023-11-25-15-05-28.png)
`默认访问 文件夹下面的page.tsx文件  不会默认访问index.tsx文件`

#  渲染模式 https://juejin.cn/post/7162775935828115469?searchId=20231204170032D2AB9823D284C34A4D76
![](../note/sublime/assets/服务端渲染对比客户端渲染.png)
## 1：客户端渲染（CSR）react的SPA模式
从服务器接收到初始 HTML、CSS 和 JavaScript 后，使用 JavaScript 在客户端浏览器上呈现网页的过程
场景: 当用户需要频繁更新数据或不想预渲染页面时


# 2：服务端渲染(SSR)
![](../note/sublime/assets/note2023-12-05-10-50-17.png)
将网页发送到客户端浏览器之前在服务器上呈现网页的过程
`服务端渲染组件为类似renderToString，拼接成 html 返回浏览器，浏览器解析渲染出返回的html，然后执行 hydrate，把渲染和已有的 html 标签关联`
`hydrate 会在渲染的过程中，不创建 html 标签，而是直接关联已有的。这样就避免了没必要的渲染`
# SSR渲染原理及流程 https://zhuanlan.zhihu.com/p/622415299
`传统SSR`
服务端渲染只能得到最简单的的 HTML

`react服务端渲染`
服务器端使用 renderToString 直接渲染出的页面信息为静态 html。
客户端根据渲染出的静态html进行 hydrate，做一些绑定事件等操作。

SSR 和 CSR 的区别在于，在SSR中,从服务器上的每个页面请求获取数据；而在CSR中，从客户端获取数据。

`SSR 存在的问题`
当请求量增大时，每次重新渲染增加了服务器的开销。
需要等页面中所有接口请求完成才可以返回 html，虽不是白屏，但完成 hydrate 之前，页面也是不可操作


## 3：纯静态站点 SSG
why: 多次请求页面 服务器多次处理渲染生成html文件 增加了服务器的开销。
页面在构建期间只获取一次数据。静态生成页面非常快，性能良好，因为所有页面都事先构建。SSG 因此非常适合使用静态内容（比如销售页面或博客）的页面
SSG 生成可从内容分发网络 (CDN) 提供的静态文件


getStaticPaths 可以解决 静态站台不同不同的问题
```
export async function getStaticPaths() {
  const articles = await fetch('https://localhost:3000/api/articles').then((res)=>res.json());
  return {
    paths: articles.map((p) => ({
      params: {
        id: p.id.toString(),
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const res = await fetch(`https://localhost:3000/api/articles/${params.id}`).then((res)=>res.json());

  return {
    props: { data: res },
  };
}
```

## 4：增量静态生成（ISR）

`ISR 生成 html 文件后，默认并不会读取它，因为写入磁盘之前，存入到了内存中，也就是加了一个变量进行缓存 html 字符串`
`next 多进程这里的处理方式也很有意思，每次访问新的进程，都会重新去生成一次 html 文件，但是当次的访问请求会返回旧的缓存页面，如果没有旧的内容才返回新的内容。每个进程生成页面后都会被记录，下次访问不再重现生成`

老版本写法：
export async function getStaticProps({ params }) {
return {
props: {
product: await getProductFromDatabase(params.id)
},
revalidate: 60
}
}

新版本写法：
`fetch (https://..。/data'， {next: {revalidate: 60}})`
使用 fetch 请求从指定的 URL 获取数据，并在 60 秒后重新验证数据。这可能是用于实现数据的定期更新或在一定时间间隔后获取最新数据的逻辑

 TODO getStaticPaths 新版本怎么半？？？？？？

 fallback 有 3 个值

fallback: 'blocking' 未生成的页面使用服务端渲染;
fallback: false 未生成的页面访问 404
fallback: true 当访问的静态页面不存在时，会显示 loading，直到静态页面生成返回新的页面。


# BUG 每台服务器都是独立的，磁盘上生成的 html 会可能不一样，server 内存中缓存的 html 也可能不一样。那么可能多次访问，用户显示的结果却可能不一样。

module.exports = {
experimental: {
// 默认最大缓存限制为 50MB
isrMemoryCacheSize: 0,
},
}


async function getData() {
  const res = await fetch('https://api.example.com/...');
  return res.json();
}
'use client';

export default function Page() {
  const name = use(getData());

  return <h1> {name} </h1>;
}



# 路由
RootLayout
`默认主
主页面 app 下面的 layout page not-found 可以 app 下面新建 test 文件夹 生成新的页面


# getStaticProps


## Link
import Link from 'next/link'

<Link href={`/blog/${post.slug}`}>{post.title}</Link>
<Link href={{ pathname: '/test', query: { name: '黑' } }}>
const  Pathname = usePathname(); /test
console.log(Pathname, params.getAll('name')); /test  ['黑']

prefetch 属性会在后台预读取目标路由页面，默认值为 true。它具有以下特性：


## useRouter `要配合 'use client'; 使用` 除非您有使用 useRouter 的特殊要求，否则请使用 <Link> 组件在路由之间导航

import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/dashboard', { scroll: false }) `方法是最好加上 e.preventDefault() 来阻止默认行为`

预读取 /dashboard 页面
router.prefetch('/dashboard')


# useSearchParams

const search = searchParams.get('search')

// URL -> `/dashboard?search=my-project`
// `search` -> 'my-project'

# const Pathname = usePathname();

# useClient

是 Next.js 提供的一个自定义钩子，用于在函数组件中获取客户端的上下文。它的作用是在服务器端渲染时避免调用客户端特定的代码，以免产生错误或不一致的行为。

# (app)

例如 主文件夹 app 下面有(app)文件夹 + --->mail 文件夹
domain.com/mail 直接访问 mail 下面的 page 页面 同时执行 provider.tsx+layout.tsx 文件

# [code] 文件夹

例如 test 文件夹下面有 page.tsx 文件 + [code]文件夹  
可以通过 domain.com/test/id 访问 [code]文件夹的页面
[code]下面的 page.tsx 参数的 context 可以拿到 { params: { code: '1' }, searchParams: {} }

app 主文件下面的 [code]
http://localhost:3000/errorurl/errorurl 会匹配 主 notFound 文件
http://localhost:3000/errorurl 会匹配 [code]下面的 page.tsx 文件

# [...code] 文件夹

例如 test 文件夹下面有 page.tsx 文件 + [...code]文件夹  
可以通过 domain.com/test/id/id 访问 [...code]文件夹的页面

# useSelectedLayoutSegment

'use client'
import { useSelectedLayoutSegment } from 'next/navigation'
export default async function Layout(props: {
//...
auth: React.ReactNode
}) {
const loginSegments = useSelectedLayoutSegment('auth')
// ...
}

# 静态资源 getStaticProps 服务端渲染 getServerSideProps 动态配置 metadata generateMetadata

//! getStaticProps always runs on the server and never on the client. You can validate code written inside getStaticProps is removed from the client-side bundle with this tool.

# staticProps !!!老版本

staticProps 是一个 Next.js 的新特性，它允许您在页面组件中使用 getStaticProps() 方法来获取数据。getStaticProps() 方法返回一个对象，其中包含页面的静态 HTML，以及在客户端渲染页面时需要的数据。
`export async function generateMetadata({ params }: { params: { code: string } }) { }`

## 必须放在 src-->page 文件夹下面
export async function getStaticProps() {
times += 1;
console.log(`demo1:`, times);
return {
props: {
mark: "demo1",
times,
},
revalidate: 10, // In seconds
};
}

```
function Page({ data }) {
  // 渲染数据...
}

// 每个请求都会调用它
export async function getServerSideProps() {
  // 从外部 API 获取数据
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // 通过 props 向页面传递数据
  return { props: { data } }
}

export default Page
```

# !!! staticProps 新版本写法 !!!

async function getProjects() {
const res = await fetch(`http://jsonplaceholder.typicode.com/posts`, {
cache: 'no-store',
});
const projects = await res.json();
const \_projects = [
{ id: '1', name: '黑' },
{ id: '1', name: '黑' },
{ id: '1', name: '黑' },
];

return \_projects;
}

export default async function Dashboard() {
const projects = await getProjects();

return (

<ul>
{projects.map((project: any) => (
<li key={project.id}>{project.name}</li>
))}
</ul>
);
}

# 错误写法 不要 client 组件 嵌套 async 异步组件

# 正确写法 最好 async 组件 嵌套 client 组件


# Middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
// Clone the request headers and set a new header `x-version`
const requestHeaders = new Headers(request.headers);
requestHeaders.set('x-version', '13');

// You can also set request headers in NextResponse.rewrite
const response = NextResponse.next({
request: {
// New request headers
headers: requestHeaders,
},
});

// Set a new response header `x-version`
response.headers.set('x-version', '13');
return response;
}

# 使用 redux

例如 /aaa 路由页面需要使用 redux
同级 layout.tsx:
<ReduxProvider>

<div className="container m-auto">{children}</div>
</ReduxProvider>

const dispatch = useDispatch();
const \_cart = useSelector<{ cart: any }>((state) => state.cart);

<button onClick={() => dispatch(addToCart([{ id: 123 }]))}></button>

# 使用 zustand (https://zhuanlan.zhihu.com/p/591981209)
// store.ts
import create from 'zustand'

export const useStore = create(set => ({
  count: 1,
  inc: () => set(state => ({ count: state.count + 1 })),
}))

// Control.tsx
import { useStore } from './store';

function Control() {
  return <button onClick={()=>{
    useStore.setState((s)=>({...s,count: s.count - 5 }))
    }}>－5</button>
}

// AnotherControl.tsx
import { useStore } from './store';

function AnotherControl() {
  const inc = useStore(state => state.inc)
  return <button onClick={inc}> +1 </button>
}

// Counter.tsx
import { useStore } from './store';

function Counter() {
  const { count } = useStore()
  return <h1>{count}</h1>  
}

# 手写 zustand
import { useSyncExternalStore } from "react";

const createStore = (createState) => {
    let state;
    const listeners = new Set();
  
    const setState = (partial, replace) => {
      const nextState = typeof partial === 'function' ? partial(state) : partial

      if (!Object.is(nextState, state)) {
        const previousState = state;

        if(!replace) {
            state = (typeof nextState !== 'object' || nextState === null)
                ? nextState
                : Object.assign({}, state, nextState);
        } else {
            state = nextState;
        }
        listeners.forEach((listener) => listener(state, previousState));
      }
    }
  
    const getState = () => state;
  
    const subscribe= (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  
    const destroy= () => {
      listeners.clear()
    }
  
    const api = { setState, getState, subscribe, destroy }

    state = createState(setState, getState, api)

    return api
}

function useStore(api, selector) {
    function getState() {
        return selector(api.getState());
    }
    
    return useSyncExternalStore(api.subscribe, getState)
}

export const create = (createState) => {
    const api = createStore(createState)

    const useBoundStore = (selector) => useStore(api, selector)

    Object.assign(useBoundStore, api);

    return useBoundStore
}



# NextAuth.js 给 Next.js 应用添加鉴权与认证

yarn add next-auth

<Button
loading={loading}
onClick={() => {
setLoading(true);
signIn("google", {
consent: error === "RefreshAccessTokenError",
...(next && next.length > 0
? { callbackUrl: next }
: { callbackUrl: "/welcome" }),
});
}} >
I agree
</Button>

# Next-Auth and serve-action

https://www.bilibili.com/video/BV1AH4y1B7rh/?spm_id_from=333.337.search-card.all.click&vd_source=fcbe9920cae640e8ad1326cfb5c6b943

# 缓存失效

revalidatePath("/dashboard/users");
redirect("/dashboard/users");

# Next#JS 开发：使用 winston 记录日志

# 使用 sass

npm install --save-dev sass

# SWR 使用

只会有 1 个请求发送到 API，因为它们使用相同的 SWR key，因此请求会被自动 去除重复、缓存 和 共享。
SWR 默认 深度比较 数据更改。如果 data 值没有改变，则不会触发重新渲染

// const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

useSWR('/api/todos', fetcher, { refreshInterval: 1000 })

# useSWRImmutabl e

`使用时注意事项`
1、请求参数的唯一性
2、缓存数据在被所有页面共享，要注意不能修改
从 A 页面获取了列表数据 list, 但是 A 页面中只展示一个，list.slice(0, 1)
从 B 页面也获取 list 数据，此时获取到的 list 长度也只有 1
3、不能通过 SWR 获取常量或者变量
4、不能中断请求
5、key 对应的响应结果没有被删除，需要手动清理缓存，避免内存泄露

# build 项目

1: next build
2: next start

实心点 代表静态站点生成
入符号 代表服务端数据

# next-ui

yarn add @nextui-org/react

import type { Config } from 'tailwindcss'
import {nextui} from "@nextui-org/react";

const config: Config = {
content: [
'./src/pages/**/\*.{js,ts,jsx,tsx,mdx}',
'./src/components/**/_.{js,ts,jsx,tsx,mdx}',
'./src/app/\*\*/_.{js,ts,jsx,tsx,mdx}',

     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"

],
theme: {
extend: {
backgroundImage: {
'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
'gradient-conic':
'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
},
},
},
plugins: [nextui()],
}
export default config

# NextJs 进行跨域请求
https://rabithua.club/archives/761/

# 环境变量
.env.local（本地环境）
.env（所有环境）
.env.development（开发环境）
.env.production（生产环境）

# 优化

1:静态资源开启 gzip 压缩
2:静态资源、图片等开启强缓存
3:动态加载组件 dynamic
const ComponentC = dynamic(
() => import('../components/C'), { ssr: false }
)
