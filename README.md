# Overview:
FE Workflow for Cyberwoven.


# Repo:
https://github.com/taivu/cw-gulp


# Front End Setup Notes:
1. `git clone https://github.com/taivu/cw-gulp` into project/project theme folder.
2. Pull `gulpfile.js` and `package.json` into theme folder root.
3. In theme folder, run command in terminal `npm install`.
4. Run command in terminal `gulp` to start watching SCSS files for changes and to start the browserSync server.


# Notes!


## StyleLint
Use `/* stylelint-disable-next-line */` to disable linting for the next line. Leave a reason for disabling as well.


## Drupal Theming
Fix css injection. Inserts CSS in html as `<link>` instead of `@import`. This is temporary until browser-sync can inject with `@import` statements. 

[https://github.com/BrowserSync/browser-sync/issues/683](https://github.com/BrowserSync/browser-sync/issues/683)
[https://github.com/BrowserSync/browser-sync/issues/10](https://github.com/BrowserSync/browser-sync/issues/10)


### Drupal 8
_Add this to your `THEMENAME.theme` file for drupal 8_

``` php
/**
 * Implements hook_css_alter().
 *
 * Disables @import CSS tags for compatibility with BrowserSync CSS injection while developing.
 */
function YOURTHEMENAME_css_alter(&$css) {

  // get value from settings/local.settings
  $is_css_preprocess = \Drupal::config('system.performance')->get('css')['preprocess'];

  // Aggregation must be disabled.
  if (!$is_css_preprocess) {

    // Disable @import on each css file.
    foreach ($css as &$item) {

      // Compatibility with disabling stylesheets in theme.info (263967).
      if (file_exists($item['data'])) {
        $item['preprocess'] = FALSE;
      }
    }
  }
}
```


### Drupal 7
_Add this to your `functions.php` for drupal 7_

``` php
/**
 * Implements hook_css_alter().
 *
 * Disables @import CSS tags for compatibility with BrowserSync CSS injection while developing.
 */
function YOURTHEMENAME_css_alter(&$css) {

  // Aggregation must be disabled.
  if (!variable_get('preprocess_css')) {

    // Disable @import on each css file.
    foreach ($css as &$item) {

      // Compatibility with disabling stylesheets in theme.info (263967).
      if (file_exists($item['data'])) {
        $item['preprocess'] = FALSE;
      }
    }
  }
}
```