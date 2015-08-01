### Configure git options for current working directory ###

following stuff would be set for current working directory

```shell
git config --local user.name "<name>"
git config --local user.email "<email>"
git config --local core.excludesfile $HOME/.gitignore
git config --local core.autocrlf input #true for windows
git config --local core.ignorecase false
git config --local color.ui true
git config --local gui.encoding utf-8
git config --local push.default simple
git config --local branch.autosetupmerge always
git config --local branch.autosetuprebase always
git config --local alias.co checkout
git config --local alias.st status
git config --local alias.br branch
git config --local alias.ci commit',
git config --local alias.cp cherry-pick',
git config --local alias.df diff,
git config --local alias.lo log --oneline,
git config --local alias.pr pull --rebase,
git config --local alias.pl pull,
git config --local alias.ps push
```

> The terminal will ask you for the `<name>` and `<email>`
> The `sero` will remember what the `<name>` and `<email>` were from last time you use.

#### Command ####

```powershell
sero git -u <username> -e <email>
```
