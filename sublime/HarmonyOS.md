# DevEco Studio
DevEco Studio是面向HarmonyOS的全功能IDE，提供开箱即用的开发工具和调试能力，帮助开发者快速开发、调试和部署HarmonyOS应用。
(选择ets文件 点击右侧的preview按钮可以预览页面)
可能会遇到的问题： build failed  可以 在preference--->build execution----> Hvigor---> 关闭 'Enable the Daemon'

# ArkTS 语言
ArkTS是鸿蒙生态的应用开发语言。它在保持TypeScript（简称TS）基本语法风格的基础上，对TS的动态类型特性施加更严格的约束，引入静态类型。同时，提供了声明式UI、状态管理等相应的能力，让开发者可以以更简洁、更自然的方式开发高性能应用。
![](./images/arkts.gif)


# 生命周期回调函数


# API
@Builder

@State  
@Link
@Prop

![](./images/2024-01-10-08-59-51.png)


# 轻量化并发机制
ArkCompiler运行时在HarmonyOS上提供了Worker API支持并发编程。在运行时实例内存隔离的基础上，ArkCompiler通过共享运行实例中的不可变或者不易变的对象、内建代码块、方法字节码等技术手段，优化了并发运行实例的启动性能和内存开销。
![](.images/arkts-3_00000.gif)

# stage模型
![](./images/stage基本模型.png)


![](./images/2024-01-09-16-14-20.png)

# UIAbility生命周期状态
![](./images/2024-01-09-16-15-53.png)

## Create状态
Create状态为在应用加载过程中，UIAbility实例创建完成时触发，系统会调用onCreate()回调。可以在该回调中进行应用初始化操作，例如变量定义资源加载等，用于后续的UI界面展示

## WindowStageCreate和WindowStageDestroy状态
UIAbility实例创建完成之后，在进入Foreground之前，系统会创建一个WindowStage。WindowStage创建完成后会进入onWindowStageCreate()回调，可以在该回调中设置UI界面加载、设置WindowStage的事件订阅。
![Alt text](./images/image.png)

```
import UIAbility from '@ohos.app.ability.UIAbility';
import Window from '@ohos.window';

export default class EntryAbility extends UIAbility {

    onCreate(want, launchParam) {
        // 应用初始化
    }

    onWindowStageCreate(windowStage: Window.WindowStage) {
        // 设置WindowStage的事件订阅（获焦/失焦、可见/不可见）

        // 设置UI界面加载
        windowStage.loadContent('pages/Index', (err, data) => {
            // ...
        });
    }

    onForeground() {
        // 申请系统需要的资源，或者重新申请在onBackground中释放的资源
    }

    onBackground() {
        // 释放UI界面不可见时无用的资源，或者在此回调中执行较为耗时的操作
        // 例如状态保存等
    }

    onWindowStageDestroy() {
        // 释放UI界面资源
    }

    onDestroy() {
        // 系统资源的释放、数据的保存等
    }
}

```

## 使用globalThis进行数据同步
globalThis是ArkTS引擎实例内部的一个全局对象，引擎内部的UIAbility/ExtensionAbility/Page都可以使用，因此可以使用globalThis全局对象进行数据同步
![Alt text](./images/image-1.png)