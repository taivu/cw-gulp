# Overview:
FE Workflow for Cyberwoven.

## Repo:
https://github.com/taivu/cw-gulp


## Front End Setup Notes:
1.) `git clone https://github.com/taivu/cw-gulp` into project/project theme folder.
2.) Run command in terminal `npm install` (_installs `node_modules` dependencies for gulp automation, includes SCSS compiling to css and setting up a browser sync server for CSS injection, which means no reloading to see updated styles_)
3.) Run command in terminal `gulp` to start watching SCSS files for changes and to start the browserSync server.

## Notes!

### Drupal
Fix css injection. inserts CSS in html as `<link>` instead of `@import`. this is temporary until browser-sync can inject with `@import` statements. 

[https://github.com/BrowserSync/browser-sync/issues/683](https://github.com/BrowserSync/browser-sync/issues/683)
[https://github.com/BrowserSync/browser-sync/issues/10](https://github.com/BrowserSync/browser-sync/issues/10)

*DISABLE BEFORE GOING INTO PRODUCTION*

_Add this to your `THEMENAME.theme` file for drupal 8, `functions.php` for drupal 7_

``` php
/**
 * Implements hook_css_alter().
 */

function immedion_css_alter(&$css) {
    foreach ($css as $key => $value) {
        $css[$key]['preprocess'] = FALSE;
    }
}
```


