# Публикация в GitHub Pages

Сайт готов для публикации без сборки. `.nojekyll` отключает обработку Jekyll, `.gitignore` исключает оригиналы в `figure/`, черновики и служебные файлы. Браузерные версии документов и видео из `materials/` отправляются вместе с сайтом.

## 1. Создать репозиторий

В GitHub нажмите **+ → New repository**. Назовите репозиторий точно `<ваш-логин>.github.io`, выберите **Public**. Не добавляйте README, .gitignore или лицензию при создании: локальная папка уже содержит файлы.

Если ваш логин `MakVlad2003`, имя репозитория — `MakVlad2003.github.io`, адрес сайта — `https://makvlad2003.github.io/`.

## 2. Отправить файлы

В терминале:

```sh
cd /Users/vld_mkrv/Documents/CV
git init -b main
git config user.name
git config user.email
```

Проверьте имя и адрес автора. Если они не заданы или неправильные, установите свои значения для этой папки (адрес из GitHub Settings → Emails, можно GitHub noreply):

```sh
git config user.name "Ваше имя"
git config user.email "Ваш подтверждённый email или GitHub noreply"
```

Затем, заменив `YOUR_USERNAME` своим логином:

```sh
git add .
git status --short
git commit -m "Publish personal website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git push -u origin main
```

Для входа в GitHub используйте GitHub Desktop, `gh auth login` (если GitHub CLI уже установлен) или другой настроенный способ авторизации Git. Обычный пароль аккаунта не используется для HTTPS push.

## 3. Включить Pages

В репозитории: **Settings → Pages → Build and deployment**.

- **Source:** Deploy from a branch.
- **Branch:** main.
- **Folder:** /(root).
- Нажать **Save**.

После публикации GitHub покажет адрес сайта. Развёртывание может занять до 10 минут. Проверьте RU/EN, тему, CV и материалы со слайдами.

## 4. Добавить ссылку в профиль

На странице своего профиля нажмите **Edit profile**. В поле **Website** вставьте `https://YOUR_USERNAME.github.io/` и сохраните. Также можно указать ссылку в **Settings → Public profile → URL**.

Необязательно: в README профиля можно добавить:

```md
[Personal website / CV](https://YOUR_USERNAME.github.io/)
```

В самом репозитории можно указать тот же адрес через **About → ⚙ → Website**, чтобы ссылка была видна рядом с описанием репозитория.

## Последующие обновления

После правок в локальной папке:

```sh
git add .
git commit -m "Update personal website"
git push
```

GitHub Pages обновит сайт автоматически.

Официальные инструкции:
- https://docs.github.com/en/pages/quickstart
- https://docs.github.com/en/account-and-profile/tutorials/personalize-your-profile
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github
