/*jslint node: true, white: true, nomen: true, plusplus: true, sloppy: true*/

var fs = require("fs"),
    Handlebars = require("handlebars");

function validateArray(arr) {
    return arr !== undefined && arr !== null && arr instanceof Array && arr.length > 0;
}

function render(resume) {

    var COURSES_COLUMNS = 3,
        SORT_INTERESTS_KEYWORDS = true,
        PREPEND_SUMMARY_CATEGORIES = [
            "awards",
            "publications"
        ],
        css = fs.readFileSync(__dirname + "/style.css", "utf-8"),
        template = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");

    // Split resume.education.courses into (int)COURSES_COLUMNS columns
    if (validateArray(resume.education)) {
        resume.education.forEach(function (block) {
            if (validateArray(block.courses)) {
                var splitArr = [],
                    columnIndex = 0,
                    i;

                for (i = 0; i < COURSES_COLUMNS; i++) {
                    splitArr.push([]);
                }

                block.courses.forEach(function (course) {
                    splitArr[columnIndex].push(course);
                    columnIndex++;
                    if (columnIndex >= COURSES_COLUMNS) {
                        columnIndex = 0;
                    }
                });

                block.courses = splitArr;
            }
        });
    }

    // Should we be sorting the resume.interests[i].keywords
    if (SORT_INTERESTS_KEYWORDS && validateArray(resume.interests)) {
        resume.interests.forEach(function (interest) {
            interest.keywords.sort();
        });
    }

    PREPEND_SUMMARY_CATEGORIES.forEach(function (category) {
        if (resume[category] !== undefined) {
            resume[category].forEach(function (block) {
                if (block.highlights === undefined) {
                    block.highlights = [];
                }
                if (block.summary) {
                    block.highlights.unshift(block.summary);
                    delete block.summary;
                }
            });
        }
    });

    return Handlebars.compile(template)({
        css: css,
        resume: resume
    });
}

module.exports = {
    render: render
};
