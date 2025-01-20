$(document).ready(function () {
  // 2 functions show và hdie pop up loading
  const startLoading = function () {
    $("#loading-popup").show();
  };
  const endLoading = function () {
    $("#loading-popup").hide();
  };

  // function getdata để call API bằng ajax
  const GetData = function (method, properties, success, error, complete, context) {
    if (properties == undefined) properties = {};
    properties.url = "https://luong.plxna.com.vn/Service_XD_V5.2/Service.svc/" + method;
    // properties.url = "https://DEV.HOMEOS.vn/service/service.svc/" + method;
    properties.type = "GET";
    properties.dataType = "jsonp";
    //properties.timeout = 30000;
    //properties.cache = false;
    properties.contentType = "application/json; charset=utf-8";
    if (properties.data == undefined) properties.data = { uid: HomeOS.UserInfo.USER_ID(), sid: HomeOS.SESSION_ID() };
    else {
      // if (properties.data.Sid == undefined) properties.data.Sid = HomeOS.SESSION_ID();
      // if (properties.data.Uid == undefined) properties.data.Uid = HomeOS.UserInfo.USER_ID();
    }
    properties.context = context;
    properties.complete = function () {};
    properties.success = success;
    properties.error = error;
    if (method == "GetDm") if (properties.data.tablename == undefined) return;
    $.ajax(properties);
  };

  const SetData = function (table, data) {
    // const d = {Uid: "vannt", Sid:'3d798037-9bd9-4195-8673-a4794547d2fd', tablename:table, jd:JSON.stringify(data), ex:''};
    const d = { Uid: HomeOS.UserInfo.USER_ID, Sid: localStorage.getItem("StateId"), tablename: table, jd: JSON.stringify(data), ex: "" };

    return new Promise((resolve, reject) => {
      $.ajax({
        // url: "https://DEV.HOMEOS.vn/service/service.svc/ExecuteData?callback=?",
        // url: "https://luong.plxna.com.vn/Service_XD_V5.2/Service.svc/",
        url: "https://central.homeos.vn/Service_XD/Service.svc/",
        type: "GET",
        dataType: "jsonp",
        data: d,
        contentType: "application/json; charset=utf-8",
        success: function (msg) {
          try {
            let state = JSON.parse(msg);
            resolve(state); // Trả về dữ liệu khi thành công
          } catch (error) {
            reject(error); // Bắt lỗi nếu JSON parse thất bại
          }
        },
        complete: function (data) {},
        error: function (e, t, x) {},
      });
    });
  };

  // show / hide nút liên kết tài khoản Zalo
  if (localStorage.getItem("isLinkedAccount") == true) {
    $("#LinkUser").addClass("d-none");
  } else {
    $("#LinkUser").removeClass("d-none");
  }

  // lấy data của lịch ca
  let val = [];
  val.data = {
    tablename: "SC_LICHCA",
    c: "DATE_SCHEDULE >= '2025-01-01'",
    other: "",
    Cdm: "",
    Sid: localStorage.getItem("StateId"),
    Uid: localStorage.getItem("StateName"),
  };
  startLoading();
  GetData(
    "GetDm",
    val,
    (data) => {
      endLoading();
      LoadDataSuccess(data);
    },
    (e) => {
      console.log(e);
      endLoading();
    },
    (c) => {
      console.log(c);
      endLoading();
    }
  );

  $("#txtSearchScLichCa").on(
    "keyup click",
    function () {
      if ($("#gGridScLichCa").DataTable() != null) {
        if ($("#txtSearchScLichCa").val() != "") {
          $("#gGridScLichCa").DataTable().search($("#txtSearchScLichCa").val()).draw();
        } else {
          $("#gGridScLichCa").DataTable().search("").draw();
        }
      }
    }.bind(this)
  );

  const GetWidth = function () {
    // let Width = 0;
    // if ($("body").hasClass("sidebar-collapse")) Width = $(window).width() - 55;
    // else Width = $(window).width() - document.querySelector(".sidebar").offsetWidth - 20;
    // return Width;
    return 1900;
  };
  const GetHeight = function () {
    // let heitoolbar = document.querySelector(".ui-search-toolbar") ? document.querySelector(".ui-search-toolbar").offsetHeight : 0;
    // if (document.querySelector(".ui-search-toolbar")) if ($(".ui-search-toolbar").css("display") == "none") heitoolbar = 0;
    // let mainH = document.querySelector(".main-header").offsetHeight;
    // let boxH = document.querySelector("#frmFormListSC_LICHCACHOOSE .box-header").offsetHeight;
    // let contentH = document.querySelector(".content-header").offsetHeight;
    // let mainF = document.querySelector(".main-footer").offsetHeight;
    // let labels = document.querySelector(".ui-jqgrid-labels") ? document.querySelector(".ui-jqgrid-labels").offsetHeight : 0;
    // boxH = 54;
    // labels = 0; //27
    // if (document.querySelector(".ui-jqgrid-hbox")) heitoolbar = document.querySelector(".ui-jqgrid-hbox").offsetHeight;
    // let Height = $(window).height() - (mainH + contentH + 30 + boxH + 40 + mainF + 30 + labels + heitoolbar + 0);
    // return Height;
    return 1000;
  };

  const FilterContent = function (data, id, value, singleValue) {
    let dataTemp = [];
    if (singleValue) dataTemp = {};
    if (data)
      for (let xxx = 0; xxx < data.length; xxx++) {
        if (data[xxx][id] == value) {
          if (singleValue) return data[xxx];
          dataTemp.push(data[xxx]);
        }
      }
    return dataTemp;
  };

  String.prototype.Replace = function (someString, replaceString) {
    return this.replace(new RegExp(someString, "g"), replaceString);
    //return this.replace('/' + someString + '/g', replaceString);
  };

  // hiển thị dữ liệu lấy được lên datatable
  const DisplayCa = function (ca, row) {
    str = "";
    if (row["SHIFT_C" + ca] != "") {
      let obj = JSON.parse(row["SHIFT_C" + ca]);
      for (let t = 0; t < obj.length; t++) {
        switch (obj[t].checked) {
          case "DEL":
            str += '<span class="badge badge-danger" style="line-height:150%;width: 100%;margin-bottom:2px;">' + obj[t].hovaten + "</span><br>";
            break;
          case "NEW":
            str += '<span class="badge badge-success" style="line-height:150%;width: 100%;margin-bottom:2px;">' + obj[t].hovaten + "</span><br>";
            break;
          default:
            str += '<span class="badge badge-primary" style="line-height:150%;width: 100%;margin-bottom:2px;">' + obj[t].hovaten + "</span><br>";
            break;
        }
      }
    }
    return str;
  };

  // callback sau khi lấy thành công dữ liệu lịch ca
  const LoadDataSuccess = function (data) {
    try {
      let state = JSON.parse(data);
      if (state.StateId) {
        if (state.StateId == "NOT_EXIST_SESSION") {
          console.log(state.StateName);
        } else {
          HomeOS.Form.MessageBox(state.StateName, "danger");
        }
        return;
      }

      let Config_Extra;
      let dataTable = state;
      let DataGrid = { DataTable: dataTable };
      DataGrid.UnloadGrid = function () {};
      if (DataGrid.DataTable.dataSet.SYS_TABLE) {
        for (let i in DataGrid.DataTable.dataSet.SYS_TABLE) {
          let row = DataGrid.DataTable.dataSet.SYS_TABLE[i];
          if (row.IS_PR_KEY == 1) {
            if (row.CONFIG_EXTRA != "") {
              let cex = JSON.parse(row.CONFIG_EXTRA);
              Config_Extra = cex;
            }
          }
        }
      }
      //dataTable.data = dataTable.data.sort(function (a, b) {
      //    return a.DATE_SCHEDULE.localeCompare(b.DATE_SCHEDULE);
      //});
      for (let i = 0; i < dataTable.data.length; i++) {
        dataTable.data[i].DATE_NAME = dataTable.data[i].DATE_NAME.Replace("fa fa-square-o", "far fa-square");
        dataTable.data[i].DATE_NAME = dataTable.data[i].DATE_NAME.Replace("fa fa-check-square-o", "far fa-check-square");
        dataTable.data[i].SHIFT_C1_DISPLAY = DisplayCa("1", dataTable.data[i]);
        dataTable.data[i].SHIFT_C2_DISPLAY = DisplayCa("2", dataTable.data[i]);
        dataTable.data[i].SHIFT_C3_DISPLAY = DisplayCa("3", dataTable.data[i]);
      }
      ///////////////////////////////
      let optgrid = {
        data: dataTable.data,
        width: GetWidth(),
        //info: false,
        rowId: "PR_KEY",
        paging: true,
        searching: true,
        scrollY: GetHeight() - 100 + "px",
        stripeClasses: ["sclich_ca-oddRow", "sclich_ca-evenRow"],
        select: {
          style: "single",
          //items: 'cell'
        },
        language: {
          zeroRecords: "Không có dữ liệu",
          info: "Hiển thị _PAGE_ of _PAGES_ bản ghi",
          infoEmpty: "Không có dữ liệu",
          infoFiltered: "(Lọc được _MAX_ bản ghi)",
        },
      };

      optgrid.columns = [];
      let dataX1 = FilterContent(dataTable.dataSet.DM_ORGANIZATION_SHIFT, "SHIFT", "1", true);
      let dataX2 = FilterContent(dataTable.dataSet.DM_ORGANIZATION_SHIFT, "SHIFT", "2", true);
      let dataX3 = FilterContent(dataTable.dataSet.DM_ORGANIZATION_SHIFT, "SHIFT", "3", true);
      let c1 = dataX1.SHIFT_NAME;
      let c2 = dataX2.SHIFT_NAME;
      let c3 = dataX3.SHIFT_NAME;
      for (let k in dataTable.colModel) {
        if (dataTable.colModel[k].name == "WEEK_ID") this.groupColumn = k;
        let ca = dataTable.colNames[k];
        if (dataTable.colModel[k].name == "SHIFT_C1_DISPLAY") ca = dataTable.colNames[k] + "</br><b>" + c1 + "</b>";
        if (dataTable.colModel[k].name == "SHIFT_C2_DISPLAY") ca = dataTable.colNames[k] + "</br><b>" + c2 + "</b>";
        if (dataTable.colModel[k].name == "SHIFT_C3_DISPLAY") ca = dataTable.colNames[k] + "</br><b>" + c3 + "</b>";
        optgrid.columns.push({
          sortable: false,
          title: ca,
          data: dataTable.colModel[k].name,
          targets: k,
          visible: !dataTable.colModel[k].hidden,
          width: dataTable.colModel[k].width,
          className: dataTable.colModel[k].name == "DATE_NAME" ? "sclich_ca-date_name" : "",
        });
      }
      optgrid.drawCallback = function (settings) {
        let api = this.api();
        let rows = api.rows({ page: "current" }).nodes();
        let last = null;
        api
          .column(9, { page: "current" })
          .data()
          .each(function (group, i) {
            if (last !== group) {
              $(rows)
                .eq(i)
                .before('<tr class="group bg-olive"><td colspan="5">' + group + "</td></tr>");
              last = group;
            }
          });
      };

      // if (!this.Isloaddata) {
      // this.Isloaddata = true;
      $("#DataGridMainScLichCa").html("<table id='gGridScLichCa' class='table table-bordered hover display'></table>");
      // $("#gGridScLichCa").height(GetHeight());

      $("#gGridScLichCa").DataTable(optgrid);
      // this.TableView = $("#gGridScLichCa").DataTable();
      // } else {
      //   this.TableView.clear();
      //   this.TableView.rows.add(dataTable.data);
      //   this.TableView.draw();
      //   $("#gGridScLichCa_filter").remove();
      // }
      $(".table").css({ height: 0 });
      document.querySelector("#gGridScLichCa_wrapper > div.dataTables_scroll > div.dataTables_scrollBody").style.height =
        localStorage.getItem("isLinkedAccount") == true ? "49vh" : "34vh";
    } catch (e) {
      // finishLoading();
      console.log(e);
    }
  };

  // thên event listener click cho nút liên kết tài khoản
  $("#LinkUser").click(async function () {
    if (window.GetUser) {
      await window.GetUser();
      let zaloUserInfo = localStorage.getItem("zaloUserInfo");

      const willInsertData = {
        USER_ID: localStorage.getItem("StateName"),
        ZALO_USER_ID: zaloUserInfo.ID,
        LINKBASE: "XDNA",
        ACTIVE: 1,
        DATE_CREATE: new Date(),
        DATASTATE: "ADD",
      };
      SetData("ZALO_LINKED_USER", willInsertData);

      localStorage.setItem("SAVED_PASS", HomeOS.UserInfo.PASSWORD);
      $("#LinkUser").addClass("d-none");
      localStorage.setItem("isLinkedAccount", true);
      document.querySelector("#gGridScLichCa_wrapper > div.dataTables_scroll > div.dataTables_scrollBody").style.height = "49vh";
    }
  });
});
