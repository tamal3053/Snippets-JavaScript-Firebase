/**************************************************************
 * Author: Tamal Dey
 * Project: CodeSnippet app build with Javascript and Firebase.
 * Started: 15th Sep 2016
 * Live URL:
 * GitHub:
 * License: GPL 3.0 - (Keep Credits)
 *************************************************************/


/**
 * Initialize Firebase
 * Added from Firebase.google.com
 * @type {{apiKey: string, authDomain: string, databaseURL: string, storageBucket: string, messagingSenderId: string}}
 */
var config = {
    apiKey: "AIzaSyClzgGXbHIyIM-R286trVG5MYspmN0Qu6E",
    authDomain: "testapps-31019.firebaseapp.com",
    databaseURL: "https://testapps-31019.firebaseio.com",
    storageBucket: "testapps-31019.appspot.com",
    messagingSenderId: "886362018829"
};
firebase.initializeApp(config);


/**
 * Language object
 * @type {object}
 */
var lang = {
    addCategoryHeading: "Add a new category.",
    listCategoryNotFound: "Start Here! Adding new Category to begin.",
    addSnippetHeading: "Add a new Snippet in {category}",
    addLoopHeading: "Snippet under {category} category.",
    listSnippetLoopHeading: "List of Snippets in {category}",
    listSnippetNotFound: "Please Start by Adding New Snippet of {category}",
    saveSnippet: "Save New Snippet",
    snippetAddedSucc: "Snippet Added Successfully!"
};


/**
 * Convert String To Slug
 * @param AnyString
 * @returns {string}
 */
function convertToSlug(AnyString) {
    return AnyString
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

/**
 * Process URL for Routing purpose
 *
 * @returns {object}
 */
function processUrl() {
    var urlHashValue = window.location.hash.substr(1);
    var returnVal = {};
    if (urlHashValue.indexOf("snippet") >= 0) {
        returnVal.type = "snippet";
        returnVal.slug = urlHashValue.replace('snippet-', '');
    } else if (urlHashValue.indexOf("category") >= 0) {
        returnVal.type = "category";
        returnVal.slug = urlHashValue.replace('category-', '');
    } else {
        returnVal.type = urlHashValue;
        returnVal.slug = null;
    }
    return returnVal;
}


/**
 * Insert After
 * Code from : http://stackoverflow.com/a/4793630
 */
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Decode entry
 * Code from : https://www.strictly-software.com/htmlencode
 */
Encoder.EncodeType = "entity";

/**
 * Process ADD SNIPPET form
 */
function processAddSnippet() {

    var user = firebase.auth().currentUser;

    if (user) {

        var inputSnippetCode = document.getElementById('inputSnippetCode');
        var inputSnippetHeading = document.getElementById('inputSnippetHeading');
        var formAddSnippetError = document.getElementById('formAddSnippetError');
        var buttonSnippetSubmit = document.getElementById('inputSnippetSubmit');

        var randamSlug = Math.random();

        buttonSnippetSubmit.innerHTML = "Saving Snippet";
        url = processUrl();

        var heading = inputSnippetHeading.value;
        var code = inputSnippetCode.value.trim();

        //Posting data
        if (heading != "" && code != "") {
            firebase.database().ref(user.uid + '/snippet/').push({
                heading: Encoder.htmlEncode(heading),
                code: Encoder.htmlEncode(code),
                category: url.slug,
                slug: convertToSlug(heading + "-" + randamSlug)
            }, function(error) {
                if (error) {

                } else {
                    buttonSnippetSubmit.innerHTML = lang.saveSnippet;
                    inputSnippetCode.value = "";
                    inputSnippetHeading.value = "";
                    formAddSnippetError.innerHTML = lang.snippetAddedSucc;
                    setTimeout(function() {
                        formAddSnippetError.innerHTML = "";
                    }, 2000);
                    return true;
                }
            });
        } else {
            if (heading == "") {
                formAddSnippetError.innerHTML = "Its easier to add a Heading for quick overview.";
                return false;
            } else if (code == "") {
                formAddSnippetError.innerHTML = "Snippet is lonely without a code!";
                return false;
            } else {
                formAddSnippetError.innerHTML = "Need to add some code?";
            }
        }

    } else {
        formAddSnippetError.innerHTML = "You must be logged in to continue.";
        return false;
    }
}

/**
 * Process ADD NEW CATEGORY form
 */
function processAddCategory() {

    var user = firebase.auth().currentUser;

    if (user) {

        var inputCategoryAdd = document.getElementById('inputCategoryName');
        var formAddCategoryError = document.getElementById('formAddCategoryError');
        var buttonCategorySubmit = document.getElementById('inputCategorySubmit');

        buttonCategorySubmit.innerHTML = "Processing";

        value = inputCategoryName.value;

        //Posting data
        if (value != "") {
            firebase.database().ref(user.uid + '/categories/').push({
                name: inputCategoryAdd.value,
                slug: convertToSlug(inputCategoryAdd.value)
            }, function(error) {
                if (error) {

                } else {
                    buttonCategorySubmit.innerHTML = "Save New Category";
                    inputCategoryAdd.value = "";
                    formAddCategoryError.innerHTML = "Category Added Successfully!";
                    setTimeout(function() {
                        formAddCategoryError.innerHTML = "";
                    }, 2000);
                }
            });
        } else {
            formAddCategoryError.innerHTML = "Category Name must be filled out";
            return false;
        }
    } else {
        formAddCategoryError.innerHTML = "You must be logged in to continue.";
        return false;
    }
}


function PageHTML() {

    this.userid = "public";

    /**
     * categories
     */
    this.categoryForm = function() {
        return '<div class="clearfix"><br /></div>' +
            '<h3 id="addCategoryHeading"></h3>' +
            '<form id="formAddCategory" action="javascript:void(0)" method="post" onsubmit="return processAddCategory();">' +
            '<div class="inputForm">' +
            '<label>Category Name:</label>' +
            '<input type="text" id="inputCategoryName" />' +
            '</div>' +
            '<div class="inputForm">' +
            '<button id="inputCategorySubmit" type="submit">Save New Category</button>' +
            '</div>' +
            '<div id="formAddCategoryError"></div>' +
            '</form>' +
            '<div class="clearfix"><br /></div>';
    };

    this.snippetForm = function() {
        return '<h1 id="addSnippetHeading"></h1>' +
            '<form id="fromAddSnippet" action="javascript:void(0)" onsubmit="return processAddSnippet();"> ' +
            '<div class="inputForm"> ' +
            '<label>Snippet Heading</label>' +
            '<input type="text" id="inputSnippetHeading" />' +
            '</div>' +
            '<div class="inputForm">' +
            '<label>Snippet Code</lable>' +
            '<textarea id="inputSnippetCode"></textarea>' +
            '</div>' +
            '<div class="inputForm">' +
            '<button id="inputSnippetSubmit" type="submit">Save Snippet</button>' +
            '</div>' +
            '<div id="formAddSnippetError"></div>' +
            '</form>' +
            '<div class="clearfix"><br /></div>';
    }

    this.loginHtml = function() {
        return '<h1 id="loginHeading" class="text-center">Code Snippets</h1>' +
            '<p class="text-center">Simple way to save your code snippets. <br />Login or Register with your email id to get Started</p>' +
            '<form id="formLogin" action="javascript:void(0)"> ' +
            '<div class="inputForm"> ' +
            '<label>Email Address</label>' +
            '<input type="email" id="loginEmail" />' +
            '</div>' +
            '<div class="inputForm">' +
            '<label>Strong Password</lable>' +
            '<input type="password" id="loginPass" />' +
            '</div>' +
            '<div class="inputForm">' +
            '<button id="submitLogin" type="submit">Login</button>' +
            ' -OR- ' +
            '<button id="submitRegister" type="submit">Quick Register</button>' +
            '</div>' +
            '<div id="formLoginError"></div>' +
            '</form>' +
            '<div class="clearfix"><br /></div>';
    }

    this.registerHtml = function() {
        return '' +
            '<form id="formRegister" action="javascript:void(0)" onsubmit=""> ' +
            '<div class="inputForm"> ' +
            '<label>Email Address</label>' +
            '<input type="email" id="regsiterEmail" />' +
            '</div>' +
            '<div class="inputForm">' +
            '<label>Password</lable>' +
            '<input type="password" id="registerPass" />' +
            '</div>' +
            '<div class="inputForm">' +
            '<button id="submitRegister" type="submit">Quick Register</button>' +
            '</div>' +
            '<div id="formRegisterError"></div>' +
            '</form>' +
            '<div class="clearfix"><br /></div>';
    }

    this.wrappers = function() {
        return '<div class="main wrapper clearfix">' +
            '<article>' +
            '<section id="snippetContainer"></section>' +
            '<section id="snippetsLoop"></section>' +
            '</article>' +
            '<aside>' +
            '<div id="categoryLoop"></div>' +
            '<div id="categoryAdd"></div>' +
            '</aside>' +
            '</div>';
    }


    /**
     * Add Other Texts
     */
    this.headings = function() {
        var categoryContainer = document.getElementById("addCategoryHeading");
        categoryContainer.innerHTML = lang.addCategoryHeading || "Lang Object not found";
    };

}

function ProcessAuth() {

    var auth = firebase.auth();

    this.checkLogin = function() {
        var email = document.getElementById('loginEmail').value;
        var pass = document.getElementById('loginPass').value;
        var promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(function(e) {
            document.getElementById('formLoginError').innerText = e.message;
        });
    };

    this.doRegistration = function() {
        var email = document.getElementById('loginEmail').value;
        var pass = document.getElementById('loginPass').value;
        var promise = auth.createUserWithEmailAndPassword(email, pass);
        promise.then(function(e) {
            window.location.href = "#registerd";
        });
        promise.catch(function(e) {
            document.getElementById('formLoginError').innerText = e.message;
        });
    };

    this.logOut = function() {
        auth.signOut();
    }

}

/**
 * Logic Functions
 */

function Processors() {

    /**
     * Adding Snippets to view
     */

    var snippetLoopContainer = document.getElementById("snippetsLoop");
    var addSnippetHeading = document.getElementById("addSnippetHeading");


    this.fetchRecentCategories = function() {
        var user = firebase.auth().currentUser;
        var recentCategorysRef = firebase.database().ref(user.uid + '/categories').limitToLast(100);
        recentCategorysRef.on('child_added', function(data) {
            document.getElementById('categoryLoop').innerHTML += '<a class="block_list" href="#category-' + data.val().slug + '">' + data.val().name + '</a>';
        });
    };

    this.fetchRecentSnippets = function() {
        var user = firebase.auth().currentUser;
        document.getElementById("snippetsLoop").innerHTML = "";
        var recentSnippetRef = firebase.database().ref(user.uid + '/snippet').limitToLast(100);
        recentSnippetRef.on('child_added', function(data) {
            document.getElementById("snippetsLoop").innerHTML += '<a class="snippet_loop_title" id="' + data.val().slug + '" href="#snippet-' + data.val().slug + '">' + data.val().heading + '</a>';
        });
    };

    this.fetchSnippetsByCategory = function() {
        var user = firebase.auth().currentUser;
        var ref = firebase.database().ref(user.uid + '/categories');
        document.getElementById("snippetsLoop").innerHTML = "";
        var url = processUrl();
        ref.orderByChild('slug')
            .equalTo(url.slug)
            .on('child_added', function(data) {
                var currentCategory = data.val();
                var pageHeading = lang.addSnippetHeading.replace('{category}', currentCategory.name);
                var pageSnippetLoopHeading = lang.addLoopHeading.replace('{category}', currentCategory.name);

                if (url.type == "category") {
                    document.getElementById("addSnippetHeading").innerHTML = pageHeading || "Lang Object not found";
                }

                document.getElementById("snippetsLoop").innerHTML = "<h3>" + pageSnippetLoopHeading || "Lang Object not found" + "</h3>";

                var snap = firebase.database().ref(user.uid + '/snippet');
                snap.orderByChild('category')
                    .equalTo(currentCategory.slug)
                    .on('child_added', function(data) {
                        document.getElementById("snippetsLoop").innerHTML += '<a class="snippet_loop_title" id="' + data.val().slug + '" href="#snippet-' + data.val().slug + '">' + data.val().heading + '</a>';
                    });
            });

    };

    this.fetchSnippet = function() {
        var url = processUrl();
        var user = firebase.auth().currentUser;
        var refsnip = firebase.database().ref(user.uid + '/snippet');
        refsnip.orderByChild('slug')
            .equalTo(url.slug)
            .on('child_added', function(data) {
                var el = document.createElement("div");
                el.className = "snippet-model";
                // el.setAttribute("contenteditable", true);
                el.innerHTML = "<div class='close' onclick='history.go(-1);'>X</div><div class='model-container' contenteditable='true'><code class='language-" + data.val().category + "'>" + Encoder.htmlEncode(data.val().code) + "</code></div>";
                var a = document.getElementById(data.val().slug);
                insertAfter(a, el);
            });
    };

    /**
     * Render Pages
     */
    this.renderPages = function() {

        var url = processUrl();

        if (url.type == 'snippet') {
            //Fetch single snippet
            this.fetchSnippet();
        } else if (url.type == 'category') {
            //Fetch snippets by category
            document.getElementById('fromAddSnippet').classList = "show";
            this.fetchSnippetsByCategory();
        } else {
            if (JSON.stringify(processUrl()) !== {}) {
                //Home page
                document.getElementById('addSnippetHeading').innerHTML = "List of Recent Snippets.";
                document.getElementById('fromAddSnippet').classList = "hidden";
                this.fetchRecentSnippets();
            }
        }
    };


}


var std = new Processors();
var chkauth = new ProcessAuth();
var htmls = new PageHTML();


window.onload = function() {

    var mainContainer = document.getElementById('main');

    document.getElementById('quickstart-sign-out').addEventListener("click", function(e) {
        e.preventDefault();
        chkauth.logOut();
        document.getElementById('quickstart-sign-in').className = 'show';
        this.className = 'hidden';
    });

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            htmls.userid = user.uid;

            mainContainer.innerHTML = htmls.wrappers();

            var categoryAddContainer = document.getElementById("categoryAdd");
            var snippetAddContainer = document.getElementById("snippetContainer");

            categoryAddContainer.innerHTML = htmls.categoryForm();
            snippetAddContainer.innerHTML = htmls.snippetForm();

            std.renderPages();

            std.fetchRecentCategories();

            window.onhashchange = function() {
                std.renderPages();
            };


            htmls.headings();

            // Only at Registration
            var url = processUrl();
            if (url.type === "registerd") {
                document.getElementById('addSnippetHeading').innerHTML = "Hi There! Thanks for registering... <br /><br /><img src='http://s9.postimg.org/ea2y09nan/giphy.gif' /><br /><br /><small style='color:#e44d26'>Start from the right by adding new 'Category'.</small>";
            }

            document.getElementById('quickstart-sign-in').classList = 'hidden';
            document.getElementById('quickstart-sign-out').classList = 'show';

        } else {
            mainContainer.innerHTML = htmls.loginHtml();

            // User Login
            var loginBtn = document.getElementById('submitLogin');
            loginBtn.addEventListener("click", function(e) {
                e.preventDefault();
                chkauth.checkLogin();
            });
            // Do Registrations
            var regBtn = document.getElementById('submitRegister');
            regBtn.addEventListener("click", function(e) {
                e.preventDefault();
                chkauth.doRegistration();
            });

        }
    });

};