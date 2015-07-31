### Build Javascripts into one 'main.js' ###

1. This operation has to be proceed at the root of your project
2. There has to be a `build.js` at `<root>/js/build.js`
3. Your code must follow AMD concept
4. Complied resources will be placed at `<root>/build`

#### Command ####

```powershell
sero build -u
```

> -u, --uglify  specify whether to uglify the compiled file

`sero` works perfect with `yeoman` generator: [generator-require-angular](https://github.com/leftstick/generator-require-angular)
