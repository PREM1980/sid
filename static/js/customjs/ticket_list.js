 $(document).ready(function() {
             //set up some minimal options for the feedback_me plugin
             fm_options = {
                 //jQueryUI:true,
                 bootstrip: true,
                 show_email: true,
                 email_required: true,
                 position: "right-top",
                 show_radio_button_list: true,
                 radio_button_list_required: true,
                 radio_button_list_title: "How do you rate this application?",
                 name_placeholder: "Name please",
                 email_placeholder: "Email goes here",
                 message_placeholder: "Go ahead, type your feedback here...",
                 name_required: true,
                 message_required: true,
                 show_asterisk_for_required: true,
                 feedback_url: "/send_feedback_clean",
                 custom_params: {
                     csrf: "my_secret_token",
                     user_id: "john_doe",
                     feedback_type: "clean_complex"
                 },
                 delayed_options: {
                     success_color: "#5cb85c",
                     fail_color: "#d2322d",
                     delay_success_milliseconds: 3500,
                     send_success: "Sent successfully :)"
                 }
             };

             //init feedback_me plugin
             fm.init(fm_options);

             $(function() {
                 $("#accordion").accordion({
                     collapsible: true,
                 });
             });

             $(function() {
                 $("#peergroup").multiselect({
                     height: 600,
                     show: ['slide', 500],
                     hide: ['slide', 500],
                     noneSelectedText: 'Pick Division and select pg'
                 }).multiselectfilter();
             });

             $(function() {
                 $("#query_peergroup").multiselect({
                     height: 600,
                     show: ['slide', 500],
                     hide: ['slide', 500],
                     noneSelectedText: 'Pick Division and select pg'
                 }).multiselectfilter();
             });
             $(function() {
                 $("#row_peergroup").multiselect({
                     height: 600,
                     show: ['slide', 500],
                     hide: ['slide', 500],
                     noneSelectedText: 'Pick Division and select pg'
                 }).multiselectfilter();
             });

             function get_pgs(pg_object) {
                 pg = []
                 a = $(pg_object).multiselect("getChecked")
                 for (index = 0; index < a.length; ++index) {
                     //console.log("pg select value == ", a[index].value.substring(0:4))
                     pg.push(a[index].value.substring(0, 5))
                 }

                 multiselect_widget_length = $(pg_object).multiselect("widget").find('.ui-multiselect-checkboxes li').length

                 console.log('multiselect_widget_length == ', multiselect_widget_length)
                 console.log('pg.length ==', pg.length)

                 if ((multiselect_widget_length == pg.length) && (multiselect_widget_length != 0)) {
                     pg = []
                     pg.push('ALL')
                 }
                 console.log('return pg ==', pg)
                 return pg;

             }

             $('#upload').click(function(event) {
                 event.preventDefault();
                 event.stopPropagation();

                 if (($('#division').val().length == 0) || ($('#division').val() == 'Division')) {
                     alert('Select a division')
                 } else if ($('#peergroup :selected').length == 0) {
                     alert('Select a peergroup')
                 } else if ($('#duration').val() == 'Duration (in mins)') {
                     alert('Pick Duration value')
                 } else if ($('#errorcount').val() == 'Error Count') {
                     alert('Pick ErrorCount value')
                 } else if ($('#cause').val() == 'Outage Caused') {
                     alert('Pick OutageCaused value')
                 } else if ($('#subcause').val() == 'System Caused') {
                     alert('Pick SystemCaused value')
                 } else if ($('#ticket_no').val().length == 0) {
                     alert('Enter a valid ticket number')
                 } else if ($('#radio1').is(':not(:checked)') && $('#radio2').is(':not(:checked)')) {
                     alert('Select JIRA/TTS ticket')
                 } else {
                     console.log("peergroup == ", $('#peergroup').multiselect("getChecked"))
                     pg = get_pgs('#peergroup')

                     data = {
                         'date': $('#datepicker').val(),
                         'division': $('#division').val(),
                         'pg': pg,
                         'duration': $('#duration').val(),
                         'error_count': $('#errorcount').val(),
                         'ticket_num': $('#ticket_no').val(),
                         'outage_caused': $('#cause').val(),
                         'system_caused': $('#subcause').val(),
                         'addt_notes': $('#additional_notes').val(),
                         'ticket_type': $('input[name=tkt-radio]:checked').val()
                     }
                     console.log('data_table insert data == ', data)

                     $.ajax({
                         type: "POST",
                         url: '/post-ticket-data',
                         data: data,
                         success: function(result) {
                             if (result.status == 'success') {
                                 alert("You're stored in our DB!! Playaround!!")
                                 //reset values
                                    //multiselect both needs to be together - uncheck and refresh
                                     $("#peergroup option:selected").removeAttr("selected");
                                     $("#peergroup").multiselect( 'refresh' );
                                     
                                     $('#division').prop('selectedIndex',1);
                                     $('#duration').prop('selectedIndex',0);
                                     $('#errorcount').prop('selectedIndex',0);
                                     $('#cause').prop('selectedIndex',0);
                                     $('#subcause').prop('selectedIndex',0);
                                     $('#ticket_no').val('');
                                     $('#additional_notes').val('');
                                     alert("Reset done")
                                     //reset values over
                                 load_datatable('Y')
                             } else if (result.status == 'session timeout') {
                                 alert("Session expired -- Please relogin")
                                 document.location.href = "/";
                             } else {
                                 alert(result.status)
                             }
                         },
                     });

                 }

             });



             $('#radio_division').click(function() {
                 if ($('#radio_division').is(':checked')) {
                     $('#divisions').show()
                     $('#divisions_header').show()
                     $("#radio_national").removeAttr("checked");
                 }
             });

             $('#radio_national').click(function() {
                 if ($('#radio_national').is(':checked')) {
                     $('#divisions').hide()
                     $("#radio_division").removeAttr("checked");
                 }
             });

             $(function() {
                 $("#dialog_pg_select").dialog({
                     maxWidth: 800,
                     maxHeight: 1000,
                     width: 700,
                     height: 800,
                     modal: true,
                     autoOpen: false,

                 })

             });
             $(function() {
                 $("#dialog").dialog({
                     maxWidth: 800,
                     maxHeight: 1000,
                     width: 500,
                     height: 500,
                     modal: true,
                     autoOpen: false,
                     show: {
                         effect: "explode",
                         duration: 100
                     },
                     hide: {
                         effect: "explode",
                         duration: 100
                     },
                     buttons: {
                         "Update": function() {
                             if ($('#row_peergroup :selected').length == 0) {
                                 alert('Select a peergroup')
                             } else {
                                 data = {}
                                 pg = get_pgs('#row_peergroup')
                                 data = {
                                     'division': $('#row_division').val(),
                                     'pg': pg,
                                     'duration': $('#row_duration').val(),
                                     'error_count': $('#row_error_count').val(),
                                     'outage_caused': $('#row_cause').val(),
                                     'system_caused': $('#row_system_cause').val(),
                                     'addt_notes': $('#dialog_addt_notes').text(),
                                     'ticket_num': $('#dialog_ticket_num').html(),
                                     'ticket_type': $('#dialog_ticket_type').html(),
                                     'update': 'N',
                                 }
                                 $.ajax({
                                     url: '/update-ticket-data',
                                     type: 'POST',
                                     data: data,
                                     success: function(result) {
                                         console.log(JSON.stringify(result))
                                         if (result.status == 'success') {
                                             alert("Row Updated!! Playaround!!")
                                             $('#dialog').dialog("close");
                                             load_datatable('N')
                                         } else if (result.status == 'session timeout') {
                                             alert("Session expired -- Please relogin")
                                             document.location.href = "/";
                                         } else {
                                             alert("Row Update Failed!! Contact Support")
                                         }
                                     },
                                     error: function(msg) {
                                         alert("Call to Update ticket failed!! Contact Support!!")
                                     },
                                     "Cancel": function() {
                                         $(this).dialog("close");
                                     }
                                 })
                             }
                         }
                     }
                 })
             })


                 $("#division").change(function() {
                     $("#dialog-pg").dialog("open");
                 });


                 $("#opener").click(function() {
                     $("#dialog").dialog("open");
                 });



                 $('#query').click(function() {
                     load_datatable('N')
                 })

                 var load_datatable = function(initial) {
                     data = {}
                     pg = []
                     if (initial == 'N') {
                         pg = get_pgs('#query_peergroup')
                     }

                     data = {
                         'start_date_s': $('#query_datepicker_start').val(),
                         'start_date_e': $('#query_datepicker_start_end').val(),
                         'end_date_s': $('#query_datepicker_end').val(),
                         'end_date_e': $('#query_datepicker_end_end').val(),
                         'ticket_num': $('#query_ticket_no').val(),
                         'division': $('#query_division').val(),
                         'pg': pg,
                         //'error_count': $('#duration').val(),
                         'outage_caused': $('#query_cause').val(),
                         'system_caused': $('#query_subcause').val(),
                         'addt_notes': $('#query_addt_notes').html(),
                         'initial': initial
                     }

                     console.log('data_table data == ', data)

                     $.ajax({
                         url: '/get-ticket-data',
                         type: 'POST',
                         data: data,

                         success: function(result) {
                             if (result.status == 'success') {
                                 create_tickets(result)
                             } else if (result.status == 'session timeout') {
                                 alert("Session expired -- Please relogin")
                                 document.location.href = "/";
                             } else {
                                 alert("Unable to get data!! Contact Support");
                             }
                         },
                         error: function() {
                             alert("Call to searchproduct failed");
                         }
                     })
                 }


                 load_datatable('Y')

                 function create_tickets(jsondata) {
                     transactiondata = jsondata
                     console.log('transactiondata length == ', transactiondata.results.length)
                     $("<div class='CSSTableGenerator1'></div>").appendTo("#ticket_list");
                     $('#pagination').pagination({
                         items: transactiondata.results.length,
                         itemsOnPage: 12,
                         onInit: redrawData,
                         onPageClick: redrawData,
                         cssStyle: 'light-theme'
                     });
                 }

                 function redrawData(pageNumber, event) {
                     //console.log('jsondata = ' + JSON.stringify(transactiondata.results))
                     //console.log('pageNumber = ' + pageNumber)
                     transactiondata_results = transactiondata.results
                     if (pageNumber) {
                         if (pageNumber == 1) {
                             slicedata = transactiondata_results.slice(0, 12)
                         } else {
                             slicedata = transactiondata_results.slice(pageNumber * 5,
                                 Math.min((pageNumber + 1) * 5, transactiondata_results.length));
                             //console.log('start', ((pageNumber - 1) * 12 + 1))
                             //console.log('end', 12 * pageNumber + 1)
                             slicedata = transactiondata_results.slice(((pageNumber - 1) * 12 + 1), 12 * pageNumber + 1)
                            //console.log('inside slicdata == ', slicedata)
                         }
                     } else {
                         slicedata = transactiondata_results.slice(0, 12)
                     }

                     $(".CSSTableGenerator1").empty()

                     $("<table id='ticket-table' class='table  tablesorter' style='table-layout:fixed; width:100%'> </table>").appendTo('.CSSTableGenerator1')
                     $('#ticket-table').append('<thead class="thead-inverse"><tr><th style="display:none">id</th><th>User Id</th><th>Create Date</th><th>End Date</th><th>Ticket#</th><th> Division </th> <th>PeerGroup</th> <th>Duration</th><th>Error Count</th><th>Outage Cause</th><th>System Caused</th><th>Addt Notes</th><th></th></tr></thead>');

                     slicedata.forEach(function(obj, i, a) {
                         obj.created_dt = new Date(obj.created_dt)
                         console.log("object == ", obj)
                         user_id = obj.crt_user_id
                         if (typeof user_id === 'string') {

                         } else {
                             obj.crt_user_id = ""
                         }

                         obj.created_dt = dateFormat(obj.created_dt, "default", true)
                         if (obj.row_end_ts.substring(0, 4) == '9999') {
                             obj.row_end_ts = ""
                         } else {
                             obj.row_end_ts = dateFormat(obj.row_end_ts, "default", true)
                         }
                         $('#ticket-table').append('<tr><td id="id_tkt_type" style="display:none">' + obj.ticket_type + '</td><td id="id_user_id">' + obj.crt_user_id + '</td><td id="id_created_dt">' + obj.created_dt + '</td><td id="id_row_end_ts">' + obj.row_end_ts + '</td><td id="id_ticket_num">' + obj.ticket_num + '</td> <td id="id_division">' + obj.division + '</td><td id="id_pg">  <select class="form-control input-sm" id="table_pg' + i + '""> </select>  </td> <td id="id_duration">' + obj.duration + '</td><td id="id_error_count">' + obj.error_count + '</td><td id="id_outage_caused">' + obj.outage_caused + '</td><td id="id_system_caused">' + obj.system_caused + '</td><td id="id_addt_notes" ><div style="height:40px;overflow:scroll" title="' + obj.addt_notes + '">' + obj.addt_notes + '</div></td><td><button id="edit' + i + '"">edit</button><button id="end' + i + '"">end</button></td></tr>');
                         //<td>  <select id="table_pg' + i + '""> </select>  </td>                                              
                         console.log('obj-pg_names == ', pg_names)

                         for (j = 0; j < obj.pg.length; j++) {
                            console.log(obj.pg[j])
                            console.log('obj-pg_names == ', pg_names[obj.pg[j]])
                            if (obj.pg[j] == 'ALL'){
                                pg_name = ''
                            }else{
                                pg_name = pg_names[obj.pg[j]]
                            }
                            
                             $('#table_pg' + i).append($('<option>', {
                                 value: obj.pg[j],
                                 text: obj.pg[j] + ' ' + pg_name
                             }))
                         }
                     })

                     $("#ticket-table").tablesorter({
                         sortList: [
                         ],
                         headers: { 11: { sorter: false }, 12: { sorter: false } },
                         theme: "bootstrap",
                         headerTemplate: '{content} {icon}',
                         widgets: ['uitheme'],
                     });

                     $('[id^=end]').click(function() {
                         data = {}
                         row = $(this).parent().parent()
                         ticket_num = row.find("#id_ticket_num").html()

                         data = {
                             'ticket_num': ticket_num,
                             'update': 'Y',
                         }

                         console.log('update data == ', data)
                         $.ajax({
                             url: '/update-ticket-data',
                             type: 'POST',
                             data: data,
                             success: function(result) {
                                 if (result.status == 'success') {
                                     alert("Row End-Dated!! Playaround!!")
                                     
                                 } else if (result.status == 'session timeout') {
                                     alert("Session expired -- Please relogin")
                                     document.location.href = "/";
                                 } else {
                                     alert("Row End date Failed!! Contact Support")
                                 }
                             },
                             error: function(msg) {
                                 alert("Call to End date ticket failed!! Contact Support!!")
                             }
                         })
                     })

                     $('[id^=edit]').click(function() {
                         var id = $(this).attr('id');
                         row = $(this).parent().parent()
                         ticket_type = row.find("#id_ticket_type").html()
                         created_dt = row.find("#id_created_dt").html()
                         ticket_num = row.find("#id_ticket_num").html()
                         division = row.find("#id_division").html()
                             //pg = row.find("td:nth-child(6), select")
                         pg = row.find("#id_pg, select")
                         duration = row.find("#id_duration").html()

                         error_count = row.find("#id_error_count").html()
                         outage_caused = row.find('#id_outage_caused').html()
                         system_caused = row.find("#id_system_caused").html()
                         addt_notes = row.find("#id_addt_notes").html()

                         $("#dialog_created_dt").html(created_dt)
                         $("#dialog_ticket_num").html(ticket_num)
                         $("#dialog_ticket_type").html(ticket_type)
                         $("#dialog_division select").val(division)
                         division = $("#row_division")[0]

                         var pg_cds_array = []
                         $(pg).find('option').each(function(i, selected) {
                             pg_cds_array[i] = $(selected).val().substring(0, 5);
                         });

                         getval(division, 'setting', pg_cds_array)

                         $("#dialog_duration select").val(duration)
                         $("#dialog_error_count select").val(error_count)
                         $("#dialog_outage_caused select").val(outage_caused)
                         $("#dialog_system_caused select").val(system_caused)
                         $("#dialog_addt_notes").html(addt_notes)
                         $("#dialog").dialog("open");

                         //Very important 
                         //Don't remove this piece of code, if its removed you will unable to edit filter text box
                         //http://stackoverflow.com/questions/16683512/jquery-ui-multiselect-widget-search-filter-not-receiving-focus-when-in-a-jquery
                         if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
                             var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
                             $.ui.dialog.prototype._allowInteraction = function(e) {
                                 if ($(e.target).closest('.ui-multiselect-filter input').length) return true;
                                 return ui_dialog_interaction.apply(this, arguments);
                             };
                         }


                         //load_datatable('N')
                     })
                 }
             })
