$(document).ready(function() {
    $(function() {
        var seriesOptions = [],
            seriesCounter = 0,
            names = ['MSFT', 'AAPL', 'GOOG'];
            error_list = ['CM_CONNECT Errors','Infinite Retry Errors','Network Resource Failure','Plant Setup Errors','Plant Teardown Errors','Tune Errors','VCP Errors']                            
            error_constants = ['br','business','errors','nbr','success']
            error_counts_results= []

        /**
         * Create the chart when all data is loaded
         * @returns {undefined}
         */
        function createChart() {

            Highcharts.stockChart('container', {
                title: {
                    text: 'national'
                },
                rangeSelector: {
                    selected: 6
                },

                yAxis: {
                    labels: {
                        formatter: function() {
                            return (this.value > 0 ? ' + ' : '') + this.value + '%';
                        }
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                    }]
                },

                plotOptions: {
                    series: {
                        compare: 'percent',
                        showInNavigator: true
                    }
                },

                tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                    valueDecimals: 2,
                    split: true
                },

                series: seriesOptions
            });
        }

        $.getJSON('http://96.118.53.210:8081/vpsq-er-ws-0.0.1-SNAPSHOT/vodMetrics?scope=national&interval=day&startTime=1478667600000&endTime=1482210000000',
            function(data){
                // console.log(JSON.stringify(data))
                $.each(data,function(i,x){
                    console.log(i)
                    console.log(x)
                    console.log('national == ', x[0]['X1']['national'])                                                

                    for (var i = 0; i <= 10; i++)
                    {   
                        error_counts_results[i] = []
                    }
                    $.each(x[0]['X1']['national'], function(unix_date,data){                                
                        if  (parseFloat(unix_date)){
                            $.each(error_constants, 
                                    function(ix,error_item){  
                                        console.log(ix)
                                         console.log(data[error_item])
                                         error_counts_results[ix].push([parseInt(unix_date),data[error_item]])
                                    }
                            )
                        console.log('result == ', JSON.stringify(error_counts_results))
                        }                           
                    })
                })
                $.each(error_constants, function(i, name){
                seriesOptions[i] = {
                name: name,
                data: error_counts_results[i]
                };
        })
        console.log('seriesOptions == ', JSON.stringify(seriesOptions))
        createChart();
            })
        //[{"name":"br","data":[[1478667600000,0.059082882203051704,1478754000000,0.049829476318059514]]}
        //[{"name":"br","data":[[[1478667600000,0.059082882203051704],[1478754000000,0.049829476318059514]]]}



        // $.each(names, function(i, name) {

        //     $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',    function (data) {
        //         // console.log(name)
        //         // console.log(data)
        //         seriesOptions[i] = {
        //             name: name,
        //             data: data
        //         };
                

        //         // As we're loading the data asynchronously, we don't know what order it will arrive. So
        //         // we keep a counter and create the chart when all the data is loaded.
        //         seriesCounter += 1;

        //         if (seriesCounter === names.length) {
        //             console.log(JSON.stringify(seriesOptions))
        //             createChart();
        //         }
        //     });


        // });


    });

})
