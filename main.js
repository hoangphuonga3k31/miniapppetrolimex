let HomeOS = localStorage.getItem("HomeOS");
if (!HomeOS) {
  HomeOS = {
    Domain: "https://central.homeos.vn/singlepage/PetrolimexHRM/",
    UserInfo: {},
    linkbase: function () {
      return "https://luong.plxna.com.vn/service/service.svc/";
    },
    Common: {
      Ping: function () {
        $.ajax({
          url: HomeOS.linkbase() + "Ping?callback=?",
          type: "GET",
          timeout: 30000,
          dataType: "jsonp",
          contentType: "application/json; charset=utf-8",
          success: function (msg) {
            console.log(msg);
            GetSessionId(HomeOS.UserInfo.USER_ID, HomeOS.UserInfo.PASSWORD);
          },
          complete: function (e, data) {},
          error: function (e, t) {},
        });
      },
    },
  };
}

const GetSessionId = async function (user_id, password) {
  let getip = false;
  if (getip == false) getip = "0.0.0.0";
  let d = { Uid: user_id, p: password, ip: getip, a: "gfdfsgntegewhq" };
  $.ajax({
    url: HomeOS.linkbase() + "GetSessionId?callback=?",
    type: "GET",
    dataType: "jsonp",
    data: d,
    contentType: "application/json; charset=utf-8",
    success: function (msg) {
      let state = JSON.parse(msg);
      console.log(state);
      if (
        state != null &&
        state.StateId != "LOGIN_FAIL" &&
        state.StateId != "TOKEN_NOT_ACTIVED" &&
        // state.StateId != "LOGIN_DEFAULT_FAIL" &&
        state.StateId != "LOGIN_EXP_DATE" &&
        state.StateId != "-1"
      ) {
        localStorage.setItem("StateId", state[0].StateId);
        localStorage.setItem("StateName", state[0].StateName);
        // localStorage.setItem("StatePass", HomeOS.UserInfo.PASSWORD);
        $("#login-block").hide();
        $("#content-block").load("./LichCa.html");
      } else {
        if (state.StateId == "LOGIN_DEFAULT_FAIL" || state.StateId == "LOGIN_EXP_DATE") {
          $("#lblError").html(state.StateName);
          HomeOS.RequestChangePassword = state.StateName;

          $("#frmLogin > div > div.card > div").append(
            '<a class="btn btn-primary btn-flat float-right" href="javascript: Login.changePasswordClickAction()">Đổi mật khẩu</a>'
          );
        } else {
          $("#lblError").html(state.StateName);
          setTimeout(function () {
            $("#lblError").html("");
          }, 8000);
        }
      }
    },
    complete: function (data) {},
    error: function (e, t, x) {
      console.log(e);
    },
  });
};
// HomeOS = {};
// HomeOS.UserInfo = {};
// HomeOS.linkbase = function () {
//   return "https://central.homeos.vn/Service_XD/Service.svc/";
// };
const loginClickViewAction = function () {
  isView = true;
  HomeOS.UserInfo.USER_ID = "GUEST";
  HomeOS.UserInfo.PASSWORD = "1";
  loginclick();
};

const loginClickAction = function () {
  HomeOS.UserInfo.USER_ID = $("#txtUserName").val();
  // bổ sung mã hoá password
  let hashedPassword = CryptoJS.SHA1($("#txtPassword").val() + "@1B2c3D4e5F6g7H8").toString();
  HomeOS.UserInfo.PASSWORD = hashedPassword;
  // HomeOS.UserInfo.PASSWORD($("#txtPassword").val());
  // localStorage.setItem("SAVE_THIS", HomeOS.UserInfo.USER_ID);
  // if (SavePassword()) {
  //   localStorage.setItem("SAVE_PW", SavePassword());
  // } else {
  //   localStorage.setItem("SAVE_PW", HomeOS.UserInfo.PASSWORD);
  // }
  loginclick();
};

const loginclick = function () {
  // localStorage.setItem("SAVE_THIS", HomeOS.UserInfo.USER_ID);
  // if (HomeOS.linkbase() == "" || HomeOS.linkbase() == undefined) {
  //   // HomeOS.TEXTLOADING("Điều hướng dịch vụ...");
  //   Ping();
  // } else {
  //   Ping();
  // }
  // // if (Login.txtPassword) Login.txtPassword.focus();

  HomeOS.Common.Ping();
};

// const SavePassword = function () {
//   let isSavePassword = localStorage.getItem()
// }

if (localStorage.getItem("SAVED_PASS")) {
  GetSessionId(localStorage.getItem("StateName"), localStorage.getItem("SAVED_PASS"));
}
