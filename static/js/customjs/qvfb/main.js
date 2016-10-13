$(document).ready(function() {

    $("#from_date").datepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm:ss",
        minDate: new Date('2016/06/18'),
        maxDate: '0'
    });
    $("#to_date").datepicker({
    	dateFormat: "yy-mm-dd",
        timeFormat: "HH:mm:ss",
    	minDate: new Date('2016/06/24'),
    	maxDate: '0'
    });

var fetch = function() {
    from_date=$('#from_date').val();
                //alert(from_date);
    to_date=$('#to_date').val();
    from_date = from_date + 'T00:00:00-05:00'
    to_date=to_date+'T11:59:59-05:00';
    //var from_epoch = moment(from_date).format('x'); 
    //var to_epoch = moment(to_date).format('x'); 
    //var to_epoch_adj = to_epoch + 43201000; 
    var cstFrom = new Date(from_date);
    var cstTo = new Date(to_date);
    from_epoch = cstFrom.getTime();
    to_epoch = cstTo.getTime();
    $('#table').empty();

  var dataurl = getUrl(from_epoch,to_epoch);

 var getUrl = function(from_epoch,to_epoch) {
      var dataurl = "vbf_combined?from_epoch="+from_epoch+"&to_epoch="+to_epoch; //KEEP AGAIN
      return dataurl;
  }

 var draw_tr = function(dataline){
      linedraw = "<tr><td>"+dataline
      $('#table').append(linedraw);
  }

 var onDataReceived = function(data) {
    var obj = JSON.stringify(data);
    var int_obj = JSON.parse(obj);	
    var new_obj = int_obj.results;

    errorTypes=["Tune Errors","Plant Teardown Errors","Network Resource Failure","CM_CONNECT Errors", "Infinite Retry Errors", "none"];
    sidErrorTypes=["Cisco Pump", "UDB", "Backoffice", "Network", "Aloha Network", "Arris Pump", "Capacity", "blank", "Other"];
    var timestamp=["&nbsp"];
    var tune_errors=["Tune Errors not counted as Antenna"];
    var plant_teardown_errors=["CDN Network Errors (Streaming server failures mid-stream) not counted as Antennas"];
    var network_resource_failure=["Network Errors not counted as Antennas"];
    var cm_connect=["CDN Network (CM Connect) not counted as Antennas"]; 
    var infinite_retry_errors=["VideoLostQAMOk Errors not counted as Antennas"];
    var none=["Other Noise Floor Errors"];  
    var errors=["<B>TOTAL BACKOFFICE NOISE FLOOR:</B>"];
    var sid_cisco_pump = ["Cisco"];
    var sid_udb = ["UDB"];
    var sid_backoffice = ["Backoffice"];
    var sid_network = ["Network"];
    var sid_aloha_network = ["Aloha Network"];
    var sid_arris_pump = ["Arris Pump"];
    var sid_capacity = ["Capacity"];
    var sid_blank = ["blank"];
    var sid_other = ["Other"];
    var bo_antennas_info = ["<B>Backoffice Antennnas (over 50,000 errors per event)</B>"];
    var bo_noise_floor_info = ["<B>Backoffice Noise Floor</B>"];
		
    //First build timebucket and error total array
    new_obj.forEach(function(ele, idx) {
      var formatted_date = moment(ele[0].timestamp).format("DD MMM YYYY");
      //timestamp.push(ele[0].timestamp);
      //timestamp.push(ele[0].timestamp + "Error Rate")
      timestamp.push(formatted_date + "<BR>Errors");
      timestamp.push(formatted_date + "<BR>Error Rate");
      errors.push(parseFloat(ele[0].errors));
      //errors.push(parseFloat(ele[0].errorRate)); 
      errorRate_pretty = (parseFloat(ele[0].errorRate));
      errors.push((errorRate_pretty*100).toFixed(2)+'%');
      bo_antennas_info.push("&nbsp;");//BLANK -- informational only
      bo_antennas_info.push("&nbsp;");//Ditto
      bo_noise_floor_info.push("&nbsp;")//BLANK -- information only
      bo_noise_floor_info.push("&nbsp;")//Ditto
    });

    //Next for pushing individual errors
    //errorTypes = ["tune_errors","plant_teardown_errors","network_resource_failure","cm_connect","infinite_retry_errors","none"]
    errorTypes.map( function (item) {
      new_obj.forEach(function(ele, idx) {
        var count = ele[0].breakdown.filter(function(ele, idx) {
          return ele.type == item;
        })[0];
        count = (count === undefined) ? 0 : +count.count;
        var errorRate = ele[0].breakdown.filter(function(ele, idx) {
           return ele.type == item;
        })[0];
        errorRate = (errorRate === undefined) ? 0 : +errorRate.errorRate;
          switch (item){
              case "Tune Errors":
                    tune_errors.push(count);
                    tune_errors.push((errorRate*100).toFixed(2)+'%');
                    break;
              case "Plant Teardown Errors":
                    plant_teardown_errors.push(count);
                    plant_teardown_errors.push((errorRate*100).toFixed(2)+'%');
                    break;
              case "Network Resource Failure":
                    network_resource_failure.push(count);
                    network_resource_failure.push((errorRate*100).toFixed(2)+'%');
                    break;
              case "CM_CONNECT Errors":
                    cm_connect.push(count);
                    cm_connect.push((errorRate*100).toFixed(2)+'%');
                    break;
              case "Infinite Retry Errors":
                    infinite_retry_errors.push(count);
                    infinite_retry_errors.push((errorRate*100).toFixed(2)+'%');
                    break;
              case "none":
                    none.push(count);
                    none.push((errorRate*100).toFixed(2)+'%');
                    break;      
        }
      });  
    });

    sidErrorTypes.map( function (item) {
      new_obj.forEach(function(ele, idx) {
        var count = ele[0].SIDquery.filter(function(ele, idx) {
          return ele.type == item;
        })[0];
        count = (count === undefined) ? 0 : +count.count;
          switch (item){
              case "Cisco Pump":
                    count > 50000 ? sid_cisco_pump.push(count) : sid_cisco_pump.push("0");  
                    sid_cisco_pump.push("&nbsp;");              
                    break;
              case "UDB":
                    count > 50000 ? sid_udb.push(count) : sid_udb.push("0")
                    sid_udb.push("&nbsp;");
                    break;
              case "Backoffice":
                    count > 50000 ? sid_backoffice.push(count) : sid_backoffice.push("0");
                    sid_backoffice.push("&nbsp;");
                    break;
              case "Network":
                    count > 50000 ? sid_network.push(count) : sid_network.push("0");
                    sid_network.push("&nbsp;");
                    break;
              case "Aloha Network":
                    count > 50000 ? sid_aloha_network.push(count) : sid_aloha_network.push("0");
                    sid_aloha_network.push("&nbsp;");
                    break;
              case "Arris Pump":
                    count > 50000 ? sid_arris_pump.push(count) : sid_arris_pump.push("0");
                    sid_arris_pump.push("&nbsp;");
                    break;  
              case "Capacity":
                    count > 50000 ? sid_capacity.push(count) : sid_capacity.push("0");
                    sid_capacity.push("&nbsp;");
                    break; 
              case "blank":
                    count > 50000 ? sid_blank.push(count) : sid_blank.push("0");
                    sid_blank.push("&nbsp;");
                    break;   
              case "Other":
                    count > 50000 ? sid_other.push(count) : sid_other.push("0");
                    sid_other.push("&nbsp;");
                    break;                
        }
      });  
    });

  var logdate = moment(1474718400000).format("DD MMM YYYY");
  console.log("LOGDATE IS "+logdate);

  $('#table').append("<TABLE BORDER=1>");

  placeholder = "</td><td>Target<BR>Reduction %</td><td>July<BR>Reduction</td><td>Dec 2016 Errors<BR>Target</td><td>Dec 2016<BR>Stream Attempts<BR>Target</td><td>Dec 2016<BR>Error Rate<BR>Target</td></tr>";
  blanks_ph="</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";

  timestamp_array = ["timestamp"];
  tableorder = ["tune_errors", "plant_teardown_errors", "network_resource_failure", "cm_connect","infinite_retry_errors","none","errors", "bo_antennas_info"];
  sid_tableorder = ["sid_cisco_pump", "sid_udb", "sid_backoffice", "sid_network", "sid_aloha_network", "sid_arris_pump", "sid_capacity", "sid_other", "sid_blank"]

  //Calculation tables
  bo_vod_errors_calc_tables = ["errors", "total_bo_antennas"];
  vod_and_bo_errors_calc_tables = ["total_bo_vod_errors", "total_bo_antennas"];
  vod_summary_lines = ["vod_client_errors","vod_client_percent_of_total_errors", "vod_backoffice_errors", "vod_backoffice_percent_of_errors"];

  // These arrays correspond to the cells being drawn
  var total_vod_and_bo_errors = ["<B>TOTAL VOD CLIENT + BACKOFFICE ERRORS</B>"];
  var total_bo_antennas = ["<B>TOTAL BACKOFFICE ANTENNAS</B>"]
  var total_bo_vod_errors = ["<B>TOTAL BACKOFFICE VOD ERRORS</B>"];
  var array_index_length = ((timestamp.length)-1);

  //Top level summary arrays
  var vod_client_errors = ["<B>VOD Client Errors ( ESTIMATED )</B>"];
  var vod_client_percent_of_total_errors = ["<B>VOD Client % of Total Errors</B>"];
  var vod_backoffice_errors = ["<B>VOD Backoffice Errors"];
  var vod_backoffice_percent_of_errors = ["<B>VOD Backoffice % of Total Errors"];

  //Calculate total BO antennas errors
  for (iterator=1; iterator < array_index_length; iterator += 2){
    var daily_sid_tally=0;
    $.each( sid_tableorder, function(i, l){
      daily_sid_tally = daily_sid_tally + parseInt(eval(l)[iterator]);
    });
    total_bo_antennas.push(daily_sid_tally);
    total_bo_antennas.push("&nbsp;");
  }

  //Now to calculate TOTAL VOD Backoffice Errors which is errors + total_bo_antennas
  //Calculate total BO antennas errors
  for (iterator=1; iterator < array_index_length; iterator += 2){
    var daily_bo_vod_errors_tally=0;
    $.each( bo_vod_errors_calc_tables, function(i, l){
      daily_bo_vod_errors_tally = daily_bo_vod_errors_tally + parseInt(eval(l)[iterator]);
    });
    total_bo_vod_errors.push(daily_bo_vod_errors_tally);
    total_bo_vod_errors.push("&nbsp;");
  }

  //Now to calculate TOTAL VOD Backoffice Errors which is errors + total_bo_antennas
  //Calculate total BO antennas errors
  for (iterator=1; iterator < array_index_length; iterator += 2){
    var daily_bo_and_vod_errors_tally=0;
    $.each( vod_and_bo_errors_calc_tables, function(i, l){
      daily_bo_and_vod_errors_tally = daily_bo_and_vod_errors_tally + parseInt(eval(l)[iterator]);
    });
    total_vod_and_bo_errors.push(daily_bo_and_vod_errors_tally);
    total_vod_and_bo_errors.push("&nbsp;");
  }

  //Now to calculate summary fields at the top for client errors and percent
  for (iterator=1; iterator < array_index_length; iterator += 2){
    client_errors = total_vod_and_bo_errors[iterator] - total_bo_vod_errors[iterator];
    client_percent = (client_errors/total_vod_and_bo_errors[iterator])*100;
    vod_client_errors.push(client_errors);
    vod_client_errors.push("&nbsp;");
    vod_client_percent_of_total_errors.push(client_percent.toFixed(2)+'%');
    vod_client_percent_of_total_errors.push("&nbsp;");
    vod_backoffice_errors.push(total_bo_vod_errors[iterator]);
    vod_backoffice_errors.push("&nbsp;");
    vod_bo_percent_summary = (total_bo_vod_errors[iterator]/total_vod_and_bo_errors[iterator])*100;
    vod_backoffice_percent_of_errors.push(vod_bo_percent_summary.toFixed(2)+'%');
    vod_backoffice_percent_of_errors.push("&nbsp;");
  }


  //Calculate summary 
  // Draw Summary lines at the top -- 2 
  $.each( timestamp_array, function( i, l ){
    var dataline = eval(l).join('</td><td>');
    if (l == "timestamp"){
      dataline += placeholder;
    }else{
      dataline += blanks_ph;
    }
    draw_tr(dataline);
  });

  //Calculate summary 
  // Draw Summary lines at the top -- 2 
  $.each( vod_summary_lines, function( i, l ){
    var dataline = eval(l).join('</td><td>');
    if (l == "timestamp"){
      dataline += placeholder;
    }else{
      dataline += blanks_ph;
    }
    draw_tr(dataline);
  });

  // Draw Web Service Data -- 2 
  $.each( tableorder, function( i, l ){
    var dataline = eval(l).join('</td><td>');
    if (l == "timestamp"){
      dataline += placeholder;
    }else{
      dataline += blanks_ph;
    }
    draw_tr(dataline);
  });

  // Draw SID data -- 3
  $.each( sid_tableorder, function( i, l ){
    var dataline = eval(l).join('</td><td>');
    dataline += blanks_ph;
    draw_tr(dataline);
  });

  //Draw Total BO antennas 
  dataline = total_bo_antennas.join('</td><td>');
  dataline += blanks_ph;
  draw_tr(dataline);

  //Draw Total BO VOD Errors 
  dataline = total_bo_vod_errors.join('</td><td>');
  dataline += blanks_ph;
  draw_tr(dataline);

  //Draw Total BO VOD Errors 
  dataline = total_vod_and_bo_errors.join('</td><td>');
  dataline += blanks_ph;
  draw_tr(dataline);



  $('#table').append("</TABLE>");

  //$('#fromdatetext').append(from_date);
  //$('#todatetext').append(to_date);

}



  var onError = function(xhr, status, errorThrown) {
    console.log("Received Error from AJAX: " + errorThrown);
  }

  $.ajax({
    url: dataurl,
    type: 'GET',
    dataType: 'JSON',
    crossDomain: false,
    success: onDataReceived,
    error: onError
  });
}

});
