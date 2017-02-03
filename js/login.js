$(function() {

    //scroll event here
    //jQuery to collapse the navbar on scroll
    $(window).scroll(function() {
      //get scroll position
      var topWindow = $(window).scrollTop();
      //multipl by 1.5 so the arrow will become transparent half-way up the page
      var topWindow = topWindow * 1.5;

      //get height of window
      var windowHeight = $(window).height();

      //set position as percentage of how far the user has scrolled
      var position = topWindow / windowHeight;
      //invert the percentage
      position = 1 - position;

      //define arrow opacity as based on how far up the page the user has scrolled
      //no scrolling = 1, half-way up the page = 0
      $('.arrow-wrap').css('opacity', position);

        if ($(".navbar").offset().top > 60) {
            $(".navbar-fixed-top").addClass("top-nav-collapse");
        } else {
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
        }
    });


     $('a[href*="#content"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });


    $("#loginForm").validate({
     rules: {
      email: {
       required: true,
       email: true
      },
      pass: {
       required: true,
       minlength: 5
      }
     },
     messages: {
      pass: {
       required: "Please provide a password",
       minlength: "Your password must be at least 5 characters long"
      },
      email: "Please enter a valid email address"
     },
     submitHandler: function(form) {
      var email_add = $(form).find("input[name='email']").val();
      $.ajax({
       type: "POST",
       url: "php/login.php",
       data: $(form).serialize(),
       timeout: 3000,
       success: function(data) {
        if (data && data == "SUCCESS") {
         // window.location = "<?php echo SITE_URL ?>index.php";
         $("#loginForm").hide();
         $(".userprofile #loginemail").html(email_add);
         $(".userprofile").show();

        } else {
         $(".alert-danger").addClass("hide");
         $("#loginFailedMsg").removeClass("hide");
        }
       },
       error: function() {
        $(".alert-danger").addClass("hide");
        $("#systemErrorMsg").removeClass("hide");
       }
      });
      return false;
     }
    });


    $("#loginForm #fgtpwd").click(function() {
     $("#loginForm").css('display', 'none');
     $("div.submitForm").show();
     $("#submitForm").css('display', 'block');
     $("#submitForm #forgotpwdMessage").removeClass("hide");
    });
     $("#submitfield #fgtcancel").click(function() {
       $("#submitForm").css('display', 'none');
       $("#submitForm #forgotpwdMessage").removeClass("hide");
       $("#loginForm").css('display', 'block');
       $("div.submitForm").hide();

      });


    $("#submitForm").validate({
     rules: {
      email: {
       required: true,
       email: true
      }
     },
     messages: {
      email: "Please enter a valid email address"
     },
     submitHandler: function(form) {
      var email_add = $(form).find("input[name='email']").val();
      $.ajax({
       type: "POST",
       url: "php/user.php?emailPass",
       data: $(form).serialize(),
       timeout: 3000,
       success: function(data) {
        if (data && data == "SUCCESS") {
         //$(".alert-danger").removeClass("alert-danger").addClass("alert-success").html("Email has been sent successfully");
         $(".alert-danger").addClass("hide");
         $("#fgtPwdMsg").removeClass("hide");
         $("div.submitForm").hide();
         $("#loginForm").css("display", "block");

        }
        else if(data && data == "NOEMAIL") {
            $(".alert-danger").html("Email not found. Please register.");
        }
        else if(data && data == "ERROR") {
            $(".alert-danger").html("Technical Error. We apologize.");
        }
       },
       error: function() {
        $(".alert-danger").addClass("hide");
        $("#errorMsg").removeClass("hide");
       }
      });
      return false;
     }
    });


    $('input[name=collapseGroup]').click(function(e){
      var elem  = $(this);
      var target  = elem.data("target");
      if(target == "#guestLogin") {
        $("#userLogin").removeClass("in");
      }
       if(target == "#userLogin") {
        $("#guestLogin").removeClass("in");
      }
    });

});
