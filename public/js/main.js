function senddata() {
    var str = formatString($('#paragraph').val());
    var jsondata = JSON.stringify({ "data": str });
    console.log(jsondata);

    $.ajax({
        type: "POST",
        url: "/",
        data: jsondata,
        contentType: 'application/json',
        cache: false,
        beforeSend: function(xhr) {
            animateWait();
        },
        success: function(reply) {
            renderResult(reply);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            btnReady();
            alert(thrownError);
        },
    });
}

function formatString(str) {
    str = str.trim();
    str = str.replace("\t", "");
    str = str.replace(/\.$/, "");
    str = str.replace(/(\r\n|\r|\n)/g, "");
    return str;
}

function animateWait() {
    $('#submitbtn').html('Processing <i class=\"fa fa-spinner fa-pulse fa-fw\"></i>');
    $('#submitbtn').attr("disabled", true);
}

function btnReady() {
    $('#submitbtn').html('Submit');
    $('#submitbtn').attr("disabled", false);
}

function renderResult(data) {
    var json = JSON.parse(data);
    console.log(json);
    btnReady();
    $('#results-wrapper').removeAttr("hidden");
    $('#results').html('<h6 style="color:#ccc"><center>&bull;</center><h6>');
    $('#results').append('<h3>'+json.title+'</h3>');

    var today = getToday();
    var date;

    // DATE
    if (json.date == undefined) {
        json.date = today;
        date = json.date;
        date = dateProcess(json.time);
    }
    else {
        date = dateProcess(json.date);   
    }
    $('#results').append('<div class=\"col-sm-4\"><b>Date</b></div>');
    $('#results').append('<div class=\"col-sm-8\">'+date+'</div>');

    // TIME
    if (json.time != undefined) {
        var time = timeProcess(json.time);
        $('#results').append('<div class=\"col-sm-4\"><b>Time</b></div>');
        $('#results').append('<div class=\"col-sm-8\">'+time+'</div>');
    }



}

function timeProcess(time) {
    var tester = new RegExp("T[0-9][0-9]:[0-9][0-9]");
    if (tester.test(time)) {
        var timer = new RegExp("T([0-9][0-9]:[0-9][0-9])");
        var match = timer.exec(time);
        var timeAns = match[1];
        return timeAns;
    }
}

function dateProcess(date) {
    var dayOffsetDate = dayOffset(date);
    var weekOffsetDate = weekOffset(date);
    if (dayOffsetDate != date) return dayOffsetDate;
    else if (weekOffsetDate != date) return weekOffsetDate;
    else return date;
}

function dayOffset(date) {
    var offsetTest = new RegExp("OFFSET P[0-9]*D");
    if (offsetTest.test(date)) {
        var offset = /OFFSET P([0-9]*)D/g;
        var match = offset.exec(date);
        var fromNow = match;
        console.log("date from now: "+fromNow);
        var today = new Date();
        var nextX = new Date();
        nextX.setDate(today.getDate()+(+fromNow[1]));
        console.log(dayFormat(nextX));
        return dayFormat(nextX);
    }
    return date;
}

function weekOffset(date) {
    var offsetTest = new RegExp("OFFSET P[0-9]*W");
    if (offsetTest.test(date)) {
        var offset = /OFFSET P([0-9]*)W/g;
        var match = offset.exec(date);
        var fromNow = match;
        console.log("date from now: "+fromNow);
        var today = new Date();
        var nextX = new Date();
        nextX.setDate(today.getWeek()+(+fromNow[1]));
        console.log(dayFormat(nextX));
        return dayFormat(nextX);
    }
    return date;
}

function getToday() {
    var today = new Date();
    return dayFormat(today);
}

function dayFormat(day) {
    var dd = day.getDate();
    var mm = day.getMonth()+1; //January is 0!
    var yyyy = day.getFullYear();
    if(dd<10) {
        dd='0'+dd
    }
    if(mm<10) {
        mm='0'+mm
    }
    day = mm+'/'+dd+'/'+yyyy;
    return day;
}
