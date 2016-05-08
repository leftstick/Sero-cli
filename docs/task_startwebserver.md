### Start a static web server for current working directory ###



- specify `port` number for the webserver. `8080` by default
- specify `paths` for less parser if `less` folder exist under `root`
- choose to enable `html5 push state mode`. `enable` by default


> only one `less` file `<root>/less/main.less` will be compiled into `<root>/css/`

> all files under `<root>` directory would be watched. If any change, notify browser, and if `less` files changed, re-compile them

> `port` will be remembered by `sero` from last time you use


```powershell
sero server -p <port> -l [less paths] [-h]
```
