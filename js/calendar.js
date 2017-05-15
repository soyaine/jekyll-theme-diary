/**
 * Created by soyaine on 2016/12/3.
 */


function eventAttach(){
    var cal = document.getElementById("calendar");
    var paperA = document.getElementById("paperBefore");

    var event = {

        openCal: function(){
            cal.style.display = "block";
            cal.style.visibility = "visible";
            paperA.style.backgroundColor = "#fc8f96";
        },

        closeCal: function(){
            cal.style.display = "none";
            cal.style.visibility = "hidden";
            paperA.style.backgroundColor = "#fff";
        }
    };

    var closeBtn = document.getElementById("closeBtn");
    var openBtn = document.getElementById("openBtn");

    closeBtn.addEventListener('click', event.closeCal, false);
    openBtn.addEventListener('click', event.openCal, false);
}

function calInit(){
    var cal = {
        today: new Date(),
        on: new Date(), //当前最后一篇文章的日期
        dateEle: document.getElementsByClassName("cal-day"),
        render : {},

        url: {
            "2016/12/4": "http://soyaine.cn",
            "2016/12/5": "http://soyaine.cn",
            "2016/12/6": "http://soyaine.cn",
            "2016/12/7": "http://soyaine.cn",
            "2016/12/8": "http://soyaine.cn"
        },

        loadCal : function(){
            var render = this.render;
            var elem = this.dateEle;
            var i = 0;
            for(var day in render){
                elem[i].setAttribute("id", day);
                if(render[day].url){
                    elem[i].innerHTML = "<a href='" + render[day].url + "'>" + render[day].date + "</a>";
                }else {
                    elem[i].innerText = render[day].date;
                }
                i++;
            }

            var y = this["on"].getFullYear();
            var m = this["on"].getMonth();

            var yEle = document.getElementById("cal-year");
            var mEle = document.getElementById("cal-month");

            yEle.children[1].innerText = y;
            var mThis = mEle.getElementsByClassName("cal-this-month");
            mThis[0].classList.remove("cal-this-month");
            mEle.children[m].classList.add("cal-this-month");
        },

        //som: (function(){
        //    var first = new Date();
        //    first = this.data[first];
        //    return new Date(first.getYear(), first.getMonth(), -first.getDay());
        //}())

        loadLink: function(){
            //var url = this.url;
            var url = urlJSON;
            for (var n in url){
                n = n.replace(/^[\s\uFEFF\xA0\n]+|[\s\uFEFF\n\xA0]+$/g, '');
                var ele = document.getElementById(n);
                if(ele){
                    ele.innerHTML = "<a href='" + url[n].url + "'>" + this.render[n].date + "</a>";
                    ele.title = url[n].excerpt;
                    //render[n]["url"] = url[n];
                }
            }
        },

        loadDate: function(first){
                // 根据任意日期，获取此月日历中第一个周一的日期
                first.setDate(1);
                var y = first.getFullYear();
                var m = first.getMonth();
                var w = first.getDay();
                if(!w) w = 7; // 针对周日的 getDay() 值为0 的处理，将0转化为7
                first = new Date(y, m, 2-w); // 以周一为第一天
                //first = new Date(y, m, 1-w); // 以周日为第一天

                // 遍历获取所有日期
                var arr = {};
                for(var i = 0; i < 42; i++){
                    var date = first.getDate();
                    var dateStr = first.toLocaleDateString();
                    arr[dateStr] = {
                        "date": date
                        //"url": null
                    };
                    first.setDate(++date);
                }
                return arr;
        },

        //loadList: function(){
        //    var list = document.getElementById("urlList");
        //    var url = {};
        //    for(var li in list.children){
        //        var date = list.children[li].innerText;
        //        url[date] = list.children[li].href;
        //    }
        //    this.url = url;
        //},

        init: function(){
            this.render = this.loadDate(this["on"]);
            this.loadCal();
            //this.loadList();
            this.loadLink();
        }
    };

    var monthNav = document.getElementById("cal-month");
    monthNav.addEventListener('click', function(event){
        var month = event.target.title;
        cal.on.setMonth(+month);
        cal.init();
    }, false);

    cal.init();
}



function init(){
    calInit();
    eventAttach();

}

init();