### Start a static web server for current working directory ###



- specify `root` directory of the webserver. `.` by default 
- specify `port` number for the webserver. `8080` by default
- specify `paths` for less parser if `less` folder exist under `root` 
- choose to enable `livereload`. `enable` by default


> only one `less` file `<root>/less/main.less` will be compiled into `<root>/css/`

> all files under `<root>` directory would be watched. If any change, notify browser, and if `less` files changed, re-compile them

> `port` will be remembered by `sero` from last time you use
