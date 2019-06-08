# Collaboramos

<img src="/resources/icon.png" width="400" />

## Install Instructions

- Install lastest version of `chrome` (version 75 minimum)
- Install `git` and `npm`
- Run `git clone https://github.com/godwinpang/Collaboramos.git` in directory of your choice
- In that directory, change directory to `Collaboramos` (`cd Collaboramos`)
- Now run these commands within `Collaboramos` directory
    + `npm install`
    + `ionic serve`
- Then open `chrome`
    - Visit the url `localhost:8100`
    - Right-click anywhere on page and click on "Inspect" (or CTRL-SHIFT-I)
    - Click on "Toggle Device Toolbar" in top-right of the DevTools (or CTRL-SHIFT-M)
    - On the "Device Toolbar", click on the dropdown menu where it initially says `Responsive` and change it to `iPhone 6/7/8`
        + If this option does not exist, reselect `Responsive` and change the width and height in the `Device Toolbar` to `375` and `667` respectively
    - Make sure to refresh the page at this point (the reason is that Chrome sometimes doesn't change the User-Agent to iPhone 6/7/8 and instead keeps it as Android)