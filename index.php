<?php
   error_reporting(E_ALL);
   require_once($_SERVER['DOCUMENT_ROOT']."/utils/functions.php");
   $currenttab = "";
   if(isset($_GET["products"])) {
       $currenttab = 'products';
   }
   else if(isset($_GET["customearrings"])) {
       $currenttab = "customearrings";
   }
  else if(isset($_GET["designearrings"])) {
       $currenttab = "designearrings";
   }
     else if(isset($_GET["designearrings1"])) {
       $currenttab = "designearrings1";
   }
   else if(isset($_GET["offers"])) {
       $currenttab = 'offers';
   }
   else if(isset($_GET["join"])) {
       $currenttab = 'join';
   }
     else if(isset($_GET["corp"])) {
       $currenttab = 'corp';
   }
   else if(isset($_GET["about"])) {
       $currenttab = 'about';
   }
   else if(isset($_GET["contact"])) {
       $currenttab = 'contact';
   }
   else if(isset($_GET["support"])) {
       $currenttab = 'support';
   }
   else if(isset($_GET["privacy"])) {
       $currenttab = 'privacy';
   }
   else if(isset($_GET["sr"])) {
       $currenttab = 'sr';
   }
   else if(isset($_GET["tc"])) {
       $currenttab = 'tc';
   }
   else if(isset($_GET["orders"])) {
       $currenttab = 'orders';
   }
   else if(isset($_GET["myorder"])) {
    if(!isset($_SESSION["userid"])) $currenttab = 'register';
    else if(!isset($_REQUEST["orderid"])) $currenttab = 'home';
     else
       $currenttab = 'myorder';
   }
   else if(isset($_GET["register"])) {
       $currenttab = 'register';
   }
   else if(isset($_GET["checkout"])) {
       $currenttab = 'checkout';
   }
   else if(isset($_GET["single"])) {
       $currenttab = 'single';
   }
   else if(isset($_GET["myaccount"])){
    if(!isset($_SESSION["userid"])) $currenttab = 'register';
    else $currenttab = 'myaccount';
   }
   else if(isset($_GET["logout"])){
     $currenttab = 'logout';
   }
  else if(isset($_GET["thankyou"])) {
       $currenttab = "thankyou";
   }
   else {
       $currenttab = 'home';

      $rqry = "SELECT productid, name, price, material, mainimg, dateAdded, customized FROM products WHERE featured=1 ORDER BY dateAdded DESC LIMIT 12";

       if(!$stmt = $dbcon->prepare($rqry)){
          die('Prepare Error : ('. $dbcon->errno .') '. $dbcon->error);
      }

      if(!$stmt->execute()){
          die('Error : ('. $dbcon->errno .') '. $dbcon->error);
      }

      $stmt->store_result();
      $stmt->bind_result($a,$b, $c, $d, $e, $f, $g);
      $featuredPrd =[];
      while ($stmt->fetch()) {
        $featuredPrd[] = ['productid' => $a, 'name' => $b, 'price' => $c, 'material' => $d, 'mainimg' => $e, 'dateAdded' =>$f, 'customized' => $g];
      }
      $stmt->close();

   }

if(isset($_SESSION['orderStatus'])  && $_SESSION['orderStatus'] == "confirmed" && $currenttab != "orders" ) {
  unset($_SESSION['orderStatus']);
  unset($_SESSION['orderID']);
  unset($_SESSION['cartids']);
  unset($_SESSION['cartPrice']);
}




   ?>
<!DOCTYPE html>
<html>
   <head>
      <title>Fitoori</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content="" />
      <?php include("cssincludes.html"); ?>
      <?php include("jsincludes.html"); ?>
   </head>
   <body>
<!-- facebook integration -->
<!-- <div id="fb-root"></div>
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '236903216763385',
      xfbml      : true,
      version    : 'v2.6'
    });
  };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(d)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=1076977995697955";
      fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));</script> -->

  <div id="fb-root"></div>

<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '236903216763385',
      status     : true,    // check login status
      cookie     : true,    // enable cookies to allow the
                            // server to access the session
      xfbml      : true,     // parse page for xfbml or html5
                            // social plugins like login button below
      version    : 'v2.7',  // Specify an API version

    });
      FB.AppEvents.logPageView();
  };

 // Load the SDK Asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

</script>

<!-- Twitter -->
<!--   <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script> -->

<!-- google analytics -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-84739847-2', 'auto');
  ga('send', 'pageview');
</script>
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1301877609834122'); // Insert your pixel ID here.
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1301877609834122&ev=PageView&noscript=1"
/></noscript>
<!-- DO NOT MODIFY -->
<!-- End Facebook Pixel Code -->

      <!--header-->
      <!-- <div class="header"> -->
         <!-- <div class="container"> -->
    <nav role="navigation" class="navbar navbar-default navbar-fixed-top <?php if($currenttab == 'home' || $currenttab == 'designearrings') { echo 'homepage'; } ?>" role="navigation"">
      <div class="container">

        <!-- Title -->
        <div class="navbar-header pull-left">
          <a href="index.php" class="navbar-brand"><img src="images/logo_dark.png"  class="img-responsive"/></a>

          <!-- Required bootstrap placeholder for the collapsed menu -->
          <button type="button" data-toggle="collapse" data-target=".navbar-collapse" class="navbar-toggle"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>
        </div>

        <!-- 'Sticky' (non-collapsing) right-side menu item(s) -->
        <div class="navbar-header pull-right">
          <ul class="nav pull-left">
            <li class="dropdown grid pull-left">
               <a class="cart dropdown-toggle" href="#" data-toggle="dropdown"><i class="fa fa-shopping-bag fa-fw"></i><span id="badge" class="badge">0</span></a>
                <div class="dropdown-menu cart-box" id="cartbox" style="padding: 15px; padding-bottom: 0px;">
                   <p><span>Your Total</span>
                   <span class="simpleCart_total">  <i class="fa fa-inr"></i> 0.00 </span>
                    </p>
                    <hr>
                    <p> <span class="simpleCart_quantity"> 0 </span>
                    <span class="cartbtn"><a class="btn btn-primary" href="index.php?checkout">View cart</a></span>
                    </p>
                </div>
              </li>
              <li class="dropdown grid pull-right">
                <a class="dropdown-toggle" href="#" data-toggle="dropdown"><span class="glyphicon glyphicon-user" aria-hidden="true"></span></a>
                <div class="dropdown-menu" id="loginbox" style="padding: 15px; padding-bottom: 0px;">
                 <form  id="loginForm" name="loginForm" role="form" <?php  if(isset($_SESSION["useremail"])) echo "style='display:none;'" ?>>
                   <div class="alert alert-danger hide" id="loginFailedMsg" role="alert"> Login Failed! Please try again</div>
                   <div class="alert alert-danger hide" id="systemErrorMsg" role="alert"> System Failure! please try later.</div>
                   <div class="alert alert-danger hide" id="forgotpwdMessage" role="alert"> Please provide yor email address, you will recieve an email with your password.</div>
                   <div class="alert alert-danger hide" id="fgtPwdMsg" role="alert">We have sent you an Email with password.</div>

                   <fieldset id="loginform">
                      <div class="form-group">
                         <label for="email">Email Address</label>
                         <input class="form-control" placeholder="Email Address" name="email" type="email" id="emailAddr" autofocus>
                      </div>
                      <div class="form-group">
                         <label for="password" id="pwdLabel">Password</label>
                         <input class="form-control" placeholder="Password" name="pass" type="password" value="" id="pwd">
                      </div>
                      <input type="submit" class="btn btn-primary" id="login" value="Login" name="login" />
                      <span><a href="javascript:void(0);" id="fgtpwd">Forgot your password?</a></span>
                   </fieldset>
                   <p>New User ? <a class="sign" href="index.php?register">Sign Up</a>
                   </p>
                  </form>
                  <div class="userprofile"  <?php  if(!isset($_SESSION["useremail"])) echo "style='display:none;'" ?>>
                     <ul class="list-group dropdown-user" id="userList" style="display:block">
                        <li class="list-group-item">
                           <span class="username">
                                <?php  if(isset($_SESSION["useremail"])) echo $_SESSION["useremail"]; ?>
                           </span> &nbsp;&nbsp;
                           <span class="logout">
                           <a href="index.php?logout"><i class="fa fa-sign-out fa-fw"></i>Logout</a>
                           </span>
                        </li>
                        <li class="list-group-item"><a href="index.php?myaccount=profile"><i class="fa fa-user fa-fw"></i>My Account</a>
                        </li>
                        <li class="list-group-item"><a href="index.php?myaccount=custom"><i class="fa fa-picture-o"></i> My Designs</a>

                        <li class="list-group-item"><a href="index.php?myaccount=orders"><i class="fa fa-shopping-bag fa-fw"></i> My Orders</a>
                        </li>
                     </ul>
                  </div>
                  <div class="submitForm" style="display:none">
                    <form  id="submitForm" name="submitForm" role="form" style="display:none;">
                       <div class="alert alert-danger hide" id="forgotpwdMessage" role="alert"> Please provide yor email address, you will recieve an email with your password.</div>
                       <div class="alert alert-danger hide" id="fgtPwdMsg" role="alert">We have sent you an Email with password.</div>
                       <div class="alert alert-danger hide" id="errorMsg" role="alert">Some Error</div>
                       <fieldset id="submitfield">
                          <div class="form-group">
                             <label for="email">Email Address</label><br/>
                             <input class="form-control" placeholder="Email Address" name="email" type="email" id="emailAddr" autofocus>
                          </div>
                          <input type="submit" class="btn btn-primary" id="submitEmail" value="Submit" name="submitEmail">
                          <span><a href="javascript:void(0);" id="fgtcancel">cancel</a></span>
                       </fieldset>
                    </form> <br>
                  </div>

                </div>
              </li>
          </ul>


        </div>

        <!-- The Collapsing items            navbar-left or navbar-right -->
        <div class="collapse navbar-collapse navbar-left">
          <!-- pull-right keeps the drop-down in line -->
          <ul class="nav navbar-nav">
                               <li>
                       <a href="index.php" <?php if($currenttab == "home") echo 'class="active"'; ?>>
                          Fitoori <!-- <img src="images/home.png"/> -->
                       </a>
                    </li>
                    <li class="dropdown grid">
                       <a href="javascript:void(0);" class="dropdown-toggle list1 <?php if($currenttab == "customearrings" || $currenttab == "customearrings") echo 'active'; ?>" data-toggle="dropdown">Co-Creation</a>
                       <ul class="dropdown-menu">
                                   <li><a class="list" href="index.php?designearrings=dangler ">
                                   <img src="images/dangler_ic.png"  align="bottom" /> Danglers</a></li>
                                   <li><a class="list" href="index.php?designearrings=jhumka">
                                   <img src="images/jhumka_ic.png"  align="bottom" /> Jhumka</a></li>
                                   <li><a class="list" href="index.php?designearrings=hoop">
                                   <img src="images/hoop_ic.png"  align="bottom" /> Hoops</a></li>
                                   <li><a class="list" href="index.php?designearrings=chandelier">
                                   <img src="images/chandelier_ic.png"  align="bottom" /> Chandelier</a></li>
                       </ul>
                    </li>
                    <li class="dropdown grid">
                       <a href="javascript:void(0);" class="dropdown-toggle <?php if($currenttab == "products") echo 'active'; ?>" data-toggle="dropdown" >Products</a>
                       <ul class="dropdown-menu">
                                   <li><a class="list" href="index.php?products">All</a></li>
                                   <li><a class="list" href="index.php?products&m=2">Beaded</a></li>
                                   <li><a class="list" href="index.php?products&m=3">Metal</a></li>
                                   <li><a class="list" href="index.php?products&m=1">Teracotta</a></li>
                       </ul>
                    </li>

                    <li>
                       <a href="http://fitoorifeed.com" target="_blank">
                          Blog <!-- <img src="images/home.png"/> -->
                       </a>
                    </li>
          </ul>
        </div>

      </div>
    </nav>


         <!-- </div> -->
      <!-- </div> -->
      <!--//header-->
      <?php
         if($currenttab == "home") {
              $check_user="select is_undermaintenance from sitevariable";
              $result=mysqli_query($dbcon,$check_user);
              if ($result && mysqli_num_rows($result) > 0)
                {
                  while ($row=mysqli_fetch_row($result))
                    {
                      $sitevar = $row[0];
                      if( $sitevar == 0)
                      {
                        include(SITE_ROOT. "/startindex.html");
                      }
                      else{
                        include(SITE_ROOT. "/undermaintenance.html");
                      }
                  }
                    // Free result set
                    mysqli_free_result($result);
                }

         }
         else if($currenttab == "products") {
              include(SITE_ROOT. "/php/productsearch.php");
             include(SITE_ROOT. "/products.html");
         }
         else if($currenttab == "customearrings") {
                include(SITE_ROOT. "/customizationLandingPage.html");
            }
         else if($currenttab == "designearrings") {
                 include(SITE_ROOT. "/php/design.php");
                 include(SITE_ROOT. "/design.html");
            }
          else if($currenttab == "designearrings1") {
                 include(SITE_ROOT. "/php/design.php");
                 include(SITE_ROOT. "/design.html");
            }
         else if($currenttab == "offers") {
             include(SITE_ROOT. "/offers.html");
         }
         else if($currenttab == "join") {
             include(SITE_ROOT. "/joinus.html");
         }
        else if($currenttab == "corp") {
             include(SITE_ROOT. "/corporate.html");
         }
         else if($currenttab == "about") {
             include(SITE_ROOT. "/about.html");
         }
         else if($currenttab == "contact") {
             include(SITE_ROOT. "/contact.html");
         }
         else if($currenttab == "support") {
             include(SITE_ROOT. "/support.html");
         }
         else if($currenttab == "privacy") {
             include(SITE_ROOT. "/privacy.html");
         }
         else if($currenttab == "sr") {
             include(SITE_ROOT. "/SR.html");
         }
         else if($currenttab == "tc") {
             include(SITE_ROOT. "/T&C.html");
         }
         else if($currenttab == "register") {
             include(SITE_ROOT. "/register.html");
         }
         else if($currenttab == "checkout") {
             include(SITE_ROOT. "/php/checkout.php");
             include(SITE_ROOT. "/checkoutCart.html");
         }
         else if($currenttab == "single") {
             include(SITE_ROOT. "/single.html");
         }
        else if($currenttab == "myaccount") {
            include(SITE_ROOT. "/php/user.php");
            include(SITE_ROOT. "/myAccount.html");
        }
        else if($currenttab == "orders") {
            include(SITE_ROOT. "/php/checkout.php");
            include(SITE_ROOT. "/php/orders.php");
            include(SITE_ROOT. "/orderpage.html");
        }
       else if($currenttab == "myorder") {
            include(SITE_ROOT. "/php/myorder.php");
            include(SITE_ROOT. "/myorder.html");
        }
           else if($currenttab == "thankyou") {
            // include(SITE_ROOT. "/php/thankyou.php");
            include(SITE_ROOT. "/thankyou.html");
        }
         ?>
      <!--footer-->

       <section class="footerbanner">
            <div class="container">
              <div class="col-xs-4">
                <img src="images/madel.jpg" alt="" style="margin-top: 10px;">
                <p><h5><b>Hand crafted with love</b></h5></p>
              </div>
              <div class="col-xs-4">
                <img src="images/lotus.png" alt="" style= height:60px>
                <p><h5><b>Skin friendly Nickel-free products</b></h5></p>
              </div>
              <div class="col-xs-4">
                <img src="images/wind-mill.png" alt="" style="margin-top: 10px;">
                <p><h5><b>Easy and fun customizing</b></h5></p>
              </div>
            </div>
        </section>

      <section class="footer">
         <div class="container">
            <div class="footer-grids">
               <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 footer-grid">
                  <h4>company</h4>
                  <ul>
                     <li><a href="index.php?about">About Us</a></li>
                     <!-- <li>Our Partners</li>
                     <li>Social Responsibility</li> -->
                     <li><a href="index.php?join">Work Here</a></li>
                  </ul>
               </div>
               <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 footer-grid">
                  <h4>service</h4>
                  <ul>
                     <!-- <li>FAQ</li> -->
                     <li><a href="index.php?contact">Contact Us</a></li>
                     <li><a href="index.php?support">Support</a></li>
                  </ul>
               </div>
               <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 footer-grid">
                  <h4>order & returns</h4>
                  <ul>
                     <li><a href="index.php?tc#OrderStatus">Order Status</a></li>
                     <li><a href="index.php?tc#ShippingPolicy">Shipping Policy</a></li>
                     <li><a href="index.php?tc#ReturnPolicy">Return Policy</a></li>
                  </ul>
               </div>
               <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 footer-grid">
                  <h4>legal</h4>
                  <ul>
                     <li><a href="index.php?privacy">Privacy</a></li>
                     <li><a href="index.php?tc">Terms & Conditions</a></li>
                     <!-- <li>Social Responsibility</li> -->
                  </ul>
               </div>
               <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 footer-grid icons">
                  <h4>Connect with Us</h4>
                  <ul>
                    <li><img src="images/i1a.png" alt=""/>&nbsp;Facebook</li>
                    <li><img src="images/i2a.png" alt=""/>&nbsp;Twitter</li>
                  </ul>
               </div>
            </div>
            <div class="clearfix"></div>
         </div>
      </section>

      <!--//footer-->
      <section class="footer-bottom">
         <div class="container">
            <p> © 2016 Fitoori . All rights reserved.</p>
         </div>
      </section>
    </body>
</html>
