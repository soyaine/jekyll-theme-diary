/**
 * Created by soyaine on 2016/12/3.
 * Last update: 2019/08/08
 */


function eventAttach() {
    var cal = document.getElementById("calendar");
    var paperA = document.getElementById("paperBefore");

    var event = {

        openCal: function(){
            cal.style.display = "block";
            paperA.style.backgroundColor = "#fc8f96";
        },

        closeCal: function(){
            cal.style.display = "none";
            paperA.style.backgroundColor = "#fff";
        }
    };

    var closeBtn = document.getElementById("closeBtn");
    var openBtn = document.getElementById("openBtn");

    closeBtn.addEventListener('click', event.closeCal, false);
    openBtn.addEventListener('click', event.openCal, false);
}

function calInit() {
    var cal = {
        today: new Date(),
        on: new Date(activeArticle), // The page's date
        dateEle: document.getElementsByClassName("cal-day"),
        render : {},

        url: {},

        loadCal : function() {
            var render = this.render;
            var elem = this.dateEle;
            var i = 0;

            var y = this["on"].getFullYear();
            var m = this["on"].getMonth();

            var yEle = document.getElementById("calYear");
            var mEle = document.getElementById("calMonth");

            for(var day in render){
                elem[i].setAttribute("id", day);
                var month = new Date(day).getMonth();

                if(render[day].url){
                    elem[i].innerHTML = "<a href='" + render[day].url + "'>" + render[day].date + "</a>";
                }else {
                    elem[i].innerText = render[day].date;
                }

                if (day === this.today.toLocaleDateString()) {
                    elem[i].classList.add("now");
                }

                if (month !== m) {
                    elem[i].classList.add("outmonth");
                }

                i++;
            }

            yEle.children[1].innerText = y;
            var mThis = mEle.getElementsByClassName("cal-month__now");
            mThis[0].classList.remove("cal-month__now");
            mEle.children[m].classList.add("cal-month__now");
        },

        //som: (function(){
        //    var first = new Date();
        //    first = this.data[first];
        //    return new Date(first.getYear(), first.getMonth(), -first.getDay());
        //}())

        loadLink: function() {
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

        loadDate: function(first) {
                // 根据任意日期，获取此月日历中第一个周一的日期
                first.setDate(1);
                var y = first.getFullYear();
                var m = first.getMonth();
                var w = first.getDay();
                if(!w) w = 7; // 针对周日的 getDay() 值为0 的处理，将0转化为7
                // first = new Date(y, m, 2-w); // 以周一为第一天
                first = new Date(y, m, 1-w); // 以周日为第一天

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

        loadPageIndex: function() {
            if (activeArticle && urlJSON[activeArticle]) {
                var indexEle = document.getElementById("postIndex");
                indexEle.innerText = urlJSON[activeArticle]['index'];
            }
        },

        init: function() {
            this.render = this.loadDate(this["on"]);
            this.loadPageIndex();
            this.loadCal();
            this.loadLink();
        }
    };

    var removeActiveNow = function() {
        var onEles = document.getElementsByClassName("cal-day now");
        
        if (onEles.length) {
            onEles[0].classList.remove("now");
        }
    };

    var swtich = function(y, m) {
        removeActiveNow();
        cal.on.setFullYear(y);
        cal.on.setMonth(m);
        cal.init();
    };

    var monthNav = document.getElementById("calMonth");
    monthNav.addEventListener('click', function(event) {
        var month = event.target.title;
        swtich(cal.on.getFullYear(), +month);
    }, false);

    var lastYearBtn = document.getElementById("lastYearBtn");
    var nextYearBtn = document.getElementById("nextYearBtn");

    lastYearBtn.addEventListener('click', function() {
        swtich(cal.on.getFullYear() - 1, 11)
    }, false);
    nextYearBtn.addEventListener('click', function() {
        swtich(cal.on.getFullYear() + 1, 0)
    }, false);

    cal.init();
}



function init() {
    calInit();
    eventAttach();
}

init();
