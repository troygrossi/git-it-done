var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");
//get query string portion of url sent from homepage

var getRepoName = function () {
  var queryString = document.location.search;
  var repoName = queryString.split("=")[1];
  if (repoName) {
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
  } else {
    window.location.replace("./index.html");
  }
};

var getRepoIssues = function (repo) {
  console.log(repo);
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
  fetch(apiUrl).then(function (response) {
    if (!response.ok) {
      window.location.replace("./index.html");
      return 0;
    }
    response.json().then(function (data) {
      console.log(data);
      displayIssues(data);
      //"link" header property for when there is over 30 issues
      if (response.headers.get("Link")) {
        displayWarning(repo);
      }
      // check if api has paginated issues
    });
  });
};
var displayWarning = function (repo) {
  limitWarningEl.textContent = "To see more than 30 issues, visit ";
  var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on GitHub.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // append to warning container
  limitWarningEl.appendChild(linkEl);
};

var displayIssues = function (issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }
  for (let i = 0; i < issues.length; i++) {
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");
    // create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type element
    var typeEl = document.createElement("span");

    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl);
    issueContainerEl.appendChild(issueEl);
  }
};

getRepoName();
// getRepoIssues("facebook/react");
