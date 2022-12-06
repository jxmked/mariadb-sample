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

    <title>MariaDB API</title>
</head>
<body class="">

    <nav>
        <div>
            <input type="checkbox" />
            <div id="nav ">
                <ul>
                    <li>Home</li>
                    <li></li>
                </ul>
            </div>
        </div>
        
    </nav>




    <script type="text/javascript">
        
        if (!!window.EventSource) {
            var source = new EventSource('stream.php');
            
            source.addEventListener('message', function(e) {
                console.log(e.data);
            }, false);
            
            source.addEventListener('open', function(e) {
            // Connection was opened.
                console.log("Connection has been open");
            }, false);
            
            source.addEventListener('error', function(e) {
                if (e.readyState == EventSource.CLOSED) {
                // Connection was closed.
                
                    console.log("Connection was closed");
                }
            }, false);
                        
        } else {
        // Result to xhr polling :(
        }
    </script>

</body>
</html>