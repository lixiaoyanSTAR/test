1.js基本数据类型和引用类型
    基本数据类型(占据空间小，大小固定，频繁使用，存在栈中)
        undefined, null, string, boolean, number
        es6新增：symbol(创建后独一无二且不可变的数据类型)
    引用类型：（占据空间大，大小不固定，栈中储存指针，指针指向堆中存储的数据）
        Object，String，Array
2.内置对象
    数据封装类对象：Object, Array, Boolean, Number, string
    其他对象：Function, Arguments, Math, Date, RegExp, Error
3.js原型，原型链
    只要创建一个新函数，就会根据一组特定的规则为该函数创建一个prototype属性，这个属性指向函数的原型对象
    当我们访问一个对象的属性是，如果这个对象内部不存在这个属性，就会去prototype里找，这个prototype又会有自己的prototype，一直查找，就是所谓的原型链概念
4.继承
    借用构造函数继承
        function SuperType(){
            this.colors = ['red', 'blue'];
        }
        function Subtype(){
            SuperType.call(this);
        }
        const instancel = new Subtype();
        instancel.colors.push('black');
        // colors = ['red', 'blue', 'black']
        子类构造函数新增的属性，一定要放在借用构造函数之后，否则会被超类型构造函数重写
        每创建一个实例就需要重新定义属性和方法
        如果仅仅借用构造函数（方法都在构造函数中定义），因此函数复用就无从谈起，而且在超类型原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式
    组合继承
        function SuperType(name) {
            this.name = name;
            this.colors = ['red', 'blue'];
        }
        SuperType.prototype.sayName = function() {
            console.log(this.name);
        };
        function SubType(name, age){
            SuperType.call(this, name);//第二次调用SuperType()
            this.age = age;
        }
        SubType.prototype = new SuperType(); //第一次调用SuperType()
        SubType.prototype.constructor = SubType;
        SubType.prototype.sayAge = function(){
            console.log(this.age);
        };
        const instancel = new SubType('ff', 25);
        instancel.colors.push('black');
        console.log(instancel.colors);
        instancel.sayName();
        instancel.sayAge();
        组合继承最大的 问题就是无论什么情况下，都会调用两次超类型构造函数:一次是在创建子类型原型的时候，另一次是 在子类型构造函数内部。
    原型式继承
        function object(o) {
            function F(){}
            F.prototype = o;
            return new F();
        }
        var person = {
            name: "Nicholas",
            friends: ["Shelby", "Court", "Van"]
        };
        var anotherPerson = object(person);
        anotherPerson.name = "Greg";
        anotherPerson.friends.push("Rob");
        var yetAnotherPerson = object(person);
        yetAnotherPerson.name = "Linda";
        yetAnotherPerson.friends.push("Barbie");
        console.log(person.friends);   //"Shelby,Court,Van,Rob,Barbie"
        包含引用类型值的属性始终都会共享相应的值
    寄生式继承
        function object(o) {
            function F(){}
            F.prototype = o;
            return new F();
        }
        function createAnother(original) {
            var clone = object(original);
            clone.sayHi = function(){
                console.log('hi');
            };
            return clone;
        }
        var person = {
        name: "Nicholas",
        friends: ["Shelby", "Court", "Van"]
        };
        var anotherPerson = createAnother(person);
        anotherPerson.sayHi(); //"hi"    
        不能做到函数复用而降低效率
    寄生组合式继承
        function object(o) {
            function F(){}
            F.prototype = o;
            return new F();
        }
        function inheritPrototype(subType, superType){
            var prototype = object(superType.prototype);
            prototype.constructor = subType;
            subType.prototype = prototype;
        }
        function SuperType(name){
            this.name = name;
            this.colors = ["red", "blue", "green"];
        }
        SuperType.prototype.sayName = function(){
            alert(this.name);
        };
        function SubType(name, age){
            SuperType.call(this, name);
            this.age = age;
        }
        inheritPrototype(SubType, SuperType);
        SubType.prototype.sayAge = function(){
            alert(this.age);
        };
5.如何将字符串转化为数字，例如'12.3b'?
    parseFloat('12.3b')
    用法：
        parseFloat(string)
6.12000000.11转化为『12,000,000.11』
    function commfy(num){
        return num && num.toString().replace(/(\d)(?=(\d{3}+\.))/g,function($1, $2){
            return $2 + ',' 
        })
    }
    用法：
        toString(): 返回字符串
        replace(regexp/substr, replacement)：
            regexp/substr 必需 字符串或者RegExp对象
            replacement 必需 替换文本或生成替换文本的函数
7.实现数组的随机排列
    var arr = [1, 2, 3, 4, 5, 6]
    arr.sort(function(){
        return Math.random()-0.5
    })
    console.log(arr)
    用法 ：
        sort(sortby) 参数：规定排序顺序，必须是函数
8.寻找字符串中出现次数最少的，并且首次出现位置最前的字符
    const str = 'ablfdasfdarleoeorwqajhfdsafdlladaasrjhehafdalhewadadfahwesaew';
    const len = str.length;
    let hash = {},
        i = 0;
    // 找出所有的字符串，以及出现改字符串的次数，首次出现的位置
    do {
        hash[str[i]] =  hash[str[i]] || {index: i,count: 0};
        hash[str[i]].count++;
    } while(++i < len);
    const a = Object.keys(hash).map(function(key){
        return Object.assign({char: key}, hash[key]);
    }).sort(function(a, b){
        return a.count -b.count;
    }).filter(function(e, i, arr){
        return e.count === arr[0].count;
    }).sort(function(a, b){
        return a.index - b.index;
    })[0].char;
    console.log(a);  // b
9.instanceof 和typeof
    typeof:返回字符串
        undefined -> undefined
        null -> object
        boolean -> boolean
        number -> number
        string -> string
        function -> function
        任何其他对象 -> object
    instanceof：判断某个构造函数的prototype属性是否存在于另外检测对象的原型链上
10.["1", "2", "3"].map(parseInt) 答案是多少？
    [1, NaN, NaN]
    arr.map(function(currentValue, index, arr){

    }, thisValue) 
        currentValue:必须 当前元素的值
        index：可选 当前元素的索引值
        arr：可选 当前元素属于的数组对象
    parseInt(string, radix)
        string: 要被解析的字符串
        radix: 可选 表示要解析的数字的基数 （2-36）进制
11.什么是闭包   
12.js懒加载和预加载技术
13.event.preventDefault()
    取消事件的默认行为
14原型，原型链，继承，闭包，作用域
15js编码解码
    escape和unescape
        无法对ASCII字母、数字、标点 @ * _ + - . /字符进行编码
        escape('http://www.baidu.com?name=zhang@xiao@jie&order=1')
        结果："http%3A//www.baidu.com%3Fname%3Dzhang@xiao@jie%26order%3D1"
    encodeURI和decodeURI
        无法对 ! @ # $ & * () + : / ; ? +字符进行编码
        encodeURI('http://www.baidu.com?name=zhang@xiao@jie&order=1')
        结果："http://www.baidu.com?name=zhang@xiao@jie&order=1"
    encodeURIComponent和decodeURIComponent
        对URL组成不负进行个别编码，不用对于整个URL进行编码
        encodeURIComponent('http://www.baidu.com?name=zhang@xiao@jie&order=1')
        结果："http%3A%2F%2Fwww.baidu.com%3Fname%3Dzhang%40xiao%40jie%26order%3D1"
16get和post区别
                                    get                         post
    是否能收藏为书签                    能                             不能
    是否能被缓存                        能                              不能
    参数是否能被保留在浏览器中              能                              不能
    对数据长度是否有限制                有， url最长为2048                  无限制
    对数据类型的限制                    值允许ascii                     没有限制也允许二进制
    安全性                          差                              相对安全
    可见性                          数据在url中对所有人可见             数据不会显示在url中
17ajax（请求是异步的）
    const request = new XMLHttpRequest(); // 新建 XMLHttpRequest对象
    request.onreadystatechange = function() { // 状态发生变化时， 函数被回调
        if(request.readyState === 4) { // 成功完成
            // 判断响应结果：
            if(request.status === 200) {
                // 成功，通过responseText 拿到响应的文本
                return success(request.status)
            } else {
                //  失败 根据响应码判断失败原因
                return fail(request.status)
            }

        }

    }
    request.open('GET', url)
    request.send()

    open的三个参数
        method:请求类型 GET或者post
        url: 文件在服务器上的位置
        async: true(异步)或false（同步）
    send(string) 将请求发送到服务器  仅用于post请求
    onreadystatechange事件
        readyState: 
            0:请求未初始化
            1:服务器连接已建立
            2:请求已接收
            3:请求处理中
            4:请求已完成，且响应已就绪
        status
            200: 'ok'
            404:未找到页面
18项目中常见的http状态码
    200：请求成功
    204:服务器成功处理请求，但没有返回任何内容
    301:请求网页永久移动到新位置
    302:请求网页临时移动到新位置
    304：上次请求网页未修改过的，服务器返回此响应，不会返回网页内容
    400:无法找到请求的资源
    401：访问资源的权限不够
    403:没有权限访问资源
    404:需要访问的资源不存在
    405:需要访问的资源被禁止
    407:访问的资源需要代理身份验证
    414:请求的url太长
    500:服务器内部错误
19json数据结构
    实例
        数组方式
            [{
                "id" : 1 ,
                "name" : "xiaoming"
                },{
                "id" : 2 , 
                "name" : "xiaohong"
            }]
        对象方式
            {
                "status" : 0 ,          
                "msg"    : "SUCCESS",   
                "data"   :[{           
                    "id"    : 1 ,
                    "name"  : "xiaohong"
                },{
                    "id"    : 2,
                    "name"  : "xiaoming"
                }]
            }
    序列化stringify()
        const aa = {
            name: 'zhang'
        }
        const bb = JSON.stringify(aa)  // { "name": "zhang" }
    解析parse()
        JSON.parse(bb) // Object { name: "zhang"  }
20.call, apply, bind
     show.call(obj, 1, 2, 3 ...); 将show函数的this指向obj，第一个参数是指向的对象，后面的参数是传入 show函数的参数
     show.call(obj, [1, 2, 3]); 将show函数的this指向obj，第一个参数是指向的对象，第二个参数必须是个数组，只有两个参数
     show.bind(obj, 1, 2, 3)(); 将show函数的this指向obj，第一个参数是指向的对象，后面的参数和call的传参方式一样，且bind返回的是show函数的副本，需要再次调用才能执行
21.声明提前
    常规变量
        console.log(a) // undefined
        const a = 1 
    函数体
        1.  foo() // 1
            function foo(){
                console.log(1)
            }
        2.  foo() // undefined
            var foo =  function(){ // 函数表达式
                console.log(1)
            }
22.操作数组，字符串的函数
    数组：
        pop：删除并返回数组的最后一个元素
        push：向元素末尾添加一个或多个元素，并返回新的元素
        unshift：向元素添加一个或多个元素，并返回新的长度
        shif：删除数组第一个元素，并放回第一个元素的值
        join（separator）：不改变原始数组
            将数组中的所有元素转为字符串
            separator指定要使用的分隔符，如果忽略使用逗号作为分隔符
        splice：改变的是原始数组
            增： arr.splice(2, 0, 'hello') 在数组index=2处删除0个元素，插入‘hello’
            删： arr.splice(2, 2, 'hello') 在数组index=2处删除2个元素，插入‘hello’
            改: arr.splice(2, 1, 'hello') 在数组index=2处删除1个元素，替换成‘hello’
        concat：不改变原始数组，返回一个新的副本
            arr.concat(arrx)
                arrx可以是具体的值，也可以是数组对象，可以任意多个
        slice：返回一个新的数组
            arr.slice(start, end)
                start:必需，从当前下标开始
                end:可选 截取到该函数下之前的下标
        reverse: 颠倒数组的顺序 改变原来的数组
        sort:
    字符串：
        split: 把一个字符串分割成字符串数组, 不改变原来字符串
        indexOf:
            (searchvalue, fromindex)
            searchvalue:必需 要检索的字符串值
            fromindex: 可选 在字符串开始检索的位置
        replace:
        chartAt:
            （index）
            返回指定位置的字符串,index所在下标 返回字符长度为1的字符串
        subString: 用于提取字符串中介于两个指定下标之间的字符
            （start，end）
            start：开始的下标
            end：结束的下标前的 字符串
        subStr:
            （start，length）
            抽取从start下标开始的指定数目的字符
        toLowerCase: 转为小写字符
        toUpperCase: 转为大写字符
        match: 检索指定的值， 或找到一个或多个正则表达式的匹配
        search:
        toString:
        lastIndexOf:指定字符串值最后出现的位置，指定位置从后向前检索
         （searchvalue, fromindex）
            searchvalue ： 必需  规定需检索的字符串
            fromindex:可选
            var str="Hello world!"
            document.write(str.lastIndexOf("Hello") // 0
            document.write(str.lastIndexOf("world")) // 6
23.undefined和null的区别
    undefined:声明变量但没有初始化
        typeof undefined === undefined
    null:一个'没有值'的对象
        typeof null === object 
    null == undefined // true
    null === undefined // false
24.正则
25.Object.defineProperties(obj, props)
    直接在一个对象上定义新的属性或者修改现有属性
    obj：在obj这个对象上进行操作
    props:
        value: 属性相关的值
26.构造函数和普通函数的区别
    构造函数通常和new一起使用
    普通函数就直接调用
27.原型(new, prototype)，原型链(普通对象：__proto__、构造函数对象：prototype)，继承(extends)， 闭包(外层函数返回内层函数，使得可以在外部访问外层函数的作用域)
28.
    Object.key(obj)： return obj对象中所有key值的数组(key都为string)
        const a = { name: 'zhang', age: 24 }
        Object.keys(a)   //  ['name', 'age']
    Object.defineProperties(obj, props: {
        value:  ,  // 与属性相关联的值
        enumerable: ,  // 当前属性是显性还是隐性
        configurable: , // 属性描述符的类型是否能被改变并且该属性是否能从对应对象中删除
        writable:   // 当前属性相关联的值是否可以用assignment operator
    }) 在一个对象上定义新的属性或者修改原有属性
        obj:已经存在的一个对象
        props: 新定义的属性名
    Object.assign(target, ...sources)
        将两个对象的属性值合并，当有相同属性名时，...sources对象的属性值会覆盖target对象的属性值
    Object.hasOwnProperty()不在原型链上找对应的属性
    


