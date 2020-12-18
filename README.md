# unlock-deck-viewer

![Unlock](https://images-fr-cdn.asmodee.com/eu-central-1/filer_public/df/e3/dfe325d8-c061-4d68-9dbf-3e824e8f71e9/unlock_logo_940x400-02.png)

1. Find your next Unlock adventure deck on https://www.spacecowboys.fr/unlock-demos
2. Choose the deck on the application
3. Flip cards, zoom and enjoy!

<img src="screenshot-01.png" height="200"> <img src="screenshot-02.png" height="200"> <img src="screenshot-03.png" height="200">


## Installation

    git clone https://github.com/sophietk/unlock-deck-viewer.git
    cd unlock-deck-viewer
    npm i

Ensure you have `convert`, `gs`, and `pdfinfo` (part of poppler) commands.

### Linux

    sudo apt install imagemagick ghostscript poppler-utils

If you get a `unable to open file` error, please check that the ImageMagick policy is well set for PDF files:
- edit file `/etc/ImageMagick-7/policy.xml`
- replace rights in line `<policy domain="coder" rights="none" pattern="PDF" />` by `read|write` instead of `none`.

### Mac OS

    brew install imagemagick ghostscript poppler

## Usage

    npm start

And go to http://localhost:4000
