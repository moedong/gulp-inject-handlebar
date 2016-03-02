$(document).ready(function() {
  //模拟的json对象
  var data = {
              "student": [
                  {
                      "name": "张三",
                      "sex": "0",
                      "age": 18,
                      "homePage":"<a href='javascript:void(0);'>张三的个人主页</a>"
                  },
                  {
                      "name": "李四",
                      "sex": "0",
                      "age": 22,
                      "homePage":"<a href='javascript:void(0);'>李四的个人主页</a>"
                  },
                  {
                      "name": "妞妞",
                      "sex": "1",
                      "age": 19,
                      "homePage":"<a href='javascript:void(0);'>妞妞的个人主页</a>"
                  }
              ]
          };
  
  //注册一个Handlebars模版，通过id找到某一个模版，获取模版的html框架
  //$("#table-template").html()是jquery的语法，不懂的童鞋请恶补。。。
  var myTemplate = Handlebars.compile($("#table-template").html());
  
  //注册一个比较数字大小的Helper,有options参数，块级Helper
  Handlebars.registerHelper("compare",function(v1,v2,options){
    //判断v1是否比v2大
    if(v1>v2){
      //继续执行
      return options.fn(this);
    }else{
      //执行else部分
      return options.inverse(this);
    }
  });
  
  //将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
  $('#tableList').html(myTemplate(data));
});