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
    str = str.replace(/(\r\n|\r|\n)/g, "");
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
