# 前后端swagger约定

前端目前使用这个库生成接口代码和实体类：[alibaba/pont](https://github.com/alibaba/pont)。

> 1. `@ApiModel` *注解参数*传递方式会影响前端生成出来的实体类。
> 2. 后端 `Controller` 的*类名*会被作为前端接口请求函数的前缀。
> 3. Controller中被 `@ApiOperation` 修饰的*方法名*会作为前端接口请求方法的后缀。
>
> 影响到前端接口代码生成的后端类：Controller、DTO、VO

假设后端有如下的DTO/VO和Controller

```java

@ApiModel( "张三")
class FaceDetectionDTO {
  
}

@ApiModel( description = "人脸检测VO")
class FaceDetectionVO {
// 属性不影响
}

@Api(value = "xxxx", tags = "swagger tag的name")
@RequestMapping("/face")
class FaceController {
  @ApiOperation()
  @GetMapping('/list')
  public List<xxx> getFaceList(){}

  @ApiOperation( nickname = "getFaceDetail222222222" )
  @GetMapping('/:id')
  public List<xxx> getFaceDetail(){}
}

@Api(value = "xxxx", tags = "car")
@RequestMapping("/vehicle")
class VehicleController {
  @ApiOperation()
  @GetMapping('/list')
  public List<xxx> getList(){}
}
```

生成出来的swagger.json:
```json
{
  "version": "2.0",
  "tags": [
    {
      "name": "car",
      "description": "Vehicle Controller"
    },
    {
      "name": "swagger tag的name", // 这个在swagger-ui中表现为左侧侧边栏一级菜单
      "description": "Face Controller" // 因此pont选择了用“description”作为兜底机制
    }
  ],
  "definitions": {
    "张三": { 
      // ...
    },
    "FaceDetectionVO": { 
      // ...
      "title": "人脸检测VO"
    },
  },
  "paths": {
    "/face/list": {
      "get": {},
    },
    "/face/{id}": {
      "get": {},
    },
    "/vehicle/list": {
      "get": {},
    },
  }
}
```

前端的pont工具会生成如下js代码:

```ts
// mods/face.ts
// ***********接口请求代码***********
API.applicationService.face.getFaceList

// 被`@ApiOperation( nickname = "getFaceDetail222222222" )`影响， swagger生成该接口的operationId时默认是：`[方法名]USING[HTTP METHODS]`, nickname可以改变这种默认行为
API.applicationService.face.getFaceDetail222222222 

// mods/car.ts
// 本应使用vehicle作为前缀，但是被tags影响
API.applicationService.car.getList

// ***********实体类***********

// baseClass.ts
// 被`@ApiModel( "张三")`中value = "张三"影响， pont会进行翻译
defs.applicationService.ZhangShan 
defs.applicationService.FaceDetectionVO

class ZhangShan {}
class FaceDetectionVO {}
```

对于一个接口：`API.applicationService.face.getFaceList`:

- `API`: 前端的命名空间
- `applicationService`: 后端对于的微服务名
- `face`: 【前缀】对于的是Controller的*类名*，在前端的pont工具中：`FaceController`会被去掉后缀 `Controller`然后转成小驼峰命名。
- `getFaceList`: 【后缀】具体的接口，swagger规范要求每个接口都有一个operationId, java的swagger注解会根据方法名和@GetMapping\@PostMapping... 来生成一个operationId：`[方法名]USING[HTTP METHODS]`, 在前端的pont工具中：会去掉USING以及后面的字符，将方法名进行小驼峰转换，然后判断是否重复后。

## 前端遇到的问题

1. 对于@ApiModel生成基类，允许翻译的字符是由要求的，一旦不符合，前端就没法使用工具去生成接口代码了，因为整个工具都会挂掉。
2. 翻译引擎的网络连接稳定性不可预测，网络不通也会down掉部分功能，导致没法更新最新代码。
3. 对于controller和具体的api接口方法名的改动，会导致前端已经对接好的接口报错，严重的情况下会导致组件渲染不出来，页面卡死

## 结论

最减少迁移成本和沟通成本的做法就是：

1. `@ApiModel`使用方式 `@ApiModel( description = "中文说明" )`
2. 后端Controller命名和被 `@ApiOperation`修饰的方法名尽量不要改动，改用给接口打@deprecated注解的方式废弃掉接口，然后让这个接口返回403，或302/308等状态码，并且告知前端将这个接口改成新的接口。

注意： 已经使用老写法的项目不要按上述方法改动，原来的接口保持原样，新增的接口尽量按照这样来。

## 【前端相关】前端遇到的其他问题

1. 后端新增微服务，前端需要对于新增数据源的时候，无法直接添加

原因是pont的bug，我提了这个issue：[同时启用&#34;usingMultipleOrigins&#34;: true和&#34;spiltApiLock&#34;: true - 新增数据源时会报文件不存在的异常](https://github.com/alibaba/pont/issues/338)。

【update】： 数据源的name要和生成的模块文件夹命名和api-lock.json中的name保持一致

如果是不方便改成 `spiltApiLock: false`的项目，需要手动在 `src/api/generated`下，新增对于数据源的文件夹，然后在这个文件夹中新增文件：`api-lock.json`， 添加内容如下：

```json
// src/api/generated/newDataSource/api-lock.json
{
  "mods": [],
  "name": "数据源",
  "baseClasses": []
}
```

然后，在 `pont-config.json`中正常新增数据源配置即可


2. TypeError: Cannot read properties of undefined (reading 'request')
   按照上面的方法2可以避免
