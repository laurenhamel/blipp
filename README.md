# Blipp

Blipp is a pluggable markdown blog built on top of its very own API. It's designed to make blogging super simple for the common people while still offering techies a high level of scalability and extensibility all in an easy-to-use package, and it's intended to be "plugged in" to any new or existing site with ease. 

## How It Works

Blipp is databaseless. Instead, it relies entirely on your blog's file system, where publishing a new post is as easy as uploading a new markdown file to your blog's post directory. Blipp uses **Markdown** as its preferred method of formatting for its ease of use and writing flow combined with its web compatability. For more information on how Blipp operates and what's powering the blogging system, read [Behind the Scenes](//github.com/laurenhamel/blipp/wiki/Behind-the-Scenes).

## What is Markdown

Markdown is a formatting syntax designed for use alongside plain text. Its syntax is simple and memorable, and writers tend to like it because it makes express one's thoughts easier and more streamlined without the worry of distractions or disruptions in workflow. Markdown also allows its users to know very little about actual web-based markup, making it an ideal solution for individuals from all backgrounds. For a detailed guide on the Markdown syntax rules supported by Blipp, refer to the [Markdown Cheatsheet](//github.com/laurenhamel/blipp/wiki/Markdown-Cheatsheet).

## Getting Started

- [Installing Blipp](#installing-blipp)
- [Customizing Blipp](#customizing-blipp)
- [Configuring Blipp](#configuring-blipp)
- [Integrating Blipp](#integrating-blipp)
- [Working with Posts](#working-with-posts)
- [Working with Authors](#working-with-authors)

### Installing Blipp

Blipp is capable of running on top of your traditional server environment. As long as PHP is up and running within your environment, setup is a breeze. Simply follow the steps below:

1. Download the [latest release](/releases/latest) of Blipp.
2. Extract the zip (`.zip`) file once downloaded.
3. If you wish to customize your instance of Blipp, refer to [Customizing Blipp](#customizing-blipp).
4. Follow the steps in the section on [Configuring Blipp](#configuring-blipp).
5. Integrate your Blipp into your site by following the instructions on [Integrating Blipp](#integrating-blipp).

### Customizing Blipp

Blipp was designed with customization in mind. Maybe you're interested in making changes to the appearance of your blog, or maybe you're a more advanced user and want to change the way Blipp handles your blog posts entirely. Either way, Blipp can be customized to fit your needs regardless of what those might be. When you download and extract Blipp's source files, you'll notice an `src/` folder is included. Any customizations should be made to only the files contained within that `src/` folder.

#### Prerequisites

Before you're able to customize Blipp, you'll first need to setup a compatible development environment. Blipp requires [Node.js](https://nodejs.org/) and its package manager for installing both front-end and development dependencies, such as [Grunt](https://gruntjs.com/).

#### Customizing the Appearance

Blipp uses the Sass preprocessor in conjunction with Autoprefixer to generate its CSS stylesheets. You can modify the appearance of your Blipp blog by editing the files found in the `src/scss/` folder. Do note, however, that the `vends/` subfolder found at this location includes third-party Sass libraries that should not be removed unless completely overhauling your blog's appearance and, thus, starting from scratch. 

Blipp uses Grunt to generate the required stylesheets for your blog. Grunt outputs these files to the `css/` directory located at the root of your project. Grunt is also configured for live previewing of any stylistic changes you make during development. Thus, you should use the `grunt dev` or `grunt` (defaults to `grunt dev`) command to watch for changes. Otherwise, to perform a one-off compilation of your Sass markup and to create a production-ready version of your project, use `grunt dist` instead.

#### Customizing the Structure

Blipp uses Vue.js to dynamically create its user interface. In addition, Blipp also uses several Grunt tasks to help in compiling the blog structure. As a forewarning, if you don't have prior experience working with Vue.js or Grunt and/or you're unfamiliar with any of the Grunt tasks that Blipp uses during devleopment, which can be found in the `package.json` file, it's recommended that you first familiarize yourself with these technologies prior to proceeding. Nevertheless, you should always proceed with caution and only make changes to the files found in the `src/` folder.

When attempting to customize Blipp's structure, you'll first need to understand the file and folder layout of the `src/` directory. The `index.html` file is used as an aggregator for the contents found in the `includes/` subfolder, and the `includes/` subfolder contains the various HTML components of the blog system. A more in-depth description of each file found within the `includes/` directory is provided below:

- `author.html`

   The contents of the author template used for the Vue.js author component and author pages.
  
- `blog.html`

  The root structure of the blog, which includes its view layer.
  
- `category.html`

  The contents of the category template used for the Vue.js category component and category feed.
  
- `feed.html`

  The contents of the feed template used for the Vue.js feed component and main blog feed.
  
- `foot.html`

  The required footer data for the blog.
  
- `head.html`

  The required header data for the blog.
  
- `loading.html`

  The contents of the loading template used for the Vue.js loading component and loading animation.
  
- `post.html`

  The contents of the post template used for the Vue.js post component and post pages.
  
- `snippet.html`

  The contents of the snippet template used for the Vue.js snippet component and post excerpts on feeds.
  
- `tag.html`

  The contents of the tag template used for the Vue.js tag component and tag feed.
  
- `template.html`

  An aggregator for all template data. 
  
  
The remaining contents of the `src/` folder is relatively self-explanatory with the `js/` folder containing relevant JavaScript files, `scss` containing relevant Sass files, and so forth. 

To customize the HTML structure of Blipp, you will mostly be working out of the `includes/` subfolder. You may wish to customize Blipp's HTML structure, if you wish to move pieces of data around or make use of additional meta data (see [Configuring Blipp](#configuring-blipp) for additional information on meta data). Otherwise, to modify how Vue.js handles your blog data, you'll want to work out of the `blog.js` file found within the `js/` subfolder. You may wish to customize the JS structure of Blipp if want to add in additional components, modify how existing components work or the data that they use, change the ten-item limit imposed on feed data by default, modify how page titles are displayed, or the likes.

#### Customizing the API

Blipp comes with its very own API, which was designed to be fairly extensible. If you wish to improve upon the current API implementation, you're able to do so freely within your own Blipp project. The API is housed within the `php/` subfolder found in the `src/` directory, and changes to the API can be made on a number of levels: To customize how your Markdown files are processed, look for the `Markdown.class.php` file within the `classes/` folder. To customize the API itself, for instance, in order to add additional endpoints or support for additional methods, look for the `API.class.php` file within the `classes/` folder. To add in additional extensions to the Markdown parser, create additional extensions like those contained in the `extensions/` folder, where the file name will correlate to the name of your new extension. More than likely, these will be the main API touchpoints that you will want to edit.

### Configuring Blipp

Prior to plugging Blipp into your site, you'll need to make a few configurations to Blipp that will be specific to your blog setup. Blipp uses a set of JSON files along with an optional `.htaccess` for configuration. The first JSON file is `meta.json`, which is used to store meta data about your blog. At the very least, all blogs should contain a title (string), description (string), owners (array), contributors (array). If you are [Customizing Blipp](#customizing-blipp), you also may wish to add some additional meta data to suite your particular needs. 

The second JSON file is `router.json`, which is used to identify the routes, or paths, to relevant directories that Blipp relies. In addition to route definitions, the `router.js` is also used to define the prefixes that get added to various page titles when users navigate to that specific page type. For instance, if a user visits the tag feed of your blog, by default, the page's title will read `<blog_title> | #<tag>`, where `<blog_title>` is the name of your blog as defined in the `meta.json` file, `#` is the prefix, and `<tag>` is the equivalent tag name.

Optionally, an `.htaccess` file can be used if you wish to create a vanity URL for your blog's API. If you decide to use an `.htaccess` file, you can use the template below to setup your API's vanity URL to point to a specific path from the root of your domain, such `www.example.com/api`:

```apache
RewriteEngine On
RewriteBase /

RewriteCond %{HTTP_HOST} ^(www\.)?<domain_name>$ [NC]
RewriteCond %{REQUEST_URI} ^/<vanity_path_to_api>api(\.php)?/(.*)$ [NC]
RewriteRule ^api/(.*)$ <real_path_to_api>/$1 [QSA]
```

In the example above, the `<domain_name>` would be replaced with your actual domain name and extension, such as `example.com`, the `<vanity_path_to_api>` would be replaced with a folder path, such as `v1/` or removed entirely to use the path `/api` with your preferred vanity URL; in the former scenario, your vanity URL would look like `example.com/v1/api` versus `example.com/api` in the latter. Lastly, the `<real_path_to_api>` would be replaced with that actual path to the `api.php` file (or, more simply, to `api` if you have `Multiviews` enabled). Likely, `<real_path_to_api>` will end up being `php/api.php` (or `php/api` with `Multiviews`). 

Alternatively, you may prefer to create a vanity URL using a subdomain instead. If you choose to go this route, you could use the following `.htaccess` template instead:

```apache
RewriteEngine On
RewriteBase /

RewriteCond %{HTTP_HOST} ^(<subdomain_name>\.)?<domain_name>$ [NC]
RewriteRule ^(.*)$ http://<real_path_to_api>/$1 [QSA]
```

The key difference to note in the above example is that there is that the former `www` should be replaced with your vanity `<subdomain_name>`. Additionally, if you wish to create a redirect to any of the above addresses, you can also replace `[QSA]` in the last line with `[R=301,QSA]`, which will create a permanent redirect to the given location.

### Integrating Blipp

Blipp is designed to be "pluggable", meaning that you can easily plug it in to any new or existing site. Integrating Blipp into a site simply requires that the necessary HTML, JS, CSS, PHP, and assets be copied over to your server. Below is an outline of the folders and files that you will need to plug in:

```
+ authors/
|
+ css/
+--- ...
|
+ fonts/
+--- ...
|
+ dist/
+--- blog.html
+--- foot.html
+--- head.html
|
+ js/
+--- ...
|
+ meta.json
| 
+ php/
+--- ...
|
+ posts/
+--- ...
|
+ router.json
```

The `js/`, `css/`, `fonts/`, and `php/` folders along with the `router.json` and `meta.json` files should be uploaded directly to the root of your blog site unless you have made customizations to your Blipp structure that otherwise affects this placement (see [Customizing Blipp](#customizing-blipp)). The `authors/`, `drafts/`, and `posts/` folders should be placed in the locations specified by your `router.json`. If you did not make any modifications to your `router.json` file, then, by default, these directors should be placed at the root of your blog site as well.

Lastly, to finish integrating Blipp into your site, you'll need to plug in the markup contained within the HTML files in the `dist/` folder into your blog site's HTML. In other words, you'll need to copy the contents of the files inside the `dist/` folder and paste that markup somewhere within your site. The `head.html` file contains some markup that should be placed within the `<head>` section of a page. The `foot.html` file contains some markup that should be placed just before the closing `</body>` tag within a page, and the `blog.html` file contains the actual markup to get your blog up and running. That's it.

