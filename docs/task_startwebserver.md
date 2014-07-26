### Start a static web server for current working directory ###



- `sero` current working directory will be used as the `root` directory of the webserver by default. You can specify one relative to current working directory 
- `port` is 8080 by default
- `livereload` will be enabled by default
- `less` files in `<root>/less/**/*` will be compiled into `<root>/css/`
- all files under `<root>` directory would be watched. If any change, notify browser, and if `less` files changed, re-compile them

> `port` will be remembered by `sero` from last time you use
