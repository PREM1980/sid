// multiple axis http://jsfiddle.net/5eem7a2a/1/

// br,nbr,business,errors ,success
// yeah br is a rate
// hence the r component of "br"
// business is the raw count
// that creates is the numerator of br
// business, success, errors are all raw coungs
// business = BR error counts, Errors = NBR error counts # Don
// br/nbr = error rates
$(document).ready(function() {
    $(function() {
        var seriesOptions = [],
            seriesCounter = 0,
            names = ['MSFT', 'AAPL', 'GOOG'];
            error_list = ['CM_CONNECT Errors','Infinite Retry Errors','Network Resource Failure','Plant Setup Errors','Plant Teardown Errors','Tune Errors','VCP Errors']                            
            error_constants = ['br','business','errors','nbr','success']
            error_counts_results= []

        
        function createChart_National(chart, params) {
            console.log(JSON.stringify(params))
            Highcharts.stockChart(chart, {
                title: {
                    text: params.title
                },
                rangeSelector: {
                    selected: 0
                },

                yAxis: [{
                    labels: {
                        // formatter: function() {
                        //     return (this.value > 0 ? ' + ' : '');
                        // }
                        format: '{value}'
                    },
                    title:{
                        text: "Session's",
                        style: {
                        color: Highcharts.getOptions().colors[5]
                    }
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }],
                    opposite: false

                },
                {
                    labels: {
                        formatter:                                 
                                function() {
                                    if (params.y2axis == 'pct'){
                                        return (this.value > 0 ? ' + ' : '') + this.value + '%'
                                    }
                                    else{
                                        return this.value ;
                                    }
                                
                                }

                    },
                    title:{
                        text: 'BR / NBR Rates',
                        style: {
                        color: Highcharts.getOptions().colors[5]
                    }
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }]
                }],
                legend:{
                    enabled: true
                },
                // plotOptions:{
                //      showInLegend: true
                // },
                // plotOptions: {
                //     series: {
                //         compare: 'percent',
                //         showInNavigator: true
                //     }
                // },

                // tooltip: {
                //     pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                //     valueDecimals: 2,
                //     split: true
                // },
                series: 
                [
                {
                name: 'BR',
                data: seriesOptions[0]['data'],
                yAxis: 1
                },
                {
                name: 'NBR',
                data: seriesOptions[1]['data'],
                yAxis: 1
                },
                {
                name: 'Session',
                // type: 'column',
                data: seriesOptions[2]['data'],
                yAxis: 0
                },

                ]
            });
        }    
        // business = BR error counts, Errors = NBR error counts
        // http://jsfiddle.net/5eem7a2a/1/

        var load_graphs = function(region){
            d = new Date()
            starttime = d.setMonth(d.getMonth()-6)
            endtime = (new Date).getTime()
            console.log('starttime == ', starttime)
            console.log('endtime == ', endtime)
            $.ajax({type:'GET',
                url:'http://96.118.53.210:8081/vpsq-er-ws-0.0.1-SNAPSHOT/vodMetrics?scope='+region+'&interval=day&startTime='+starttime+'&endTime='+ endtime,                        
                success: function(data){
                    console.log('i')
                    console.log(JSON.stringify(data))
                    $.each(data,function(i,x){                    
                        // console.log('national == ', x[0]['X1']['national'])                                                

                        for (var i = 0; i <= 10; i++)
                        {   
                            error_counts_results[i] = []
                        }
                        $.each(x[0]['X1']['national'], function(unix_date,data){                                
                            if  (parseFloat(unix_date)){
                                $.each(error_constants, 
                                    function(ix,error_item){  
                                        // console.log(ix)
                                        // console.log(data[error_item])
                                        error_counts_results[ix].push([parseInt(unix_date),data[error_item]])
                                    }
                                )
                            // console.log('result == ', JSON.stringify(error_counts_results))
                            }                           
                        })
                    })
                    // $.each(error_constants, function(i, name){
                    //     seriesOptions[i] = {
                    //     name: name,
                    //     data: error_counts_results[i]
                    //     };
                    // })
                    seriesOptions[0] = {
                        name: error_constants[0],
                        data: error_counts_results[0]
                    };

                    seriesOptions[1] = {
                        name: error_constants[3],
                        data: error_counts_results[3]
                    };

                    seriesOptions[2] = {
                        name: error_constants[4],
                        data: error_counts_results[4]
                    };
                    params = {
                        'title':'National - Session Rates vs BR/NBR Rates'
                        ,'y2axis':'pct'
                    }                                 
                    createChart_National('container-natl-rates',params);
                    seriesOptions[0] = {
                        name: error_constants[0],
                        data: error_counts_results[0]
                    };
                    
                    seriesOptions[1] = {
                        name: name,
                        data: error_counts_results[1]
                    };

                    seriesOptions[2] = {
                        name: name,
                        data: error_counts_results[2]
                    };
                    params = {
                        'title':'National - Session Counts vs BR/NBR Counts'
                        ,'y2axis':'cnt'
                    }                                 
                    createChart_National('container-natl-counts',params);
                    
                },                
            })
        }
        load_graphs('national')


    });

})
