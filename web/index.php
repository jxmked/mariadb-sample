<?php error_reporting(E_ALL);
    define("SECURITY", true);
    
    header('Cache-Control: no-cache');
    header('Content-Type: text/html');
    
    require "phps/helpers.php";
    use helpers\Helpers;
    
    
    define("ROOT", "");
    
    /**
     * We can move files locally
     * */
    define("RESOURCE_ROOT", "https://cdn.jsdelivr.net/gh/jxmked/resources@xio/");
    
    /*
    foreach ($_SERVER as $k => $v) {
        echo $k . " : " . $v . "<br />";
    } */

    define("AUTO_REFRESH", false);

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
    
    <?php
        $pages = array(
            "program",
            "intro"
        );
        
        
        if(array_search(Helpers::url_param("page", ""), $pages) === false ) {
            
            $link =  $_SERVER['PHP_SELF'] . "?page=intro";
            
            echo "<meta http-equiv=\"refresh\" content=\"2;URL=" . $link . "\" />";
        }
    ?>

    <?php if(AUTO_REFRESH) : ?>
        <meta http-equiv="refresh" content="2;" >
    <?php endif; ?>
    
    <link rel="manifest" href="<?php Helpers::safe_print(ROOT); ?>site.webmanifest">
    <link rel="preload" href="<?php Helpers::safe_print(ROOT); ?>assets/icons/icon-v1.css" as="style" />
    <link rel="preload" href="<?php Helpers::safe_print(ROOT); ?>dist/index.css" as="style" />
    <link rel="preload" href="<?php Helpers::safe_print(RESOURCE_ROOT); ?>assets/fonts/montserrat/stylesheet.css" as="style" />
    <link rel="preload" href="<?php Helpers::safe_print(RESOURCE_ROOT); ?>assets/fonts/caviar-dreams/stylesheet.css" as="style" />
    <link rel="preload" href="<?php Helpers::safe_print(RESOURCE_ROOT); ?>assets/fonts/montserrat/Montserrat-Medium.woff2" as="font" crossorigin />
    <link rel="preload" href="<?php Helpers::safe_print(RESOURCE_ROOT); ?>assets/fonts/montserrat/Montserrat-SemiBold.woff2" as="font" crossorigin />
    <link rel="preload" href="<?php Helpers::safe_print(ROOT); ?>assets/vendor/require.js" as="script" />
    <link rel="stylesheet" href="<?php Helpers::safe_print(RESOURCE_ROOT); ?>assets/fonts/montserrat/stylesheet.css">
    <link rel="stylesheet" href="<?php Helpers::safe_print(RESOURCE_ROOT); ?>assets/fonts/caviar-dreams/stylesheet.css">
    
    <link rel="stylesheet" href="<?php Helpers::safe_print(ROOT); ?>assets/icons/icon-v1.css">
    <link rel="stylesheet" href="<?php Helpers::safe_print(ROOT); ?>assets/icons/icon-v2.css">
    
    <link rel="stylesheet" href="<?php Helpers::safe_print(ROOT); ?>assets/lib/reset.css">
    <link rel="stylesheet" href="<?php Helpers::safe_print(ROOT); ?>dist/index.css">
    
    <script src="<?php Helpers::safe_print(ROOT); ?>assets/vendor/require.js" data-main="dist/index" type="application/javascript" charset="utf-8"></script>
    <script type="text/javascript">
        requirejs.config({
            waitSeconds: 120
        });
    </script>
    
    <meta property="og:title" content="Using MariaDB Basic Example" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="/" />
    <meta property="og:image" content="<?php Helpers::safe_print(ROOT); ?>assets/images/xio-white.webp" />
    <meta property="og:description" content="" />
    <meta property="og:site_name" content="MariaDB sample" />
    <meta name="description" content="" />

    <link rel="apple-touch-icon" sizes="180x180" href="<?php Helpers::safe_print(ROOT); ?>assets/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php Helpers::safe_print(ROOT); ?>assets/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php Helpers::safe_print(ROOT); ?>assets/favicon-16x16.png">

    <title>MariaDB Sample</title>
</head>
<body class="">
    <nav>
        <div>
            <h3>MariaDB Sample</h3>
        </div>
    </nav>
    
    <div id="bg-cover" data-status="hide">
        
    </div>
    
    <?php if(Helpers::url_param("page") == 'program') : ?> <!-- Methods -->
    <div class="container form-page">
        <div>
            <div class="back-behavior">
                <a href="/index.php?page=intro" class="icon-arrow-left" alt="back to intro page"></a>
            </div>
            
            <!-- List -->
            <label class="labeled-cats">Your Favorite Cats:</label>
            
            <table class="cats-table">
                <thead>
                    <tr>
                        <td>No.</td>
                        <td>Name</td>
                        <td>Color</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody id="cat-list">
                    <!-- Available only if we don't have any data from database -->
                    <tr id="no-entries-dialog">
                        <td colspan="4">No entries</td>
                    </tr>
                    <tr data-item-id="123456">
                        <td>0</td>
                        <td>Louqui</td>
                        <td>White/Orange</td>
                        <td>
                            <div>
                                <button class="action edit-action icon-pen" data-item-id="123456"></button>
                                <button class="action delete-action icon-trash" data-item-id="123456"></button>
                            </div>
                        </td>
                    </tr>
                    
                    <tr data-item-id="123457">
                        <td>1</td>
                        <td>Muning</td>
                        <td>White/Orange</td>
                        <td>
                            <div>
                                <button class="action edit-action icon-pen" data-item-id="123457"></button>
                                <button class="action delete-action icon-trash" data-item-id="123457"></button>
                            </div>
                        </td>
                    </tr>
                    
                    <tr data-item-id="123457">
                        <td>1</td>
                        <td>Muning</td>
                        <td>White/Orange</td>
                        <td>
                            <div>
                                <button class="action edit-action icon-pen" data-item-id="123457"></button>
                                <button class="action delete-action icon-trash" data-item-id="123457"></button>
                            </div>
                        </td>
                    </tr>
                    
                    <tr data-item-id="123457">
                        <td>1</td>
                        <td>Muning</td>
                        <td>White/Orange</td>
                        <td>
                            <div>
                                <button class="action edit-action icon-pen" data-item-id="123457"></button>
                                <button class="action delete-action icon-trash" data-item-id="123457"></button>
                            </div>
                        </td>
                    </tr>
                    
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4">
                            <span class="icon-plus-circle" id="add-cat" alt="Add new favorite cat"></span>
                        </td>
                    </tr>
                </tfoot>
            </table>
            
            <!-- Add new Cat - Popup Interface Dialog -->
            <!-- We're also going to use this as our cat info editor -->
            <div id="add-cat-interface-dialog" class="" hidden>
                <div>
                    <label for="add-new-cat-name-input">Name of your cat:</label>
                    <input id="add-new-cat-name-input" type="text" name="name" value="" placeholder="Name" />
                    
                    <label for="add-new-cat-color-input">Color of your cat:</label>
                    <input id="add-new-cat-color-input" type="text" name="color" value="" placeholder="Color" />
                    
                    <div id="add-cat-msg-box">
                        Oppsss... Either field cannot be empty
                    </div>
                    
                    <div>
                        <button id="add-cat-confirmed" class="icon-check-square"></button>
                        <button id="add-cat-denied" class="icon-x-square"></button>
                    </div>
                </div>
            </div>
            
            <!-- Delete Dialog to Continue to delete data -->
            <div id="confirm-delete-dialog" data-status="hide" data-id="" hidden>
                <div>
                    <h3>You still love this cat?</h3>
                    <h4 id="delete-cat-name">Louqui</h4>
                    <div>
                        <button id="delete-confirmed" class="icon-check-square"></button>
                        <button id="delete-denied" class="icon-x-square"></button>
                    </div>
                </div>
            </div>

        </div>
    </div>
    
    <?php elseif(Helpers::url_param("page") == 'intro') : ?> <!-- Landing Page -->
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
                <a style="font-weight:600;" rel="noopener nofollow noreferrer" href="/index.php?page=program">Continue...</a>
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
    
    <?php else : ?> <!-- Start Up -->
        <div class="container">
            <div>
                <label>Opsss... You got it!</label>
                <p style="text-align: right;">Redirecting...</p>
            </div>
        </div>
    <?php endif; ?>
</body>
</html>


