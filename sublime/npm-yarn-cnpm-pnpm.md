
## 包管理
## pnpm： https://zhuanlan.zhihu.com/p/457698236

npm install -g pnpm

配置环境变量：

http://106.12.154.161/images/huan1.png

http://106.12.154.161/images/huan2.png


pnpm up --latest


命令：
pnpm install
pnpm add name
pnpm add -D name


# 问题 pnpm: ENOENT: no such file or directory, 
stat 'D:\VUE2-TS\rt-ued-scaffolding\node_modules\.pnpm\@types+react@17.0.47\node_modules\csstype'


#
pnpm add -g pnpm

surcode@surcodedeMacBook-Pro ~ % pnpm setup      
Created /Users/surcode/.zshrc

Next configuration changes were made:
export PNPM_HOME="/Users/surcode/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"

To start using pnpm, run:
source /Users/surcode/.zshrc
surcode@surcodedeMacBook-Pro ~ % source /Users/surcode/.zshrc
surcode@surcodedeMacBook-Pro ~ % pnpm add -g pnpm  


<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2187b2c861fd4b469203ff222364ebd9~tplv-k3u1fbpfcp-watermark.image" alt=""  width="50%" />

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2187b2c861fd4b469203ff222364ebd9~tplv-k3u1fbpfcp-watermark.image" alt=""  width="49%" />




更新项目依赖包： https://www.npmjs.com/package/npm-check-updates

npm-check-updates

更新包  ncu -u


# upgrade only mocha
ncu mocha
ncu -f mocha
ncu --filter mocha

# upgrade packages that start with "react-"
ncu react-*
ncu "/^react-.*$/"

# upgrade everything except nodemon
ncu \!nodemon
ncu -x nodemon
ncu --reject nodemon

# upgrade only chalk, mocha, and react
ncu chalk mocha react
ncu chalk, mocha, react
ncu -f "chalk mocha react"

# upgrade packages that do not start with "react-".
ncu \!react-*
ncu '/^(?!react-).*$/' # mac/linux
ncu "/^(?!react-).*$/" # windows






yarn：

npm：

cnpm：