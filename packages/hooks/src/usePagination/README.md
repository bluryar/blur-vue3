# useUmPagination

- 参考了 `ahooks`的 [usePagination](https://ahooks.js.org/zh-CN/hooks/use-pagination#usepagination) 的API设计, 但是会根据Vue的特点以及Pont生成的产物进行调整
- 基于`vue-request`的`useRequest`( API和ahooks非常相似 )来实现, 该库虽然自带 `usePagination`方法, 但实际使用下来发现并不好用, 因此自定义
