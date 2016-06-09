$(document).ready(function() {

    var load_vbo_report_names = function() {
        $.ajax({
            url: '/vbo/get-report-names',
            type: 'POST',
            data: {},
            success: function(result) {
            	//console.log(JSON.stringify(result))
                if (result.status == 'success') {
                	console.log('dei=='+JSON.stringify(result.results[0].results))
                	var items = []
                	result.results[0].results.forEach(function(obj, i, a){
                		console.log('object', obj.report_name)
                		items.push('<li>' + obj.report_name + '</li>'	);

                	})
                	$('#report_list').append(items.join(''))
                    //create_tickets(result)
                    
                    alert('called')
                } else if (result.status == 'session timeout') {
                    alert("Session expired -- Please relogin")
                    document.location.href = "/";
                } else {
                    alert("Unable to get VBO Reports!! Contact Support");
                }
            },
            error: function() {
                alert("Call to searchproduct failed");
            }
        })

    }
    load_vbo_report_names()
})
