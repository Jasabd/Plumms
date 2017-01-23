<?php
     $img = $_GET['img'];   //read the score from the url
?>

<!DOCTYPE html>
<head>
          <meta property="fb:app_id"  content="236903216763385" />
     <!-- This url should be the same as the href you passed in to showDialog -->
     <meta property="og:url" content="<?= "http://". $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; ?>" />

     <!-- Here I customized the title, but you can customize any property you want -->
     <meta property="og:title" content="My Fitoori Design!"/>
     <meta property="og:description" content="Easy to mix and match the designs!" />
     <meta property="og:image" content="http://fitoori.com/productImages/<?= $img ?>" />
     <meta property="og:image:type" content="image/png" />
     <meta property="og:image:width" content="350" />
     <meta property="og:image:height" content="300" />

     <!-- Manually redirect to the page you want the user to land on. This is optional -->
     <meta http-equiv="refresh" content="0;url=http://fitoori.com">

     <script type="text/javascript">
        window.location.href = "http://fitoori.com"
     </script>
</head>