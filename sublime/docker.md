# Docker
>Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，
然后发布到任何流行的 Linux 或 Windows 操作系统的机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口
Docker 作为轻量级虚拟化技术，拥有持续集成、版本控制、可移植性、隔离性和安全性等优势
Docker 使用 Google 公司推出的 Go 语言 进行开发实现，基于 Linux 内核 的 cgroup,namespace,以及 AUFS 类的 UnionFS 等技术，对进程进行封装隔离，属于操作系统层面的虚拟化技术。 由于隔离的进程独立于宿主和其它的隔离的进
程,因此也称其为容器。Docker 最初实现是基于 LXC.
Docker 能够自动执行重复性任务，例如搭建和配置开发环境，从而解放了开发人员以便他们专注在真正重要的事情上，构建杰出的软件。
用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

# 安装

## 1: sudo yum install -y yum-utils 
#安装 yum-utils，因为 utils 提供了 yum-config-manager 能力

## 2: sudo  yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo 
#### 安装国内的仓库保证我们后续下载 docker 中的各个应用可以快速执行，因为从国外的镜像下载实在太慢了

安装最新版本的 Docker Engine-Community 和 containerd。
## 3: sudo yum install docker-ce docker-ce-cli containerd.io docker-compose-plugin


* 查看docker： docker -v
* Docker version 20.10.17, build 100c701

* 重启 reload docker
* systemctl restart docker.service

* 安装最新的 docker engine
* sudo systemctl start docker

* 设置开机自启
* sudo systemctl enable docker 


问题： Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
 需要重启一下


命令：
> 1 查看镜像 docker images
>
```
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
nginx         latest    2d389e545974   8 months ago    142MB
robot   latest    feb5d9fea6a5   20 months ago   13.3kB
node          14.17.0   9153ee3e2ced   2 years ago     943MB


```
> 
> 2 查看所有容器 docker ps -a
>
```
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS                      PORTS                                   NAMES
b20a20baba6f   nginx         "/docker-entrypoint.…"   8 months ago    Exited (255) 7 months ago   0.0.0.0:8080->80/tcp, :::8080->80/tcp   nginxcontainer
55eb928cbb93   hello-world   "/hello"                 10 months ago   Exited (0) 10 months ago                                            peaceful_bartik

```
> 
> 
> 3 删除镜像：(删除之前要停止容器)
> 
> docker rmi  id
>
> 🌰: docker rmi  2f232153cc95   （ 2f232153cc95是   IMAGE ID ）


> 4 :停止运行镜像 docker stop CONTAINER ID
>
> 🌰: docker stop  b20a20baba6f  （ b20a20baba6f 是 CONTAINER IDD ）




部署步骤：

1: docker build -t robot .   在有dockerfile文件的地址打包镜像 robot是名称 robot是 REPOSITORY

2: 加上tag   
docker tag robot robot:v2   (robot 是 REPOSITORY)

3: 运行
docker run --name dockercontainer -d -p 3000:3000 robot

（docker run --name robotnameroute（容器名称自取） -d -p 3002:3002 robot（镜像名称））

<br>

# 优雅部署方式DockerCompose  docker-compose.yml

Dockerfile 可以让用户管理一个单独的应用容器；而 Docker Compose 则允许用户在一个模板（YAML 格式）中定义一组相关联的应用容器（被称为一个 project，即一个项目对应多个服务），例如一个 Web 服务容器再加上后端的数据库服务容器等。

# Docker Compose 安装

方法一：

下载安装：

sudo curl -L https://github.com/docker/compose/releases/download/1.20.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose


申请执行权限：

chmod +x /usr/local/bin/docker-compose

创建软链：

ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

#查看版本
docker-compose version

方法二：

#安装pip
yum -y install epel-release
yum -y install python-pip
#确认版本
pip --version
#更新pip
pip install --upgrade pip
#安装docker-compose
pip install docker-compose 
#查看版本
docker-compose version



配置文件：

```
version: '3'

services:
    
  web:
    # 使用 ./project-server 目录下的 Dockerfile 文件进行构建容器，然后启动
    build:
      context: ./project-server
    container_name: server
    ports:
      - 3000:3000
    restart: always
    environment:
      - TZ=Asia/Shanghai
    # 这里表示需要redis 容器服务启动好才会启动 server
    depends_on:
      - redis

    redis:
    image: "redis:latest"


    这个还可以加上 nginx mysql 看项目需求

```

运行 compose 项目
```
$ docker-compose up

docker-compose up -d，将会在后台启动并运行所有的容器。一般推荐生产环境下使用该选项。

```

查看启动服务
docker-compose ps 
```
       Name                      Command               State           Ports         
-------------------------------------------------------------------------------------
composetest_redis_1   docker-entrypoint.sh redis ...   Up      6379/tcp              
composetest_web_1     python app.py                    Up      0.0.0.0:5000->5000/tcp

```


Compose 其它常用命令

#### 查看帮助
docker-compose -h ;
#### docker-compose -f docker-compose.yml up -d  指定使用的 Compose 模板文件，默认为 docker-compose.yml，可以多次指定。

#### 启动所有容器，-d 将会在后台启动并运行所有的容器
docker-compose up -d

#### 停用移除所有容器以及网络相关
docker-compose down

#### 查看服务容器的输出
docker-compose logs

#### 列出项目中目前的所有容器
docker-compose ps

#### 构建（重新构建）项目中的服务容器。服务容器一旦构建后，将会带上一个标记名，例如对于 web 项目中的一个 db 容器，可能是 web_db。可以随时在项目目录下运行 docker-compose build 来重新构建服务
docker-compose build

#### 拉取服务依赖的镜像
docker-compose pull

#### 重启项目中的服务
docker-compose restart

#### 删除所有（停止状态的）服务容器。推荐先执行 docker-compose stop 命令来停止容器。
docker-compose rm 

#### 在指定服务上执行一个命令。
docker-compose run ubuntu ping docker.com

#### 设置指定服务运行的容器个数。通过 service=num 的参数来设置数量
docker-compose scale web=3 db=2

#### 启动已经存在的服务容器。
docker-compose start

#### 停止已经处于运行状态的容器，但不删除它。通过 docker-compose start 可以再次启动这些容器。
docker-compose stop

#### 查看某个容器服务运行日志
docker-compose logs service-name