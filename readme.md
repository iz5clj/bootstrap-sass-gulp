# BOOTSTRAP SASS GULP
Basic startup for a simple website based on **bootstrap 3**(css framework), **sass** (css preprocessor) and **gulp** (task manager).

## Requirements
I highly recommend using [nvm](https://github.com/creationix/nvm) (node version manager)

You need **gulp** to be installed globaly: [sudo]npm install -g gulp

You need **bower** to be installed globaly: [sudo]npm install -g bower

## Installation

Run:

    npm install
This command will do the following:

1. Install gulp, bower and all dependencies
2. Run bower install
3. Run gulp copy to copy some necessary files from bower_components to resources

## Tasks

To start the webserver:

    gulp serve

To compile the sass files

    gulp sass

To concat all javascript files

    gulp javascript    

To create your pages(panini)

    gulp pages

## TODO
