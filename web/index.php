<?php error_reporting(E_ALL);
    header('Cache-Control: no-cache');
    header('Content-Type: text/html');
?>

<!doctype html>
<html class="no-js" lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=0">
    <meta name="color-scheme" content="light dark">
    <meta name="theme-color" content="#2f2f34">
    <meta name="robots" content="index,follow">
    <meta name="referrer" content="origin">
    
    <link rel="manifest" href="site.webmanifest">
    <link rel="preload" href="assets/icons/icon-v1.css" as="style" />
    <link rel="preload" href="dist/index.css" as="style" />
    <link rel="preload" href="https://cdn.jsdelivr.net/gh/jxmked/resources@xio/assets/fonts/montserrat/stylesheet.css" as="style" />
    <link rel="preload" href="https://cdn.jsdelivr.net/gh/jxmked/resources@xio/assets/fonts/caviar-dreams/stylesheet.css" as="style" />
    <link rel="preload" href="https://cdn.jsdelivr.net/gh/jxmked/resources@xio/assets/fonts/montserrat/Montserrat-Medium.woff2" as="font" crossorigin />
    <link rel="preload" href="https://cdn.jsdelivr.net/gh/jxmked/resources@xio/assets/fonts/montserrat/Montserrat-SemiBold.woff2" as="font" crossorigin />
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jxmked/resources@xio/assets/fonts/montserrat/stylesheet.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jxmked/resources@xio/assets/fonts/caviar-dreams/stylesheet.css">
    <link rel="stylesheet" href="assets/icons/icon-v1.css">
    
    <link rel="stylesheet" href="assets/lib/reset.css">
    <link rel="stylesheet" href="dist/index.css">
    
    <meta property="og:title" content="Using MariaDB Basic Example" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="/" />
    <meta property="og:image" content="assets/images/xio-white.webp" />
    <meta property="og:description" content="" />
    <meta property="og:site_name" content="MariaDB sample" />
    <meta name="description" content="" />

    <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">

    <title>MariaDB Sample</title>
    
    <?php
        require "scripts/helpers.php";
        use helpers\Helpers;
    ?>
</head>
<body class="">
    <nav>
        <div>
            <h3>MariaDB Sample</h3>
        </div>
    </nav>
    
    
    <?php if(Helpers::url_param("page") == 'program') : ?> <!-- Methods -->
    <div class="container">
        <div>
            
        </div>
    </div>
    
    <?php else : ?> <!-- Landing Page -->
    <div class="container">
        <div>
            <label class="header-text header-2">What you can do?</label>
            <ul>
                <li>Insert or add new data</li>
                <li>Modify or edit data</li>
                <li>Delete data</li>
                <li>View saved data</li>
                <li>Sort data</li>
            </ul>
            
            <div class="continue-link">
                <a href="/index.php?page=program">Continue...</a>
            </div>
        </div>
        
        <div style="border: none;">
            <h4 style="white-space: normal;">What are MariaDB Sample localhosted page and what availeble feature in here?</h4>
            <p>This is a demo of using different interfaces and porgramming languages to modify a single database.</p>
            <p>Here in localhosted webpage, we can easily navigate in some basic functionality of a database such as add, edit, delete by clicking in available navigation.</p>
            <p>Using PHP, we are able to create Application Program Interface (API) to handle our requests.</p>
            <p>We are also using Asynchronous JavaScript And XML (AJAX) to process our requests without refreshing the entire page.</p>
            <p>And also, we are going to use Python for command line interface to modify the database.</p>
            <p>To start please follow some procedure here in <a href="https://github.com/jxmked/mariadb-sample/blob/xio/README.md">README.md file</a> on Github.</p>
        </div>
    </div>
    <?php endif; ?>
    
    
    
</body>
</html>