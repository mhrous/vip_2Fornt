const TRUE = "<p style='color:#5e72e4; text-align: center;'>&#10004;</p>";
const FALSE = "<p style='color:#f5365c; text-align: center;'>&#10008;</p>";
const changeLocation = (depth, newPath) => {
  let array = location.href.split("/");
  array = array.slice(0, array.length - depth);
  array.push(newPath);
  location.replace(array.join("/"));
};
const logInlocally = ({ token, power }) => {
  if (!token || token === "null" || token === "undefined") return;

  if (power === "P" || power === "D" ||power=="S") changeLocation(1, "pages/404page.html");
  else changeLocation(1, "pages/driver.html");
};

const setHeaders = token => {
  if (token !== "undefined" || token !== "null")
    headers.authorization = `Bearer ${token}`;
  else headers.authorization = null;
};
const logOut = () => {
  localStorage.clear();
  const orgine = location.origin;
  location.replace(orgine + "/");
};

const testLogin = pageName => {
  const token = localStorage.getItem("token");
  const power = localStorage.getItem("power");

  if (power === "P" || power === "D") {
    changeLocation(1, "404page.html");
    return;
  }
  if (token && token !== "null" && token !== "undefined") setHeaders(token);
  else logOut();
  if (power === "admin" && pageName === "numberPhone") {
    changeLocation(1, "travel.html");
    return;
  } else if (
    power === "S" &&
    (pageName === "notifications" ||
      pageName === "driver" ||
      pageName === "car" ||
      pageName === "partner" ||
      pageName === "users" ||
      pageName === "onePartner" ||
      pageName === "oneDriver")
  ) {
    changeLocation(1, "travel.html");
    return;
  } else if (
    power === "s_admin" &&
    (pageName === "notifications" ||
      pageName === "numberPhone" ||
      pageName === "users")
  ) {
    changeLocation(1, "travel.html");
    return;
  }

  return { token, power };
};

const renderSiteBar = () => {
  let pageName = location.href.split("/");
  pageName = pageName[pageName.length - 1];
  pageName = pageName.split(".")[0];
  const power = localStorage.getItem("power");

  let pages = [];
  switch (power) {
    case "admin":
      pages = [
        ["driver", "سائقين"],
        ["car", "سيارات"],
        ["partner", "شركاء"],
        ["users", "مستخدمين"],
        ["settings", "اعدادات"]
      ];
      break;
    case "s_admin":
      pages = [
        ["driver", "سائقين"],
        ["car", "سيارات"],
        ["partner", "شركاء"],
        ["settings", "اعدادات"]
      ];
      break;
    case "S":
      pages = [
        ["travel", "رحلات"],
        ["numberPhone", "ارقام السائقين"],
        ["settings", "اعدادات"]
      ];
      break;
  }

  let str = "";
  pages.forEach(e => {
    str += `
    <li class="nav-item">
        <a 
            href="${pageName === e[0] ? "#" : `./${e[0]}.html`}"
            class="${pageName === e[0] ? "active" : ""}"
        >
            ${e[1]}
        </a>
    </li>
      `;
  });
  $("#sidebar .nav").html(str);
  $("#sidebar #log-out-btn").on("click", logOut);
  $(".btn-icon-sidebar-none").on("click", () => {
    $("#sidebar").addClass("none");
    $(".btn-icon-sidebar-on").removeClass("none");
  });
  $(".btn-icon-sidebar-on").on("click", function() {
    $(this).addClass("none");
    $("#sidebar").removeClass("none");
  });
};

const renderPhone = array => {
  let str = `<div data-value="${JSON.stringify(array)}">`;
  array.forEach(e => {
    str += `<div>${e.phoneType} : ${e.value}</div>`;
  });
  str += "</div>";
  return str;
};

const renderTableAction = id =>
  `<div class="d-flex justify-content-center">
    <i class="ni ni-settings  edit-table" data-id="${id}"></i>
    <i class="ni ni-fat-remove  remove-table" data-id="${id}"></i>
  </div>`;

const TO_JSON = obj => JSON.parse(JSON.stringify(obj));
