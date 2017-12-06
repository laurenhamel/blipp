# Blipp

Blipp is a pluggable markdown blog built on top of its very own API. It's designed to make blogging super simple for the common people while still offering techies a high level of scalability and extensibility all in an easy-to-use package. It's intended to be "plugged in" to any new or existing site with ease.

## How It Works

Blipp is databaseless. Instead, it relies entirely on your blog's file system, where publishing a new post is as easy as uploading a new markdown file to your blog's post directory. Blipp uses **Markdown** as its preferred method of formatting for its ease of use and writing flow combined with its web compatability. Bloop also comes with it's own public API, making data retrieval sophisticated yet effortless. For more information on how Blipp operates and what's powering the blogging system, read [Behind the Scenes](//github.com/laurenhamel/blipp/wiki/Behind-the-Scenes).

## What is Markdown

Markdown is a formatting syntax designed for use alongside plain text. Its syntax is simple and memorable, and writers tend to find that it makes expressing one's thoughts easier and more free flowing without the worry of distractions or disruptions in workflow. Markdown also allows its users to know very little about actual web-based markup, making it an ideal solution for individuals from all backgrounds to start blogging in an instant. For a detailed guide on the Markdown syntax rules supported by Blipp, refer to the [Markdown Cheatsheet](//github.com/laurenhamel/blipp/wiki/Markdown-Cheatsheet).

## Getting Started


- [Installing Blipp](#installing-blipp)
- [Customizing Blipp](#customizing-blipp)
- [Configuring Blipp](#configuring-blipp)
- [Integrating Blipp](#integrating-blipp)
- [Working with Posts](#working-with-posts)
- [Working with Authors](#working-with-authors)

### Installing Blipp

Blipp is designed with simplicity in mind. As long as PHP is up and running within your environment, setup should be a breeze. Simply follow the steps below:

1. Download the [latest release](/releases/latest) of Blipp.

2. Extract the zip (`.zip`) file once downloaded.

3. If you wish to customize your instance of Blipp, refer to [Customizing Blipp](#customizing-blipp).

> Note, customizing Blipp is only recommended for advanced users.

4. Follow the steps in the section on [Configuring Blipp](#configuring-blipp).

5. Integrate Blipp into your site by following the steps in [Integrating Blipp](#integrating-blipp).


### Customizing Blipp

Blipp was designed with customization in mind. Maybe you're interested in making changes to the appearance of your blog, or maybe you're a more advanced user and want to change the way Blipp handles your blog entirely. Either way, Blipp can be customized to fit your needs regardless of what those might be. When you download and extract Blipp's source files, you'll notice an `src/` folder is included. Any customizations should be made to only the files contained within that `src/` folder.

#### Prerequisites

Before you're able to start customizing Blipp, you'll first need to setup a compatible development environment. Blipp requires [Node.js](https://nodejs.org/) and its accompanied `npm` package manager for installing and managing project dependencies, such as [Grunt](https://gruntjs.com/).

#### Customizing the Appearance

Blipp uses [Sass](http://sass-lang.com) for its CSS definitions. These styles are then compiled by Grunt and passed through [Autoprefixer](https://github.com/postcss/autoprefixer) to automagically add any necessary vendor prefixes. These compiled stylesheets are then output as `.css` files to the `demo/css/` folder for previewing your project during development. Thus, you can modify the appearance of your Blipp blog by editing the `.scss` files found in the `src/scss/` folder. 

  > Note, the `vends/` subfolder found at `src/scss/` contains a set of third-party Sass libraries that should not be removed unless you wish to completely overhaul your blog's appearance.

To begin making changes to Blipp's appearance, you'll first need to open a terminal window and run the `grunt dev` command, or more simply just the `grunt` command, which defaults to `grunt dev`. This will start a development environment complete with livereloading, which allows you to preview any stylistic changes you make in real-time. During development, Grunt will create a `demo/` folder, which is a working example of your Blipp blog and where livereloading will take place. To preview this Blipp demo, you'll need to navigate to your project's `demo/` path within your browser window, such as `http://localhost/<project_directory>/demo/`.

Once you've made all of your desired changes to Blipp's appearance, you'll then need to create a production-ready version of your project. This can be done by executing the `grunt dist` command from a terminal window, which will create a `dist/` folder containing your production-ready files. At that point, you should then be prepared to move on to the next step in the [Installing Blipp](#installing-blipp) process or continue to personalize your blog by [Customizing the Structure](#customizing-the-structure) and/or [Customizing the API](#customizing-the-api) of your Blipp project.

#### Customizing the Structure

Blipp uses several Grunt tasks to help in compiling the final blog structure. This allows Blipp's file organization during development to be more practical than it is straightforward. As a forewarning, if you don't have prior experience working with Vue.js or Grunt and/or you're unfamiliar with any of the Grunt tasks that Blipp uses for development, which can be found in the `package.json` file, it's recommended that you first familiarize yourself with these technologies prior to proceeding. Nevertheless, you should always proceed with caution and only make changes to the files found in the `src/` folder.

Within the `src/` folder, Blipp's file organization is intended to be mostly intuitive with the contents of each subfolder being relatively self-explanatory. Blipp's main HTML file, `blog.html`, can be found at the root of the `src/` directory. This file is used to aggregate the blog's partials, which can found within the `includes/` folder. There, the `meta/` folder is used for the core pieces contributing to the blog's physical structure, and the `templates/` directory includes the markup for each specific Vue.js component used by Blipp. 

As previously mentioned, Blipp uses Vue.js, which powers its user interface. Blipp's core JavaScript file is `blog.js`, which can be found within the `js/` subfolder of the `src/` directory. Within `blog.js`, you will find the complete front-end code behind Blipp, including the markup for all of its Vue.js components. Note, these components correspond to the Vue.js templates that can be found within the `src/includes/templates/` folder.

Thus, to customize the HTML structure of Blipp, you will mostly be working out of the `includes/` folder. You may wish to customize Blipp's HTML structure, if you wish to move pieces of data around or make use of additional meta data (see [Configuring Blipp](#configuring-blipp) for information about meta data). Otherwise, to modify how Vue.js handles your blog data, you'll want to work out of the `blog.js` file found within the `js/` subfolder. You may wish to customize the functionality of Blipp if want to add in additional components, modify how existing components work and/or process and use data, change the default limitations imposed on feed data, modify how page titles are displayed, and/or the likes.

#### Customizing the API

Blipp comes with its very own API, which was designed to be fairly extensible. If you wish to improve upon the current API implementation, you're able to do so freely within your own Blipp project. The API is housed within the `php/` subfolder found in the `src/` directory, and changes to the API can be made on a number of levels: To customize how your Markdown files are processed, look for the `Markdown.class.php` file within the `classes/` folder. To customize how meta data is processed, look for the `Meta.class.php` file within the `classes/` folder. To customize the API itself, for instance, in order to add additional endpoints or support for additional methods, look for the `API.class.php` file within the `classes/` folder. To add in additional extensions to the Markdown parser, create additional extensions like those found in the `extensions/` folder, where the file name correlates to the name of your new extension. More than likely, these will be the main API touchpoints that you will want to customize.

### Configuring Blipp

Prior to plugging Blipp into your site, you'll need to make a few configurations that will be specific to your blog setup. Blipp uses a set of JSON files along with an optional `.htaccess` for configuration. Samples of these files can be found within the `test/` directory of your Blipp project, which can be used as template to assist you in creating your own configuration files. However, it's recommended that no changes be made directly to the contents of the `test/` directory unless you are [Customizing Blipp](#customizing-blipp). Instead, a similar set of configuration files are provided in the `dist/` folder, which you can make changes to. Later, these files within the `dist/` folder will be used for [Integrating Blipp](#integrating-blipp).

The first JSON file is `meta.json`, which is used to store meta data about your blog. At the very least, all blogs should contain a title (string), description (string), owners (array), contributors (array), date formats (object), and optional social sharing sources (array). If you are [Customizing Blipp](#customizing-blipp), you also may wish to add some additional meta data to suite your particular needs. This `meta.json` will need to be updated with the relevant information pertaining to your blog. 

The second JSON file is `router.json`, which is used to identify the routes, or paths, to relevant directories that Blipp relies. In addition to route definitions, `router.json` is also used to define the prefixes that get added to various page titles when users navigate to that specific page type. For instance, if a user visits the tag feed of your blog, by default, the page's title will read `<blog_title> | #<tag>`, where `<blog_title>` is the name of your blog as defined in the `meta.json` file, `#` is the prefix, and `<tag>` is the equivalent tag name. This `router.json` file will need to be updated accordingly for your specific setup. This means that all routes should be updated to point to their target paths, and prefixes should be adjusted according to your preferences.

Optionally, an `.htaccess` file can be used if you wish to create a vanity URL for your blog's API. If you decide to use an `.htaccess` file, you can use one of the templates below to setup your API's vanity URL to point to a specific path from the root of your domain, such `www.example.com/api` or `api.example.com`:

**Vanity URL using a path, such as `www.example.com/api`:** 
```apache
RewriteEngine On
RewriteBase /

RewriteCond %{HTTP_HOST} ^(www\.)?<domain_name>\.<domain_ext>$ [NC]
RewriteCond %{REQUEST_URI} ^/<vanity_path_to_api>api(\.php)?/(.*)$ [NC]
RewriteRule ^api/(.*)$ <real_path_to_api>/$1 [QSA]
```
**Vanity URL using a subdomain, such as `api.example.com`:**
```apache
RewriteEngine On
RewriteBase /

RewriteCond %{HTTP_HOST} ^(<subdomain_name>\.)?<domain_name>\.<domain_ext>$ [NC]
RewriteRule ^(.*)$ http://<real_path_to_api>/$1 [QSA]
```

In the examples above, the `<domain_name>` and `<domain_ext>` would be replaced with your actual domain name and extension, such as `example` and `com`, respectively, for `example.com`. The `<vanity_path_to_api>` would be replaced with a folder path, such as `v1/`, which would produce a vanity URL such as `example.com/v1/api`. Alternatively, the `<vanity_path_to_api>` can be removed entirely to just use `/api` in your vanity URL, such as `example.com/api`. The `<real_path_to_api>` would need to be replaced with that actual path to the `api.php` file (or just to `api` if you have `Multiviews` enabled). Likely, `<real_path_to_api>` will end up being `php/api.php` (or shortened to `php/api` with `Multiviews`). 

The key difference to note in the second example is that the `www` in the first example should be replaced with your vanity URL's preferred `<subdomain_name>`. It's also worth nothing that if you wish to create a redirect to any of the above addresses, you can also replace `[QSA]` in the last line with `[R=301,QSA]`, which will create a permanent redirect to the given location.

  > Whether or not you use an `.htaccess` file, or any other form of generating a vanity URL to point to your blog's API is largely up to you. While it helps to make your API's endpoints a bit more memorable, it's certainly not mandatory. Regardless of whether or not you adopt this approach or not, you'll always need to update the path to your blog's API file (`api.php`) within your `router.json`.

### Integrating Blipp

Blipp is designed to be "pluggable", meaning that you can easily plug it in to any new or existing site. Integrating Blipp into a site simply requires that the necessary HTML, JS, CSS, PHP, and other assets be copied over to your server. This also means that Blipp is not intended to serve as your blog in and of itself, but rather, it's meant to be inserted somewhere within your site. Within your Blipp project, you'll notice a `dist/` folder, which is used to supply production-ready files that can be integrated into your site. Below is a step-by-step guide on how to proceed with integration:

1. Upload the following files from the `dist/` folder to the root directory of your blog site.

  - `meta.json` 
  - `router.json`

  > Note, if you made any customizations during the [Customizing Blipp](#customizing-blipp) stage that affects the intended placement of these files, you will need to move these them accordingly to their target location.

2. Upload the following folders from the `dist/` folder to the root directory of your blog site.

  - `css/`
  - `js/`
  - `php/`
  - `fonts/`

  > Note, if you made any changes during the [Customizing Blipp](#customizing-blipp) and/or [Configuring Blipp](#configuring-blipp) stages that affect the intended placement of these folders, you will need to move them accordingly to their target location.

3. Create the following folders at the destinations specified in your `router.json` file.

  - `authors/`
  - `drafts/`
  - `posts/`

  > By default, if you did not make any changes to the `router.json` file during the [Configuring Blipp](#configuring-blipp) stage, these folders should be created within the root directory of your blog site.

4. Copy the markup from `dist/blog.html` and paste it somewhere within the `<body>` section of your blog site's home page (likely `index.html`).

5. Copy the markup from `dist/head.html` and paste it into the `<head>` section of your blog site's home page.

6. Copy the markup from `dist/foot.html` and paste it immediately before the closing `</body>` tag within your blog site's home page.

7. You're now ready to blogging.