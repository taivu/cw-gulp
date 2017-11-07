# cw-gulp

The Front End workflow for Cyberwoven.

## Repo

https://github.com/taivu/cw-gulp

## Front End Setup Notes

1. Clone this repo into your drupal project's theme folder: `git clone https://github.com/taivu/cw-gulp`.
2. Rename folder `cw-gulp` to `YOUR_DOPE_THEME_NAME`, where `YOUR_DOPE_THEME_NAME` is your drupal theme's name.
3. Change directory into your theme: `cd YOUR_DOPE_THEME_NAME`.
4. Install development dependencies: `npm install`.
5. Start default gulp task: `gulp` to start the `browserSync` server and start watching files for changes.


## Notes!

### StyleLint

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
