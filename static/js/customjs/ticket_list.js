$(document).ready(function() {

    
    // $('#radio_central, #radio_northeast, #radio_western').click(function() {
    //      $(this).attr('checked', !$(this).attr('checked'));
    // });

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
        $("#dialog").dialog({
            maxWidth: 800,
            maxHeight: 500,
            width: 600,
            height: 300,
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
                    data = {}
                    data = {
                        'division': $('#row_division').val(),
                        'pg': $('#row_peergroup').val(),
                        'duration': $('#row_duration').val(),
                        'error_count': $('#row_error_count').val(),
                        'outage_caused': $('#row_cause').val(),
                        'system_caused': $('#row_system_cause').val(),
                        'addt_notes': $('#dialog_addt_notes').html(),
                        'ticket_id': $('#dialog_ticket_id').html(),
                        //'initial': initial
                    }

                    console.log('update data == ', data)
                    $.ajax({
                        url: '/update-ticket-data',
                        type: 'POST',
                        data: data,
                        success: function(result) {

                            if (result.status != 'success') {
                                alert("Row Update Failed!! Contact Support")
                            } else {
                                alert("Row Updated!! Playaround!!")
                                $('#dialog').dialog("close");
                                load_datatable('Y')

                            }
                        },
                        error: function(msg) {
                            alert("Call to Update ticket failed!! Contact Support!!")
                        }
                    })
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }


        })
    });


    $("#opener").click(function() {
        $("#dialog").dialog("open");
    });



    $('#query').click(function() {
        load_datatable('N')
    })

    var load_datatable = function(initial) {
        data = {}
        data = {
            'start_date': $('#query_datepicker_start').val(),
            'end_date': $('#query_datepicker_end').val(),
            'ticket_num': $('#query_ticket_num').html(),
            'division': $('#query_division').val(),
            'pg': $('#query_peergroup').val(),
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
            success: create_tickets,
            error: function(msg) {
                alert("Call to searchproduct failed")
            }
        })
    }


    load_datatable('Y')

    function create_tickets(jsondata) {
        transactiondata = jsondata
        console.log('transactiondata length == ', transactiondata.results.length)
        $("<div class='CSSTableGenerator'></div>").appendTo("#ticket_list");
        $('#pagination').pagination({
            items: transactiondata.results.length,
            itemsOnPage: 12,
            onInit: redrawData,
            onPageClick: redrawData,
            cssStyle: 'light-theme'
        });
    }

    function redrawData(pageNumber, event) {
        console.log('jsondata = ' + JSON.stringify(transactiondata.results))
        console.log('pageNumber = ' + pageNumber)
        transactiondata_results = transactiondata.results
        if (pageNumber) {
            if (pageNumber == 1) {
                slicedata = transactiondata_results.slice(0, 12)
            } else {
                console.log('inside transactiondata = ' + transactiondata_results)
                slicedata = transactiondata_results.slice(pageNumber * 5,
                    Math.min((pageNumber + 1) * 5, transactiondata_results.length));
                console.log('start', ((pageNumber - 1) * 12 + 1))
                console.log('end', 12 * pageNumber + 1)
                slicedata = transactiondata_results.slice(((pageNumber - 1) * 12 + 1), 12 * pageNumber + 1)
                console.log('inside slicdata == ', slicedata)
            }
        } else {
            slicedata = transactiondata_results.slice(0, 12)
            console.log('sliced transactiondata = ' + JSON.stringify(transactiondata))
        }

        $(".CSSTableGenerator").empty()

        $("<table id='ticket-table'> </table>").appendTo('.CSSTableGenerator')
        $('#ticket-table').append('<tr><td style="display:none">id</td><td>Date</td><td>Ticket#</td><td> Division </td> <td>PeerGroup</td> <td>Duration</td><td>Error Count</td><td>Outage Cause</td><td>System Caused</td><td>Addt Notes</td><td></td></tr>');

        slicedata.forEach(function(e, i, a) {
            var obj = e;
            $('#ticket-table').append('<tr><td style="display:none">' + obj.ticket_id + '</td><td>' + obj.created_dt + '</td><td>' + obj.ticket_num + '</td> <td>' + obj.division + '</td><td>' + obj.pg + '</td> <td>' + obj.duration + '</td><td>' + obj.error_count + '</td><td>' + obj.outage_caused + '</td><td>' + obj.system_caused + '</td><td>' + obj.addt_notes + '</td><td><button id="edit' + i + '"">edit</button></td></tr>');

        })

        $('[id^=edit]').click(function() {
            var id = $(this).attr('id');
            row = $(this).parent().parent()
            console.log($(this).parent().parent().find("td:first").html())
            ticket_id = row.find("td:first").html()
            created_dt = row.find("td:nth-child(2)").html()
            ticket_num = row.find("td:nth-child(3)").html()
            division = row.find("td:nth-child(4)").html()
            pg = row.find("td:nth-child(5)").html()
            duration = row.find("td:nth-child(6)").html()
            error_count = row.find("td:nth-child(7)").html()
            outage_caused = row.find("td:nth-child(8)").html()
            system_caused = row.find("td:nth-child(9)").html()
            addt_notes = row.find("td:nth-child(10)").html()
            console.log(duration)
            $("#dialog_created_dt").html(created_dt)
            $("#dialog_ticket_num").html(ticket_num)
            $("#dialog_ticket_id").html(ticket_id)
            $("#dialog_division select").val(division)
            getval('this', 'setting')
            $("#dialog_pg select").val(pg)
            $("#dialog_duration select").val(duration)
            $("#dialog_error_count select").val(error_count)
            $("#dialog_outage_caused select").val(outage_caused)
            $("#dialog_system_caused select").val(system_caused)
            $("#dialog_addt_notes").html(addt_notes)
            $("#dialog").dialog("open");
            //load_datatable('N')
        })


        $(function() {

            $('#load').click(function(event) {
                event.preventDefault();

                if ($('#division').val().length == 0) {
                    alert('Select a division')
                } else if ($('#peergroup').val().length == 0) {
                    alert('Select a peergroup')
                } else if ($('#ticket_no').val().length == 0) {
                    alert('Enter a valid ticket number')
                } else if ($('#radio1').is(':not(:checked)') && $('#radio2').is(':not(:checked)')) {
                    alert('Select JIRA/TTS ticket')
                } else {

                    data = {
                        'date': $('#datepicker').val(),
                        'division': $('#division').val(),
                        'pg': $('#peergroup').val(),
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

                            result = result

                            if (result.status != 'success') {
                                alert(result.status)
                            } else {
                                alert("You're stored in our DB!! Playaround!!")
                                load_datatable('Y')
                            }
                        },
                    });

                }

            });

        });


    }


})
