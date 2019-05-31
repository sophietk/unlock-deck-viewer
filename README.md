# unlock-deck-viewer

![Unlock](https://images-fr-cdn.asmodee.com/eu-central-1/filer_public/df/e3/dfe325d8-c061-4d68-9dbf-3e824e8f71e9/unlock_logo_940x400-02.png)

1. Find your next Unlock adventure deck on https://www.spacecowboys.fr/unlock-demos
2. Load the deck on the application
3. Flip cards, zoom and enjoy!

## Installation

    npm i unlock-deck-viewer

Ensure you have `convert`, `gs`, and `pdfinfo` (part of poppler) commands.

### Ubuntu

    sudo apt-get install imagemagick ghostscript poppler-utils

### OSX (Yosemite)

    brew install imagemagick ghostscript poppler

## Usage

    npm start

And go to http://localhost

## Next features

- show a spinner when flipping a card takes too long
- upload a custom pdf
