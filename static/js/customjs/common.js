$(document).ready(function() {

    $('#loginid').click(function() {
        $('#apikey').modal('show');
    })
    
    $('#logout').click(function() {
        window.location.href = "/";
    })
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

})
