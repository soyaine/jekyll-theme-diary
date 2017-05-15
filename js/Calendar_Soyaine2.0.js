/**
 * Created by Soyaine .
 */

/**
 * @summary 当前日期
 * @desc 用于记录当前日历状态的Date对象，随用户的操作而不断更新
 * @type {Date}
 */
var currentDate = new Date();

/**
 * @summary 今日日期
 * @desc 用于记录今日信息的Date对象，创建后不改变，供“回到今天”使用
 * @type {Date}
 */
var today = new Date();
var thisMonth = today.getMonth();
var thisYear = today.getFullYear();
//newCalendar(thisYear, thisMonth);

/**
 * @summary 今日日期
 * @desc 在操作日期发生改变时，记录上一次操作后的日期，与currentDate相差一次操作，供日期切换使用
 * @type {Date}
 */
var datedDate;//


//初始生成日历
newCalendar();

/**
 *
 * “上一年”切换按钮监听
 */
var btnLastYear = document.getElementById("lastYear");
btnLastYear.addEventListener("click", function() {
    var currentYear = currentDate.getFullYear();
    currentDate.setYear( --currentYear );
    newCalendar();
}, false);

/**
 *
 * “下一年”切换按钮监听
 */
var btnNextYear = document.getElementById("nextYear");
btnNextYear.addEventListener("click", function() {
    var currentYear = currentDate.getFullYear();
    currentDate.setYear( ++currentYear );
    newCalendar();
}, false);

/**
 *
 * “上个月”切换按钮监听
 */
var btnLastMonth = document.getElementById("lastMonth");
btnLastMonth.addEventListener("click", function() {
    var currentMonth = currentDate.getMonth();
    currentDate.setMonth( --currentMonth );
    newCalendar();
}, false);

/**
 *
 * “下个月”切换按钮监听
 */
var btnNextMonth = document.getElementById("nextMonth");
btnNextMonth.addEventListener("click", function() {
    var currentMonth = currentDate.getMonth();
    currentDate.setMonth( ++currentMonth);
    newCalendar();
}, false);

/**
 *
 * “回到今天”切换按钮监听
 */
var btnBackToday = document.getElementById("backToday");
btnBackToday.addEventListener("click", function() {
    var nowTime = today.getTime();
    currentDate.setTime(nowTime);
    newCalendar();
}, false);

var dateNav = document.getElementsByClassName("date");


/**
 * @summary 根据指定 年-月（格式：YYYY-MM）生成当月日历
 * @desc 主体部分。
 * 利用Date的构造函数调用参数，
 * 当数值大于合理范围时，会被调整为相邻值，以此获取此月日历中第一行第一列的日期。
 * 若指定月份的1号是周日，表明日历不含上月的日期，无需特殊处理；
 * 若指定月份的1号不是周日，则取相反数（原理： 1 - 周几 + 1），获取所需日期。
 * 注：此处为方便生成表格使用(++date)，日期计数取为从0开始，即1号由0表示，与Date.prototype.getDate()所得相差1。
 * 灵感来源：{@link http://jszen.blogspot.com/2007_07_01_archive.html}
 * @param {number} year - 预生成日历的年份
 * @param {number} month - 预生成日历的月份
 * @returns {date} currentDate - 当前日期（仅年份、月份发生改变）
 *
 */
function newCalendar() {
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var date = currentDate.getDate();
    var thisMonthDay = new Date(year, month, 1);
    var thisMonthFirstDay = thisMonthDay.getDay();
    var thisMonthFirstDate = new Date(year, month, - thisMonthFirstDay);
    generateTable(thisMonthFirstDate);  //生成日历主体的日期区域
    generateNav(year, month);  //生成导航区域
    generateToday();  //生成今日信息区域
    currentDate.setYear(year);
    currentDate.setMonth(month);
    return currentDate;
}

/**
 * @summary 设定导航区域
 * @desc 利用年、月设定相关值
 * @param {number} year - 预生成日历的年份
 * @param {number} month - 预生成日历的月份
 * @todo 加入实时变化的时间
 *
 */
function generateNav(year, month) {
    var navYear = document.getElementById("year");
    var navMonth = document.getElementById("month");
    navYear.innerText = year.toString();
    navMonth.innerText = (month + 1).toString();
}

/**
 * @summary 根据日历首位日期，生成日历主体表格
 * @desc 首位日期指：日历的表格中第一行第一列位置的日期。
 * 利用Date的相关特性处理跨月份的情况，循环后
 * 生成 6*7 表格，加入DOM树，形成日历的主体日期区域。
 * @param {date} firstDate - 日历表格中第一行、第一列的日期数（从0开始）
 */
function generateTable(firstDate) {
    //获取日历日期部分Node
    //var dateTable = document.getElementById("dateTable");
    var dateTable = document.getElementsByClassName("cal-body cal-day");
    //若不是第一次生成，则需要把此前生成的日历去掉
    while (dateTable.firstChild) {
        dateTable.removeChild(dateTable.firstChild);
    }
    var date = firstDate.getDate();
    for (var i = 0; i < 6; i++){
        var newRow = document.createElement("ul");
        for(var j = 0; j < 7; j++){
            var newDate = document.createElement("li");
            //获取日期信息
            firstDate.setDate(++date);
            date = firstDate.getDate();
            newDate.innerText = date;
            //设置Node的id，便于后期操作
            var dateInfo = firstDate.toLocaleDateString();
            newDate.setAttribute("id",dateInfo);
            newDate.setAttribute("class", "date");
            //设置点击事件，防止被解释为数字，用转义字符加上双引号
            //newDate.setAttribute("onclick", "generateToday(\"" + dateInfo+ "\")");
            newRow.appendChild(newDate);
        }
        dateTable.appendChild(newRow);
    }
}

/**
 *
 * @summary 根据具体日期，生成/切换今日详细信息
 * @desc 在进行日期切换时，点击某个日期或“回到今天”，根据生成日历时设置的id，修改今日信息区域，相关信息随之改变
 * @param {string} dateString - 表示日期的字符串，格式 YYYY/MM/DD
 * @todo 获取星座、宜&忌、农历天干地支等信息
 */
function generateToday(dateString) {
    if(dateString){ //若传递了参数，根据参数设定值
        var info = dateString.split("/");
        currentDate.setYear(info[0]); //坑：切换日期跨月时很容易出错
        if( currentDate.getDate() > 30) {
            currentDate.setDate(info[2]);
            currentDate.setMonth(parseInt(info[1])-1 );
        }else {
            currentDate.setMonth(parseInt(info[1])-1 );
            currentDate.setDate(info[2]);
        }
    }
    if( datedDate == null){
        //第一次生成
        datedDate = new Date();
    }else{
        //获取前一次操作时涉及的元素，清除样式
        var datedDateString = datedDate.toLocaleDateString();
        document.getElementById(datedDateString).setAttribute("class","date");
    }
    var dateInfo = currentDate.toLocaleDateString(); //获取YYYY/MM/DD格式的日期
    var dayNum = currentDate.getDate(); //获取日期号数
    var weekInfo = currentDate.getDay();
    var weekArray = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    document.getElementById("dateInfo").innerText = dateInfo; //DOM操作日期
    document.getElementById("dateNum").innerText = dayNum.toString(); //DOM操作号数
    document.getElementById("weekInfo").innerText = weekArray[weekInfo];
    var dateTd = document.getElementById(dateInfo);
    dateTd.setAttribute("class","todayTd"); //设定新的CSS样式
    // 记录此次操作的日期
    datedDate.setYear(currentDate.getFullYear()); //坑：这里的顺序不能颠倒，否则切换月的时候会错
    datedDate.setMonth(currentDate.getMonth());
    datedDate.setDate(currentDate.getDate());
}