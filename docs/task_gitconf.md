### Configure git options for current working directory ###

following stuff would be set for current working directory

```shell
git config --local user.name "<name>"
git config --local user.email "<email>"
git config --local core.excludesfile $HOME/.gitignore
git config --local core.autocrlf input
git config --local color.ui true
git config --local gui.encoding utf-8
git config --local push.default tracking
git config --local branch.autosetupmerge always
git config --local branch.autosetuprebase always
git config --local alias.co checkout
git config --local alias.st status
git config --local alias.br branch
```

> Note: The terminal will ask you for the `<name>` and `<email>`