### ParaUI

> 基于Material-UI 二次封装新增的UI组件库

## Version 4.11.39
1.穿梭框增加禁止操作的项配置

## Version 4.11.36
1.调整穿梭框的样式

## Version 4.11.24
1.修复穿梭框的bug

## Version 4.11.23
1.rangeDatePicker 封装

## Version 4.11.17

1. 修复eicTable组件的搜索框在ie浏览器下面样式错乱问题
2. 修复eic表格get请求中文入参乱码问题

## Version 4.11.16

1. 树组件增加tooltips

## Version 4.11.14

1. EIC表格组件增加自定义placeholder

## Version 4.11.12

1. 修复裁切清除函数

## Version 4.11.11

1. 修复表格样式对外影响样式错乱

## Version 4.11.9

1. 迁移eic-console 的表格组件


## Version 4.11.8

1. 增加Empty组件

## Version 4.11.7

1. 增加搜索条

## Version 4.11.4

1. 新增富文本框自定义图片功能

## Version 4.11.3

1. 去掉搜索条的前后的空格

## Version 4.11.2

1. 修复ParaCropper组件的传值问题
2. 新增了ParaCropper的disabled属性

## Version 4.11.1

1. 修复searchBar的直接点击enter的时候提交数据的bug

## Version 4.10.98

1. 去除jss样式表

## Version 4.10.97

1. 城市选择器 数据剥离

## Version 4.10.93-95

1. 修复样式框的样式适配问题

## Version 4.10.94

1. 修复多值框返回值的延迟的问题

## Version 4.10.90

1. 部分重构ParaTransfer的代码
2. 修复ParaTransfer的单击和双击事件问题


## Version 4.10.88

1. 新增ParaHelp组件，Popover组件，Tooltip组件
2. 剥离样式分块加载和导入
3. Mobx重写UI Example的项目架构
4. 注入全局的Context Provider,useContext

## Version 4.9.88

1. 树增加对403无权限的功能

## Version 4.9.79-80

1. 新增样式兼容性前缀

## Version 4.9.75

1. 新增了级联的选择的回调requestCallback

## Version 4.9.74

1. 新增了穿梭框的拖拽支持
2. 修复一些问题

## Version 4.9.71

1. 新增ParaCascade组件
2. 新增ParaAreaLinkage组件

## Version 4.9.64

1. 新增ParaTransfer组件

## Version 4.9.63

1. 修复bug

## Version 4.9.60

1. 新增ParaAreaLinkage组件
2. 修复bug

## Version 4.9.58 - 59

1. 修复bug

## Version 4.9.55

1. 更改默认主题

## Version 4.9.54

1. 富文本编辑器新增maxLength控制字数

## Version 4.9.49-53

1. 修复bug

## Version 4.9.48

1. 修复treeSelect两次选择同节点的错误

## Version 4.9.47

1. 修复重复点击的问题

## Version 4.9.46

1. 新增treeSelect单选选择之后关闭
2. 修复部分bug

## Version 4.9.45

1. 修复部分bug

## Version 4.9.44

1. 修复多只框的返回值同步的问题
2. 修复部分bug

## Version 4.9.43

1. 添加树的loading界面，新增ParaLoading组件
2. 修复树分页的bug
3. 单选框和多选框做出区分

## Version 4.9.43

1.  添加tree的root根节点，ID为-1的定制节点

## Version 4.9.42

1.  修复tree的请求搜索置空的情况

## Version 4.9.30 - 4.9.41

1.  修复若干bug,默认参数和默认值的设置,treeSelect的入参出参的配置
2.  样式的修复和treeSelect的样式重写

## Version 4.9.29

1.  修复优化bug(TreeSelect,SearchBar)

## Version 4.9.26

1.  新增CheckBoxTree组件

## Version 4.9.25

1.  增加paraTreeSelect的请求返回参数的容错
2.  调整paraTreeSelect显示文字的大小

## Version 4.9.23

1.  修复paraTreeSelect当搜索文本为空时请求不拼接搜索字段
2.  修复paraTreeSelect调用Tree组件参数缺少的问题

## Version 4.9.22

1.  新增EIC的联级选择器

## Version 4.9.21

1.  RequestTree新增了搜索功能

## Version 4.9.20

1.  新增ParaGuide轮播组件

## Version 4.9.19

1.  新增ParaSkeleton骨架屏组件
2.  解决Modal弹窗无法无限嵌套的问题

## Version 4.9.17 - 18

1.  修复一些bug

## Version 4.9.16

1.  新增Modal，Notice,Message组件

## Version 4.9.15

1.  新增Tree懒加载的时候默认展开指定的节点
2.  修复Shadow组件的onChange更改value的问题及边界预处理
3.  修复ParaShadow的ID冲突的问题
4.  增加paraTreeSelect组件

## Version 4.9.14

1.  新增ParaColor组件
2.  修复树isLeaf节点显示图标乱码问题
3.  修复ParaShadow的ID冲突的问题

## Version 4.9.13

1.  修复样式布局bug

## Version 4.9.12

1.  修复多值框出传入空数组的时候的问题
2.  增加组件的国际化（shadow）
3.  导入全局的Provider,避免全局污染

## Version 4.9.11

1.  修复多值框动态更改defaultColumns的时候页面不变化的情况
2.  修复Tree的加载同级更多的bug

## Version 4.9.10

1.  新增Shadow组件,动态更新box-shadow属性
2.  修复Tree组件的样式交互问题，分页懒加载数据问题的bug，新增部分接口和参数
3.  修复Avatar组件上传图片裁切的同一张图片不会change的bug,新增弹窗关闭的对外参数接口
4.  修复多只框的错误提示换行样式遮盖问题，新增错误文本提示，固定栏目渲染，错误外框提示及禁用属性
