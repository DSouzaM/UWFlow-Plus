# UWFlow-Plus
>A Chrome extension which adds UWFlow information to ugradcalendar.uwaterloo.ca pages.<hr>

![Screenshot of hover and right click functionality](/res/screenshot.png)
##Table of Contents
* [Functions](#functions)
* [Installation](#installation)
* [Credits](#credits)


## <a name="functions"></a>Functions
This extension works as a page script on pages on the [ugradcalendar domain](http://ugradcalendar.uwaterloo.ca). When the user hovers over a course, the extension creates a hovering frame which fetches information from [UWFlow](https://uwflow.com) about the given course. There is also a right-click option added to these links for convenience which opens the corresponding UWFlow page in a new tab.
## <a name="installation"></a>Installation
* The extension is available for download in the [Chrome Web Store](https://chrome.google.com/webstore/detail/uwflow%2B/llnblgljihfinogpenmcjjleabnjkgfn/). 

The extension can also be installed via the source files. 
* Clone the repository
* Navigate to the extensions page (chrome://extensions/)
* Check off "Developer mode" in the top right
* Click "Load unpacked extension..."
* Select the folder (includes html, res, scripts, and styles folders as well as manifest.json)
* Find your program on [ugradcalendar](ugradcalendar.uwaterloo.ca/) and hover over the courses to see it in action! (try a [sample page](http://ugradcalendar.uwaterloo.ca/page/ENG-Software-Engineering))

## <a name="credits"></a>Credits
This extension is not directly affiliated with UWFlow. Some resources have been borrowed from UWFlow with respect to their [open source policy](http://blog.uwflow.com/post/78088794292/flow-is-now-open-sourced). Thanks go out to the creators of UWFlow for developing such a valuable platform and making it available to all.

[UWFlow's GitHub page](https://github.com/UWFlow)

