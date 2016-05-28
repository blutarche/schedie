function senddata() { 
    var str = formatString($('#paragraph').val());
    var jsondata = JSON.stringify({ "data": str });
    console.log(jsondata);
    $.ajax({
        type: "POST",
        url: "test.php",
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
    // json = JSON.parse(json);
    btnReady();
    $('#results-wrapper').removeAttr("hidden");
    $('#results').html(data);
    // $('#results').html('<tr><th>String</th><th>Document\'s name</th></tr>');
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