/// <reference types="vite/client" />

declare module '*stats.module' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*OrbitControls' 
declare module '*DragControls' 
declare module '*TransformControls' 
declare module '*RGBELoader' 
declare module '*GLTFLoader' 
declare module '*FBXLoader' 
declare module '*service' 
declare module '*qs' 
declare module '*store' 
declare module '*editor' 
declare module '*vue' 
declare module '*xuandou' 
declare module '*js-cookie' 
declare module '*vconsole' 
