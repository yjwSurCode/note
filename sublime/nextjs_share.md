# 1:初始化
npx create-next-app@latest  node 版本 21 <br>
npx create-next-app@13 node 版本 18.17.0

### next12及以下老版本

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32e1b400eb1f4eb387908906a0ef2f0c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=468&h=488&s=41048&e=png&b=181818)

默认 _app.tsx 为入口；

1.1 getStaticProps `在build阶段执行`
```js
export async function getStaticProps() {
  times += 1;
  console.log(`render demo1:`, times); // 刷新之后revalidate 5秒之后触发
  return {
    props: {
      mark: 'demo1',
      times,
    },
    revalidate: 5, // In seconds
    // When a request is made to a page that was pre-rendered at build time, it will initially show the cached page
    // 当发出请求让页面进行构建时，它会先返回缓存页面。
  };
}
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fee645fc06e48a999691c35bc0e2fc1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1324&h=698&s=134337&e=png&b=000000)

1.2 getServerSideProps `在每个请求时执行`
```js
export async function getServerSideProps() {
  times += 1;
  return {
    props: {
      times,
    },
  };
}
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/872094d088004bb89bfa92cd628ae33a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1326&h=850&s=216616&e=png&b=050505)

### next14版本
默认 app文件下的page.tsx为入口；

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5957169ce9304aa3a6250a3051a179bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=564&h=408&s=37643&e=png&b=191919)

[`middleware`]()           | 中间件 |  
Next请求中间件 与src同级  配合 next-auth 做登陆验证 

https://nextjs.org/docs/app/building-your-application/routing/middleware#example

[`@folder`]()           | 命名插槽 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| [`(.)folder`]() | 拦截同级

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58838759b253499e9553c0506d48c017~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=586&h=774&s=97479&e=png&b=181818)

```js
// 页面 src--app--layout.page
export default function Layout(props: { children: React.ReactNode, modal: React.ReactNode, modals: React.ReactNode }) {
  return (
    <html>
      <body>
        {/* <GithubCorner /> */}
        {/* {props.modal} */}
        {props.children}
        {props.modals}
      </body>
    </html>
  )
}
```

# 2:路由(档案即是路由)
最好使用 import Link from 'next/link' 进行路由跳转

OR

import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/dashboard', { scroll: false }) `方法是最好加上 e.preventDefault() 来阻止默认行为`

`useRouter 要配合 'use client' 使用` <br>
use client是 Next.js 提供的一个自定义钩子，用于在函数组件中获取客户端的上下文。它的作用是在服务器端渲染时避免调用客户端特定的代码，以免产生错误或不一致的行为。

## 举🌰：
```js
import { redirect ,useRouter } from 'next/navigation';
const router = useRouter();
router.push('/test', { scroll: false, name: '黑' });
```

```js
<Link href={{ pathname: '/test', query: { name: '黑' } }}>
```

```js
  import { usePathname, useSearchParams } from 'next/navigation';
  const params = useSearchParams(); 
  // URL -> `/dashboard?search=my-project` `search` -> 'my-project'
  const pathname = usePathname();
  console.log(params.values(), params.toString(), 'params');
```

## (app) 文件夹路由
例如 主文件夹 app 下面有(app)文件夹 + 下一级mail 文件夹
domain.com/mail 直接访问 mail 下面的 page 页面 同时执行 provider.tsx + layout.tsx 文件

## [code] 文件夹路由

例如 test 文件夹下面有 page.tsx 文件 + [code]文件夹  
可以通过 domain.com/test/id 访问 [code]文件夹的页面
[code]下面的 page.tsx 参数的 context 可以拿到 { params: { code: '1' }, searchParams: {} }

##  app 主文件下面的 [code]
http://localhost:3000/errorurl/errorurl 会匹配 主 notFound 文件
http://localhost:3000/errorurl 会匹配 [code]下面的 page.tsx 文件

# # [...code] 文件夹路由

例如 test 文件夹下面有 page.tsx 文件 + [...code]文件夹  
可以通过 domain.com/test/id/id 访问 [...code]文件夹的页面

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d00d4f946c74d14b2391f4566e0ffe2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=604&h=268&s=31366&e=png&b=181818)

# 3:数据请求

## 3.1 fetch

```js
    const res = await fetch(`http://106.12.154.161/images/json/dummy-backend.json`, {
        // cache: 'no-store',
        next: { revalidate: 0, tags: [] }, 
        //!revalidate 秒为单位
        //!tags: [id], // 使用文章的ID作为标签
    });
```


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f70788d48fe426d8b7ef673ea58f2af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1836&h=1046&s=302119&e=png&b=1f1f1f)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e88e2e9d94b4263bf0625955f0434a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1584&h=40&s=20009&e=png&b=1f1f1f)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe5f074fb64243f6bb91c57ecb4bd9dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1302&h=1208&s=343578&e=png&b=1c1c1c)
默认值：force-cache

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9044d11543e41e99fa9b07447526209~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1346&h=636&s=110389&e=png&b=030303)

3.1.1 重新验证：

revalidate：
```js
fetch('https://...', { next: { revalidate: 3600 } })
```
revalidatePath：

```js
'use server' import { revalidatePath } from 'next/cache' 
export default async function submit() { await submitForm() revalidatePath('/')}
```
https://nextjs.org/docs/app/api-reference/functions/revalidatePath

revalidateTag：
```js
export default async function Page() { const res = await fetch('https://...', { next: { tags: ['collection'] } }) const data = await res.json() // ... }
```

```js
'use server' import { revalidateTag } from 'next/cache' export default async function action() { revalidateTag('collection') redirect(`/post/${id}`) // 导航到新的文章页面 }
```

对于多个fetch 可以通过段配置选项处理(https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

3.1.2 第三方库：
SWR(https://swr.vercel.app/zh-CN/docs/typescript)

过期就会重新验证，它有缓存，聚焦时重新验证，间隔轮询等功能。

```js
const { data, isLoading, error } = useSWR(`http://106.12.154.161/images/json`, {
        refreshInterval: 1000,  //单位毫秒
        onSuccess: () => {
            console.log('onSuccess');
        },
    });
```

# 4:渲染模式

## CSR(Client Side Rendering)(客户端渲染)
   优点：1:可以提高网站的交互性能 2:用户在与页面交互时无需进行页面刷新<br>
   缺点：1:首次渲染，白屏时间过长 2:不利于SEO
   
## SSG(Static Site Generation)(静态站点)
页面在构建期间只获取一次数据。静态生成页面非常快，性能良好，因为所有页面都事先构建。SSG 因此非常适合使用静态内容（比如销售页面或博客）的页面
缺点也是因为静态，不能动态渲染，每添加一篇博客，就可能需要重新构建。

## ISR（Incremental Static Regeneration）(增量静态生成)

`固定时间revalidate`

```js
        const res = await fetch(
            `http://106.12.154.161/images/json/dummy-backend.json`,
            { next: { revalidate: 20 } },
        );
```
当访问页面时，发现 20s 没有更新页面就会重新生成新的页面，但当前访问的还是已经生成的静态页面，也就是：是否重新生成页面，需要根据上一次的生成时间来判断，并且数据会延迟 1 次。

`tip`:本地使用运行 yarn build 和 yarn start 来模拟生成环境，测试增量生成。`

`按需revalidate增量生成`

```js
// 页面地址 app/api/revalidate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// 手动更新页面 
export async function GET(request: NextRequest) {
   
  // 保险起见，这里可以设置一个安全校验，防止接口被非法调用
  //这里的process.env.NEXT_PUBLIC_UPDATE_SSG名字要与你设置在项目中的环境变量名字相同
  
  if (request.query.secret !== process.env.NEXT_PUBLIC_UPDATE_SSG) {
      return NextResponse.json(
      { data: error, message: 'Invalid token' },
      {
        status: 401,
      },
    );
  }
  const path = request.nextUrl.searchParams.get('path') || '/pokemon/[name]';
  
  // 这里可以匹配fetch请求中指定的collection变量
  const collection = request.nextUrl.searchParams.get('collection') || 'collection';
  
  // 触发更新
  revalidatePath(path);
  revalidateTag(collection);
  
  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    cache: 'no-store',
  });
}

//比如我们在数据库中增加了 2 条数据，`http://localhost:3000/api/revalidate?path=/pokemon/Charmander`就可以实现`/pokemon/Charmander`这个路由的手动更新
```

## SSR服务端渲染 (https://zhuanlan.zhihu.com/p/622415299)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e239cddecb014ae99e9028bdfaffe892~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=970&s=409143&e=png&b=fcfcfc)
`服务器端使用 renderToString 直接渲染出的页面信息为静态 html。
客户端根据渲染出的静态 html 进行 hydrate，做一些绑定事件等操作。`

`目前SSR 存在的问题`
当请求量增大时，每次重新渲染增加了服务器的开销。
需要等页面中所有接口请求完成才可以返回 html，虽不是白屏，但完成 hydrate 之前，页面也是不可操作

## Streaming and Suspense

举个🌰：一个页面采用 SSR 的方式渲染页面，那么就需要等接口全部返回才可以看到页面,如果其中某个接口返回较慢，那么整个程序就是待响应状态。

```js
import { SkeletonCard } from '@/ui/SkeletonCard';
import { Suspense } from 'react';
import Comments from './Comments';

export default function Posts() {
  return (
    <BlogList />
    <section>
     <BlogDetail />
      <Suspense
        fallback={
          <div className="w-full h-40 ">
            <SkeletonCard isLoading={true} />
          </div>
        }
      >
        <Comments />
      </Suspense>
    </section>
  );
}

// Comments页面
import { use } from 'react';
async function fetchComment(): Promise<string> {
  return fetch('http://www.example.com/api/comments').then((res)=>res.json())
}

export default function Comments() {
  let data = use(fetchComment());
  return (
    <section>
      {data.map((item)=><Item key={item.id}/>)}
    </section>
  );
}

```

## 注意事项

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fdd3b09ea7c46179f2ca92980a54ded~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=618&s=121432&e=png&b=ffffff)



# 5:部署上架

##  build 项目
next build

vercel部署(https://vercel.com/new/yjwsurcodes-projects?filter=next.js)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b32c107a7c1642808c09eb61c93f9c4c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2876&h=1222&s=336396&e=png&b=080808)

next build && next export

docker nginx 部署 <br>
https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
