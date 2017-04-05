$(document).ready(function() {

    var load_cemp_counts = function() {

        d = new Date()
        starttime = d.setMonth(d.getMonth() - 6)
        starttime = d.setDate(d.getDate() - 6)
        endtime = (new Date).getTime()

        var deferred = $.Deferred()

        $.ajax({
            type: 'GET',
            url: 'https://vpsq.cable.comcast.com/metrics/vodTotalSessions?startTime=1474656942773&endTime=1490813742773',
            success: function(data) {
                console.log('api call == ', data[0])
                cemp_data = data[0]

                deferred.resolve()
                
            }
        })
        return deferred.promise()
    }

    var load_splunk_counts = function() {
        // alert('load splunk')
        var deferred = $.Deferred()

        $.ajax({
            type: 'GET',
            url: '/vbo/get-session-counts',
            success: function(data) {
                console.log('splunk call == ', JSON.stringify(data.results[0].get_session_count))
                splunk_data = data.results[0].get_session_count
                // $.each(splunk_data, function(x,y){
                // 	console.log(x)
                // 	console.log(y)
                // })
                deferred.resolve()
                
            }
        })
        return deferred.promise()
    }
    
    var generate_html = function(){
    	var deferred = $.Deferred()
    	cemp_successes = []	
    	splunk_successes = []
    	dates = []
    	dates_raw = []
    	$.each(cemp_data,function(cemp_dt,cemp_count){                    
    		// console.log('i ==',cemp_dt)    		
    		$.each(splunk_data,function(x,y){
    			// console.log("dates equal dt ", y.dt)
    			if (cemp_dt == moment(y.dt).unix() * 1000){
    				console.log("dates equal", y.total_successes)

    				// results.push([cemp_dt, y.total_successes])
    				splunk_successes.push(y.total_successes)
    				cemp_successes.push(cemp_count)
    				// dates.push(moment.unix(y.dt).format('YYYY-MM-DD'))
    				dates.push(new Date(y.dt).getFullYear() + '/'+ (parseInt(new Date(y.dt).getMonth()) + 1) + '/'+ new Date(y.dt).getDate())
    				dates_raw.push(moment.unix(y.dt))

    			}
    		})
    	})

    	deferred.resolve()
    	return deferred.promise()
    	

    }

    var generate_graphs = function(){
    	console.log('splunk == ', JSON.stringify(splunk_successes))
    	console.log('cemp == ',JSON.stringify(cemp_successes))
    	console.log('dates == ',JSON.stringify(dates))
    	// console.log('dates_raw == ',JSON.stringify(dates_raw))
    	Highcharts.chart('cemp-splunk-counts', {

    title: {
        text: 'CEMP Vs Splunk Counts'
    },

    subtitle: {
        text: 'Source: thesolarfoundation.com'
    },

    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },
    xAxis: {
        categories: dates,
        type: 'date',
        grouping: false
        // tickInterval: 24 * 3600 * 1000
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        // series: {
        //     pointStart: dates
        // }
    },

    series: [{
        name: 'Splunk Counts',
        data: splunk_successes,
        dataGrouping: {
        enabled: false
    }
    }, {
        name: 'Cemp Counts',
        data: cemp_successes,
        dataGrouping: {
        enabled: false
    }
    }, 

    ]

});

    }

    load_cemp_counts().then(
        function() {
            load_splunk_counts().then(
                function() {                	
                    generate_html().then(function(){
                    	generate_graphs()
                    })                    
                }
            )
        }
    )


})
