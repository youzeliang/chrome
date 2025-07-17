# Black webSiteList

[中文说明 ()](./README.zh-CN.md)

A Chrome extension to help you block unwanted websites by maintaining a blacklist. Easily add the current site to your blacklist, subscribe to remote blacklist files, and avoid revisiting time-wasting or irrelevant pages.

## Features
- Add the current website to your blacklist with a single click or keyboard shortcut
- Subscribe to remote blacklist files (plain text, one URL per line)
- Remove sites from your blacklist via the popup UI
- Customizable sync interval for remote blacklist updates
- All data stored locally, privacy-friendly

## Installation
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select this project folder

## Usage
- Set a remote subscription URL (e.g. a raw GitHub text file)  https://raw.githubusercontent.com/youzeliang/chrome/master/file.txt 
- Add the current site to the blacklist using the popup or the shortcut (default: Option + 1 on Mac)
- Remove sites from the blacklist in the popup
- Adjust the sync interval for remote blacklist updates

## License
MIT

