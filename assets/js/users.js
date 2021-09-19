$(document).ready(function() {
  testLogin("users");
  let vueObj = null;
  let __ALLUSER__ = [];

  const allUserTableInit = () => {
    const tableNode = $("#all-users-table");
    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [
        { orderable: false, targets: 1 },
        {
          orderable: false,
          targets: 5,
          width: "50px"
        },
        { targets: 2, width: "100px" },

        { targets: 3, width: "50px" },
        { orderable: false, targets: 4, width: "70px" }
      ]
    };
    const userTable = tableNode.DataTable(tableConfig);

    $("body").on("click", ".remove-table", function() {
      const id = $(this).data("id");
      const row = userTable.row("#" + $(this).data("id"));
      const index = __ALLUSER__.findIndex(e => e._id == id);
      swal(
        {
          title: `هل تريد حذف ${__ALLUSER__[index].name}`,
          type: "info",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "نعم",
          cancelButtonText: "لا"
        },
        function(isConfirm) {
          if (isConfirm) {
            deleteUser({
              id,
              success() {
                swal("حذف", "", "success");
                row.remove().draw();
                __ALLUSER__ = [
                  ...__ALLUSER__.slice(0, index),
                  ...__ALLUSER__.slice(index + 1)
                ];
              }
            });
          }
        }
      );
    });
    $("body").on("click", ".edit-table", function() {
      const id = $(this).data("id");
      const data = __ALLUSER__.find(e => e._id == id);

      $("#user-modal #modal").modal("show");
      vueObj.H_.title = "تعديل مستحدم";
      vueObj.H_.edit = true;
      vueObj.H_.okBtnTitle = "تعديل";
      vueObj.H_.id = id;
      vueObj.name = data.name;
      vueObj.address = data.address;
      vueObj.phone = data.phone;
      vueObj.power = data.power;
    });

    const powerValue = {
      D: "سائق",
      P: "شريك",
      S: "سكرتيرة",
      s_admin: "مشرف"
    };
    const renderName = (power, name, id) => {
      switch (power) {
        case "D":
          return `<a href="./oneDriver.html?_id=${id}">${name}</a>`;
        case "P":
          return `<a href="./onePartner.html?_id=${id}">${name}</a>`;
        default:
          return name;
      }
    };

    const addToUserTable = obj => {
      __ALLUSER__ = [...__ALLUSER__, obj];
      const newRow = userTable.row
        .add([
          obj.name,
          renderPhone(obj.phone),
          obj.address,
          powerValue[obj.power],
          obj.password,
          renderTableAction(obj._id)
        ])
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };

    const editFromUserTable = ({ id, data }) => {
      __ALLUSER__ = __ALLUSER__.map(e => (e._id == id ? data : e));
      const row = userTable.row("#" + id);
      const rowNode = row
        .data([
          data.name,
          renderPhone(data.phone),
          data.address,
          powerValue[data.power],
          data.password,
          renderTableAction(data._id)
        ])
        .draw(false);
    };

    getUser({
      success({ data }) {
        data.forEach(e => {
          addToUserTable(e);
        });
      }
    });

    return { addToTable: addToUserTable, editFromTable: editFromUserTable };
  };

  const modalInit = ({ addToTable, editFromTable }) => {
    const validUser = obj => {
      if (!obj.name || !obj.address || !obj.phone) {
        return false;
      }
      for (let { value, phoneType } of obj.phone) {
        if (!value || !phoneType) {
          return false;
        }
      }

      return true;
    };

    vueObj = new Vue({
      el: "#user-modal #modal",
      data: {
        H_: {
          title: "",
          okBtnTitle: "",
          edit: null
        },

        name: "",
        address: "",
        phone: [{ phoneType: "اساسي", value: "" }],
        power: "D"
      },
      methods: {
        ok() {
          const obj = JSON.parse(JSON.stringify(this.$data));
          delete obj.H_;

          if (!validUser(obj)) {
            swal({
              title: "بعض الحقول ناقصة",
              type: "warning",
              confirmButtonText: "اعد التعبئة",
              closeOnConfirm: false
            });
            return;
          }

          if (this.H_.edit) {
            const id = this.H_.id;
            putUser({
              id,
              data: obj,
              success({ data }) {
                editFromTable({ data, id });
              },
              error(e) {
                swal({
                  title: e.responseJSON.error,
                  type: "info",
                  confirmButtonText: "اعد التعبئة",
                  closeOnConfirm: false
                });
                return;
              }
            });
          } else {
            addUser({
              data: obj,
              success({ data }) {
                addToTable(data);
              },
              error(e) {
                swal({
                  title: e.responseJSON.error,
                  type: "info",
                  confirmButtonText: "اعد التعبئة",
                  closeOnConfirm: false
                });
                return;
              }
            });
          }
          $("#user-modal #modal").modal("hide");
        },
        newPhone() {
          this.phone = [
            ...this.phone,
            { phoneType: "", value: "", _id: new Date().getTime() }
          ];
        },
        removePhon(_id) {
          this.phone = this.phone.filter(e => e._id !== _id);
        }
      }
    });
    const newUserBtn = $("#new-user");
    const modalNode = $("#user-modal #modal");
    newUserBtn.on("click", () => {
      modalNode.modal("show");
      vueObj.H_.title = "اضافة مستحدم";
      vueObj.H_.edit = false;
      vueObj.H_.okBtnTitle = "اضافة";
      vueObj.name = "";
      vueObj.address = "";
      vueObj.phone = [{ phoneType: "اساسي", value: "" }];
      vueObj.power = "D";
    });
  };

  const start = () => {
    const { addToTable, editFromTable } = allUserTableInit();
    renderSiteBar();
    modalInit({ addToTable, editFromTable });
  };
  start();
});
