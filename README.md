# Collaboramos

<p align="center">
    <img src="/resources/icon.png" width="300" alt="Collaboramos Logo" />
</p>

## Introduction
"I have no experience in this" or "I don't know enough people to create a team" are often some of the major headaches that students face trying to find a project to work on or people to work with. Starting a project traditionally has been both time-consuming and stressful. On one hand, students looking for projects need to search for projects by joining several different clubs. On the other hand, people who have a good project idea need to ask around for people who are both able and willing to participate. Precious time is then lost through these tasks which could be used for developing the project. To solve this problem, `Collaboramos` has created an easy and efficient way to join projects and recruit people. Our app helps people join projects and gain experience, helps project managers gather people with sufficient ability and interest in the project, and enables communication between the two parties.

## Video
[Link!](https://www.youtube.com/watch?v=prjgAlCQuls)

## Requirements
- Working Mac computer
- Internet connection

## How to Install
- Install latest version of `chrome` (version 75 minimum)
- Install latest versions of `git` and `npm`
- Install latest version of `ionic` using the command `npm install -g ionic`
- Run `git clone https://github.com/godwinpang/Collaboramos.git` in directory of your choice

## How to Run
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

## Test Account Login Credentials
| **Profile Email** | **Password** |
|:-----------------|:-------------|
| test@duplicateprofile.com | 123123123 |
| test@project.com* | 123123123 |
| test@candidate.com | 123123123 |
| test@switch.com | 123123123 |
| test@delete.com | 123123123 |
| joe@boe.com | 123123123 |

*to be created by testers

## Known Bugs
- Runtime errors may occur with an `ionic` error message when sending messages on the same build. That is, when accessing the app to two screens using the same `ionic serve` command. To avoid this bug when, log out of the sender account, re-run the application using the instructions above, and log into the recipient account. Or use two separate computers with one instance of the app on each to send and receive messages in real-time.
- For other runtime errors, please click `Close` on the top left corner. We guarantee that the functionality is still the same.
- Don't swipe right on the candidate or project profile associated with the logged in account.
- Don't switch profiles more than a couple times. This thins the stack of profiles to swipe on. If you do, then log out and log back in.

## In-Case of Crash
- Stop the `ionic serve` execution (CTRL-C it)
- Re-run `ionic serve` in `Collaboramos` directory
- Then open `chrome`
    - Visit the url `localhost:8100`
    - Right-click anywhere on page and click on "Inspect" (or CTRL-SHIFT-I)
    - Click on "Toggle Device Toolbar" in top-right of the DevTools (or CTRL-SHIFT-M)
    - On the "Device Toolbar", click on the dropdown menu where it initially says `Responsive` and change it to `iPhone 6/7/8`
        + If this option does not exist, reselect `Responsive` and change the width and height in the `Device Toolbar` to `375` and `667` respectively
    - Make sure to refresh the page at this point (the reason is that Chrome sometimes doesn't change the User-Agent to iPhone 6/7/8 and instead keeps it as Android)

## Team
- Project Manager -- *Godwin Y Pang*
- Business Analyst -- *Ashvin Chellasamy*
- User Interface Specialist -- *Vu Thanh Dang*
- Quality Assurance Lead -- *"Shane" Siheng Li*
- Software Development Lead -- *Spencer Xin Sheen*
- Software Development Lead -- *Justin Q Tang*
- Database Specialist -- *"Thomas" Yanxi Tang*
- Software Architect -- *Ganesh Valliappan Kathiresan*
- Senior System Analyst -- *"Vivian" Lan Wei*
- Algorithm Specialist -- *"Kevin" Zhuowen Zou*


