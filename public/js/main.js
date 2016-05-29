function senddata() {
    var str = formatString($('#paragraph').val());
    var jsondata = JSON.stringify({ "data": str });
    console.log(jsondata);

    var jsonresult = {
        "title": "Meeting with Potchara",
        "date": "2016/05/32",
        "time": "6:00 PM"
    };

    renderResult(JSON.stringify(jsonresult));

    // $.ajax({
    //     type: "POST",
    //     url: "/",
    //     data: jsondata,
    //     contentType: 'application/json',
    //     cache: false,
    //     beforeSend: function(xhr) {
    //         animateWait();
    //     },
    //     success: function(reply) {
    //         renderResult(reply);
    //     },
    //     error: function(xhr, ajaxOptions, thrownError) {
    //         btnReady();
    //         alert(thrownError);
    //     },
    // });
}

function formatString(str) {
    str = str.trim();
    str = str.replace("\t", "");
    str = str.replace(/(\r\n|\r|\n)/g, "");
    // var strings = str.match(/((Jr\.|Mr\.|Ms\.|Mrs\.|Dr\.|(\.\w+)+|\.\w\.|[0-9]*\.[0-9]+)*[^.!?]+?)+[.!?]+/gmi );
    // if (strings != null) {
    //     str = strings.join("\n");
    // }
    // str = str.replace(/\[.!?]$/, "");
    return str;
}

function animateWait() {
    $('#submitbtn').html('Searching <i class=\"fa fa-spinner fa-pulse fa-fw\"></i>');
    $('#submitbtn').attr("disabled", true);
}

function btnReady() {
    $('#submitbtn').html('Submit');
    $('#submitbtn').attr("disabled", false);
}

function renderResult(data) {
    var json = JSON.parse(data);
    btnReady();
    $('#results-wrapper').removeAttr("hidden");
    $('#results').html('<h6 style="color:#ccc"><center>&bull;</center><h6>');
    $('#results').append('<h3>'+json.title+'</h3>');

    // TITLE
    // if (json.title != undefined) {
    //     $('#results').append('<div class=\"col-sm-4\"><b>Title</b></div>');
    //     $('#results').append('<div class=\"col-sm-8\">'+json.title+'</div>');
    // }
    var today = getToday();

    // DATE
    if (json.date == undefined) {
        json.date = today;
    }
    $('#results').append('<div class=\"col-sm-4\"><b>Date</b></div>');
    $('#results').append('<div class=\"col-sm-8\">'+json.date+'</div>');

    // TIME
    if (json.time != undefined) {
        $('#results').append('<div class=\"col-sm-4\"><b>Time</b></div>');
        $('#results').append('<div class=\"col-sm-8\">'+json.time+'</div>');
    }
    // for (var i in json.results) {
    //     var result = json.results[i];
    //     var divText =
    //         "<td class=\"col-sm-7\">"+result.line+"</td>";
    //     var name = result.name+"";
    //     var divName =
    //         "<td class=\"col-sm-5\">"+
    //         "<a href=\"https://www.google.co.th/search?q="+
    //         encodeURI(name)+
    //         "\" target=\"_blank\">"+
    //         name+
    //         "</a>"+
    //         "</td>";
    //     $('#results').append("<tr>"+divText+"\n"+divName+"</tr>");
    // }

}

function getToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 
    today = mm+'/'+dd+'/'+yyyy;
    return today;
}