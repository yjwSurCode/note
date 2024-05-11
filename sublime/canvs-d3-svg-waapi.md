# canvas svg 区别：：：：：；：：：
1：Canvas是基于像素的位图，而SVG却是基于矢量图形
2：从结构上说，Canvas没有图层的概念，所有的修改整个画布都要重新渲染，而SVG则可以对单独的标签进行修改。
3：Canvas是基于HTML canvas标签，通过宿主提供的Javascript API对整个画布进行操作的，而SVG则是基于XML元素的。
4：svg可以直接嵌入html代码 

！！如果你绘制出来的图像是扭曲的，尝试用 width 和 height 属性为<canvas>明确规定宽高，而不是使用 CSS。


# canvas 学习 https://konvajs.org/docs/shapes/Circle.html


1:var ctx = canvas.getContext('2d');
2:var myGradient = ctx.createLinearGradient(0, 0, 0, 160); createLinearGradient方法用来设置渐变色。

// ctx.arc(x,y,r,sAngle,eAngle,counterclockwise)

// fillRect(x, y, width, height) 绘制一个填充的矩形
// strokeRect(x, y, width, height)绘制一个矩形的边框
// clearRect(x, y, widh, height)清除指定的矩形区域，然后这块区域会变的完全透明。
// beginPath()新建一条路径，路径一旦创建成功，图形绘制命令被指向到路径上生成路径
// moveTo(x, y)把画笔移动到指定的坐标(x, y)。相当于设置路径的起始点坐标。
// closePath()闭合路径之后，图形绘制命令又重新指向到上下文中
// stroke()通过线条来绘制图形轮廓
// fill()通过填充路径的内容区域生成实心的图形
// 绘制圆弧：：
// arc(x, y, r, startAngle, endAngle, anticlockwise):
// 以(x, y)为圆心，以r为半径，从 startAngle弧度开始到endAngle弧度结束。anticlosewise是布尔值，true表示逆时针，false表示顺时针。(默认是顺时针)
// radians=(Math.PI/180)*degrees   //角度转换成弧度
// arcTo(x1, y1, x2, y2, radius):根据给定的控制点和半径画一段圆弧，最后再以直线连接两个控制点。

//  ctx.drawImage(img, 10, 10);
// 参数	描述
// img	规定要使用的图像、画布或视频。
// sx	可选。开始剪切的 x 坐标位置。
// sy	可选。开始剪切的 y 坐标位置。
// swidth	可选。被剪切图像的宽度。
// sheight	可选。被剪切图像的高度。
// x	在画布上放置图像的 x 坐标位置。
// y	在画布上放置图像的 y 坐标位置。
// width	可选。要使用的图像的宽度（伸展或缩小图像）。
// height	可选。要使用的图像的高度（伸展或缩小图像）。

# 组件库：Konva http://konvajs-doc.bluehymn.com/docs/overview.html
konva 是一个对 canvas API 做了封装增强的 JavaScript 库。
HTML 原生的 canva 提供的 API 比较底层，用法上像是操纵一支画笔进行各种操作，画完就结束了。
canvas 本身不维护图形树，你也无法操作修改已被绘制的图形。
而 konva 能够像我们操作 DOM 树一样去绘制和维护元素，它会额外维护图形构成的树，并能在绘制后，对特定图形进行样式的修改。
你还可以在上面添加事件，比如鼠标滑入某图形时，图形变大一点。此外还支持方便的变形、动画、拖拽等高级能力。

../note/sublime/assets/note2023-11-22-16-17-17.png


konva用法:
#? 动画
var anim = new Konva.Animation(function(frame) {
    var time = frame.time,
        timeDiff = frame.timeDiff,
        frameRate = frame.frameRate;
    // update stuff
}, layer);
anim.start();

var tween = new Konva.Tween({
        node: rect,
        duration: 1,
        x: 140,
        rotation: Math.PI * 2,
        opacity: 1,
        strokeWidth: 6
});
tween.play();

#? 选择器
var circle = new Konva.Circle({
        radius: 10,
        fill: 'red',
        id : 'face',
        name : 'red circle'
});
layer.add(circle);

// then try to search

// find by type
layer.find('Circle'); // all circles

// find by id
layer.findOne('#face');

// find by name (like css class)
layer.find('.red')

#? 显示 隐藏
circle.show();
circle.hide();

#? 序列化 反序列化
var json = stage.toJSON();
var stage = Konva.Node.create(json, 'container');


#? cache clone 
layer.add(star);
stage.add(layer);
star.cache();

var clone;
for (var n = 0; n < 10; n++) {
clone = star.clone({
    x: Math.random() * stage.width(),
    y: Math.random() * stage.height()
});
clone.cache();
layer.add(clone);
}

layer.draw();

#? hitFunc 属性来创建一个定义事件响应区域函数

#? 创建自定义图形 



#? 填充 http://konvajs-doc.bluehymn.com/docs/styling/Fill.html

var radialGradPentagon = new Konva.RegularPolygon({
        x: 500,
        y: stage.height() / 2,
        sides: 5,
        radius: 70,
        fillRadialGradientStartPoint: { x: 0, y: 0 },
        fillRadialGradientStartRadius: 0,
        fillRadialGradientEndPoint: { x: 0, y: 0 },
        fillRadialGradientEndRadius: 70,
        fillRadialGradientColorStops: [0, 'red', 0.5, 'yellow', 1, 'blue'],
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
    });

# svg:


<svg> 包裹并定义整个矢量图。<svg> 标签之于矢量图就如同 <html> 标签之于一个 web 页面。
<line> 创建一条直线。
<polyline> 创建折线。
<rect> 创建矩形。
<ellipse> 创建圆和椭圆。

<polygon> 创建多边形。
现在我们来创建多边形。我们将会放置三个点，这些点之间会自动生成线段来创建一个三角形。点将是 (35,23)，(60,43) 和 (35,63)。如此，我们的多边形代码将会是：
<polygon points="35 23, 60 43, 35 63" />

<path> 通过指定点以及点和点之间的线来创建任意形状。

M 表示移动到（moveto）。它用 x 值和 y 值来给定一条新的路径的起始点。可以想象成把你的鼠标放在画布上的某一点以准备开始绘画。大写的 M 表示移动到一个绝对坐标集合（小写的 m 表示移动到一个相对坐标集合）。
L 表示划线到（lineto）。从当前位置到新的位置画一条线。大写的 L 表示移动到一个绝对坐标集合（小写的 l 表示移动到一个相对坐标集合）。
Z 表示闭合路径。通过在当前点和路径的起始点之间画一条直线来闭合形状。



<defs> 定义一个可复用的图形。初始情况下 <defs> 里面的内容是不可见的。<defs> 标签之于矢量图就如同 <head> 标签之于一个 web 页面。
<g> 将多种形状组合起来。将组合后的形状置于 <defs> 中可以让它能够被复用。
<symbol> 类似于一个组合，但是拥有一些额外的特性。通常被置于 <defs> 标签中便于复用。
<use> 获取在 <defs> 中定义的复用对象并在 SVG 中显示出来。


https://codepen.io/anthonydugois/pen/mewdyZ

https://jxnblk.github.io/paths/?d=M40%2032%20L32%2024%20L32%2010%20L16%2010%20L16%2024%20L8%2032%20Z




### waapi：Web Animation API 动画



# echarts  图表  https://echarts.apache.org/examples/zh/index.html#chart-type-pie



canvas: Canvas; // Canvas 元素
_context: CanvasRenderingContext2D; // 2D 渲染上下文对象
traceArr: Array<String>; // 跟踪绘图操作的数组
constructor(canvas: Canvas); // 构造函数，接收 Canvas 元素作为参数
fillShape(shape: Shape): void; // 填充形状
_fill(shape: Shape): void; // 内部方法，用于填充形状
strokeShape(shape: Shape): void; // 描边形状
_stroke(shape: Shape): void; // 内部方法，用于描边形状
fillStrokeShape(shape: Shape): void; // 填充并描边形状
getTrace(relaxed?: boolean, rounded?: boolean): string; // 获取绘图操作的跟踪信息
clearTrace(): void; // 清除绘图操作的跟踪信息
_trace(str: any): void; // 内部方法，用于跟踪绘图操作
reset(): void; // 重置上下文状态
getCanvas(): Canvas; // 获取关联的 Canvas 元素
clear(bounds?: IRect): void; // 清除画布内容
_applyLineCap(shape: Shape): void; // 应用线段端点样式
_applyOpacity(shape: Node): void; // 应用透明度
_applyLineJoin(shape: Shape): void; // 应用线段连接样式
setAttr(attr: string, val: any): void; // 设置属性值
arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterClockwise?: boolean): void; // 创建圆弧路径
arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void; // 创建圆弧路径（通过两个切点）
beginPath(): void; // 开始新路径
bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void; // 创建贝塞尔曲线路径
clearRect(x: number, y: number, width: number, height: number): void; // 清除矩形区域
clip(fillRule?: CanvasFillRule): void; // 剪切路径（根据当前路径）
clip(path: Path2D, fillRule?: CanvasFillRule): void; // 剪切路径（根据指定路径）
closePath(): void; // 关闭当前路径
createImageData(width: any, height: any): ImageData | undefined; // 创建新的 ImageData 对象
createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient; // 创建线性渐变对象
createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null; // 创建图案填充对象
createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient; // 创建径向渐变对象
drawImage(image: CanvasImageSource, sx: number, sy: number, sWidth?: number, sHeight?: number, dx?: number, dy?: number, dWidth?: number, dHeight?: number): void; // 绘制图像
ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void; // 创建椭圆路径
isPointInPath(x: number, y: number, path?: Path2D, fillRule?: CanvasFillRule): boolean; // 判断坐标点是否在路径内
fill(fillRule?: CanvasFillRule): void; // 填充路径
fill(path: Path2D, fillRule?: CanvasFillRule): void; // 填充指定路径
fillRect(x: number, y: number, width: number, height: number): void; // 填充矩形
strokeRect(x: number, y: number, width: number, height: number): void; // 描边矩形
fillText(text: string, x: number, y: number, maxWidth?: number) : void; // 填充文本
strokeText(text: string, x: number, y: number, maxWidth?: number) : void; // 描边文本
measureText(text: string) : TextMetrics; // 测量文本
