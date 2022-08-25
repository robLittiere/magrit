## Contributing to Magrit

### Reporting issues

To report a bug or to suggest some enhancements, don't hesitate to create a issue on the dedicated bug tracker on github: [https://github.com/riatelab/magrit/issues](https://github.com/riatelab/magrit/issues).

### Repository structure

```
magrit                    <--- Magrit "root" folder
├── client                <--- JS/CSS/HTML source files
│   ├── css
│   ├── html
│   └── js
├── documentation         <--- Markdown files used for generating documentation
│   └── src
├── magrit_app            <--- Python source files
│   ├── helpers           <--- Python source files
│   └── static            <--- Static assets + compiled JS/CSS code
├── misc            
│   ├── Docker            <--- Example dockerfiles (using Nginx)
│   └── dockerfiles       <--- Dockerfile for automated build on DockerHub
└── tests                 <--- Test files (python)
```


### Translating to a new language

Internationalization is done using [i18next](https://www.i18next.com/).  
To translate Magrit to a new language you have to create a folder in the `magrit_app/static/locales` directory, using the language code of your language, and create a `translation.json` file in it, which will have the same stucture as the other translation files (such as `magrit_app/static/locales/en/translation.json`) and the appropriate translation for that language.


### Updating existing translation strings

Translation file are located in the `magrit_app/static/locales` folder and internationalization is done using [i18next](https://www.i18next.com/).  
Each folder matches a language and contains a `translation.json` file: you can edit theses `translation.json` files to fix errors on translation strings (basically any text in the application is comming from these translation files).

### Contributing documentation

The documentation is entirely written in *markdown* and translated to a webpage/book thanks to [**mdBook**](https://github.com/rust-lang-nursery/mdBook). It is located in the [documentation](https://github.com/riatelab/magrit/tree/master/documentation/) folder.  

After making a change on these `.md` files, you can run the mdbook binary from the aforesaid folder to build the new book:
```
mdbook build
```
The provided binary is only compatible with linux 64bits. If you're using another platform, please refer to [mdBook documentation](https://github.com/rust-lang-nursery/mdBook#installation) to install it.

The documentation is currently only available in French. Don't hesitate to contact us if you want to contribute another language.

### Setting up the development environnement


##### Installing the required libraries/software on your system for the server application:
* **Packages provided by `apt`, based on ubuntu 22.04:**
```
$ sudo apt-get install -y --no-install-recommends \
    software-properties-common gcc g++ \
    libpython3.10-dev python3.10 python3.10-dev python3-pip \
    libgeos-c1v5 libgeos-dev libgdal30 libgdal-dev libspatialindex-dev libffi-dev \
    nodejs npm redis-server libuv1 libuv1-dev unzip wget git \
    libxslt1.1 libxslt1-dev libxml2 libxml2-dev libkml-dev locales \
```

* **Python packages**
```
$ pip3 install -r requirements/dev.txt
```

* **Other tools needed: topojson**
```
$ sudo npm -g install topojson
```

##### Installing the required libraries for the client application:
Go in the `client` folder and run `npm install` (no need to be root) to install JS dependencies and the various packages required to build the JS code (such as `webpack`):  
```
$ cd client/
$ npm install
```


### Contributing JS/html/CSS code (client side)

Development version of JavaScript, CSS and HTML files are located in the `client` folder.
Transpilation from ES6 to ES5 (+ some other operations) are instrumented by `webpack`. Please refer to the `client/webpack.config.js` file and to [Webpack documentation](https://webpack.js.org/configuration/).
Once build, they are moved to the `magrit_app/static/` directory.


### Building JS/CSS code

Start the server application with `--dev` argument to watch for changes in JS/CSS files and replace them automatically :
```
./magrit_app/app.py --dev
```

If you already started the application server and/or just want to watch the file for changes you can go in the client folder
and run:
```
npm run watch
```

### Contributing python code (server side)

The main python file `app.py` is located in the `magrit_app/` directory and other python files are located in the `magrit_app/helpers/` directory.
Some `cython` files need to be compiled after modification. It can be done by running
`python3 setup.py build_ext --inplace` in Magrit root folder.

### Testing

The tests are intended to be played on Travis CI but also locally. We use [selenium](https://www.seleniumhq.org/) WebDriver to "talk" to the browser and automate testing actions.

Before running tests you need to download [ChromeDriver](http://chromedriver.chromium.org/downloads) and include its location in your `PATH` environment variable.

Then you can use `py.test` to run the test suite :

```
py.test tests/tests_web.py
```

If you are fixing a bug you should try to create a test case that exposes the bug before writing the fix. Then use that test case to verify that the bug is really fixed by your patch. 


### Contributing to the deployement recipes

Deployment recipes are located in the `misc` folder.  
In `misc/Docker` you will find the two docker-compose recipes (with and without HTTPS support) used to create and run the Magrit instance available on [our server] (http://magrit.cnrs.fr).
In `misc/dockerfiles` you will find the dockerfile used for the automated build on [Docker Hub](https://hub.docker.com/r/magrit/magrit/).


### Licencing

Magrit is available under the [CeCILL License](www.cecill.info).  
Some of the libraries it uses are under different licenses (see them in the [documentation](http://magrit.cnrs.fr/static/book/licenses_fr.html)).  
If you're contributing to Magrit, you're contributing CeCILL licensed code.  
