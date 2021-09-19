$(document).ready(function() {
  const { token, power } = testLogin("onePartner");
  let user, MainDate;
  const __DATA__ = {
    payment: [],
    account: [],
    repairing: [],
    expenses: []
  };

  const initAccount = () => {
    const tableConfig = {
      paging: false,
      searching: false
    };
    const accountTable = $("#account-table").DataTable(tableConfig);
    const addToAccountTable = obj => {
      __DATA__.account = [...__DATA__.account, obj];
      const totalTravel = obj.travel.reduce(
        (a, obj) =>
          a +
          obj.cashTo +
          obj.cashBack +
          obj.repairing.reduce((_a, _b) => _a + _b.value, 0),
        0
      );
      const totalExpenses = obj.travel.reduce((a, obj) => a + obj.expenses, 0);

      const totalExpensesOnCar = obj.expenses.reduce((a, b) => a + b.amount, 0);
      const caProduct = totalTravel - totalExpenses - totalExpensesOnCar;
      const myValue = Math.round(caProduct * (obj.part / 24) * 100) / 100;
      const newRow = accountTable.row
        .add([
          obj.carName,
          obj.carNaumber,
          obj.part,
          obj.driverName,
          obj.travel.length,
          totalTravel,
          totalExpenses,
          totalExpensesOnCar,
          caProduct,
          myValue
        ])
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };
    const clearTable = () => {
      accountTable.clear().draw();
      __DATA__.account = [];
    };

    return {
      addAccountTableToTable: addToAccountTable,
      clearAccountable: clearTable
    };
  };

  const initRepairing = () => {
    const tableConfig = {
      paging: false,
      searching: false
    };
    const repairingTable = $("#repairing-table").DataTable(tableConfig);
    const addToRepairingTable = obj => {
      __DATA__.repairing = [...__DATA__.repairing, obj];
      for (let r of obj.repairing) {
        const newRow = repairingTable.row
          .add([
            moment(obj.date).format("YYYY-MM-DD"),
            obj.driver.name,
            r.clientName || FALSE,
            r.clientPhone || FALSE,
            r.from || FALSE,
            r.value
          ])
          .draw(false)
          .node();
        $(newRow).attr("id", obj._id);
      }
    };
    const clearTable = () => {
      repairingTable.clear().draw();
      __DATA__.repairing = [];
    };

    return {
      addRepairingToTable: addToRepairingTable,
      clearRepairingTable: clearTable
    };
  };

  const initExpenses = () => {
    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [{ targets: [0, , 1, 2], width: "75px" }]
    };
    const expensesTable = $("#expenses-table").DataTable(tableConfig);

    const addToExpensesTable = obj => {
      __DATA__.expenses = [...__DATA__.expenses, obj];
      const newRow = expensesTable.row
        .add([
          obj.driver.name,
          moment(obj.date).format("YYYY-MM-DD"),
          obj.amount,
          obj.reason
        ])
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };
    const clearTable = () => {
      expensesTable.clear().draw();
      __DATA__.expenses = [];
    };

    return {
      addExpensesToTable: addToExpensesTable,
      clearExpensesTable: clearTable
    };
  };
  const initPayment = () => {
    let vueObj;
    const tableNode = $("#payment-table");
    const tableConfig = {
      paging: false,
      searching: false
    };
    const paymentTable = tableNode.DataTable(tableConfig);

    $("body").on("click", "#payment-table .remove-table", function() {
      const id = $(this).data("id");
      const row = paymentTable.row("#" + $(this).data("id"));
      const index = __DATA__.payment.findIndex(e => e._id == id);
      swal(
        {
          title: `  هل تريد الغاء الدفعة `,
          type: "info",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "نعم",
          cancelButtonText: "لا"
        },
        function(isConfirm) {
          if (isConfirm) {
            deletePayment({
              id,
              success() {
                swal("حذف", "", "success");
                row.remove().draw();
                __DATA__.payment = [
                  ...__DATA__.payment.slice(0, index),
                  ...__DATA__.payment.slice(index + 1)
                ];
              }
            });
          }
        }
      );
    });
    $("body").on("click", "#payment-table .edit-table", function() {
      const id = $(this).data("id");
      const data = __DATA__.payment.find(e => e._id == id);

      $("#payment-modal #modal").modal("show");
      vueObj.H_.title = "تعديل  الدفعة";
      vueObj.H_.edit = true;
      vueObj.H_.okBtnTitle = "تعديل";
      vueObj.H_.id = id;
      vueObj.date = data.date;
      vueObj.amount = data.amount;
    });

    const addToPaymentTable = obj => {
      __DATA__.payment = [...__DATA__.payment, obj];
      const newRow = paymentTable.row
        .add([
          moment(obj.date).format("YYYY-MM-DD"),
          obj.amount,
          renderTableAction(obj._id)
        ])
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };

    const editFromPaymentTable = ({ id, data }) => {
      __DATA__.payment = __DATA__.payment.map(e => (e._id == id ? data : e));
      const index = __DATA__.payment.findIndex(e => e._id == id);

      const row = paymentTable.row("#" + id);
      if (
        new Date(data.date).getMonth() == new Date(MainDate.date).getMonth()
      ) {
        const rowNode = row
          .data([
            moment(data.date).format("YYYY-MM-DD"),
            data.amount,
            renderTableAction(data._id)
          ])
          .draw(false);
      } else {
        row.remove().draw();
        __DATA__.payment = [
          ...__DATA__.payment.slice(0, index),
          ...__DATA__.payment.slice(index + 1)
        ];
      }
    };
    const clearTable = () => {
      paymentTable.clear().draw();
      __DATA__.payment = [];
    };

    const modalInit = () => {
      const validUser = obj => obj.amount && obj.date;

      vueObj = new Vue({
        el: "#payment-modal #modal",
        data: {
          H_: {
            title: "",
            okBtnTitle: "",
            edit: null,

            options: {
              format: "YYYY-MM-DD",
              useCurrent: true
            }
          },

          date: null,
          amount: null
        },
        methods: {
          ok() {
            const obj = TO_JSON(this.$data);
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

              putPayment({
                id,
                data: obj,
                success({ data }) {
                  editFromPaymentTable({ data, id });
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
              obj.user = user.user._id;

              addPayment({
                data: obj,
                success({ data }) {
                  if (
                    new Date(data.date).getMonth() ==
                    new Date(MainDate.date).getMonth()
                  )
                    addToPaymentTable(data);
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
            $("#payment-modal #modal").modal("hide");
          }
        }
      });
      const newPaymentBtn = $("#new-payment");
      const modalNode = $("#payment-modal #modal");
      newPaymentBtn.on("click", () => {
        modalNode.modal("show");
        vueObj.H_.title = "اضافة دفعة";
        vueObj.H_.edit = false;
        vueObj.H_.okBtnTitle = "اضافة";
        vueObj.date = moment().format("YYYY-MM-DD");
        vueObj.amount = null;
      });
    };
    modalInit();
    return {
      addPaymentToTable: addToPaymentTable,
      clearPaymentTable: clearTable
    };
  };

  const initSummary = () => {
    const summary = $("#summary");
    const payment = __DATA__.payment.reduce((a, b) => a + b.amount, 0);
    const expenses = __DATA__.expenses.reduce((a, b) => a + b.amount, 0);
    const repairing = __DATA__.repairing.reduce(
      (a, b) => a + b.repairing.reduce((_a, _b) => _a + _b.value, 0),
      0
    );
    const account = __DATA__.account.reduce((a, b) => {
      const totalTravel = b.travel.reduce(
        (_a, _b) =>
          _a +
          _b.cashTo +
          _b.cashBack +
          _b.repairing.reduce((__a, __b) => __a + __b.value, 0),
        0
      );
      const totalExpenses = b.travel.reduce((_a, _b) => _a + _b.expenses, 0);

      const totalExpensesOnCar = b.expenses.reduce(
        (_a, _b) => _a + _b.amount,
        0
      );
      const caProduct = totalTravel - totalExpenses - totalExpensesOnCar;
      const myValue = Math.round(caProduct * (b.part / 24) * 100) / 100;
      return a + myValue;
    }, 0);
    const total = account - repairing - expenses - payment;

    const str = `
    <div class="card-body" style="text-align: right;">
    <div class="row mb-3">
      <div class="col-9">
        <h4 style="color:  #5e72e4; ">
          العائد من السيارات
        </h4>
      </div>
      <div class="col-3">
        <h4 style="color:  #5e72e4; ">${account}</h4>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-9">
        <h4 style="color:  #5e72e4; ">
          وصول الدين التي يجب دفعها
        </h4>
      </div>
      <div class="col-3">
        <h4 style="color:  #5e72e4; ">${repairing}</h4>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-9">
        <h4 style="color:  #5e72e4; ">الطلبات الخارجية</h4>
      </div>
      <div class="col-3 ">
        <h4 style="color:  #5e72e4; ">${expenses}</h4>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-9">
        <h4 style="color:  #5e72e4; ">الدفعات</h4>
      </div>
      <div class="col-3">
        <h4 style="color:  #5e72e4; ">${payment}</h4>
      </div>
    </div>
  </div>
  <div class="card-footer" style="text-align: right;">
    <div class="row">
      <div class="col-9">
        <h4 style="color:  #5e72e4; ">المتبقي له</h4>

      </div>
      <div class="col-3">
        <h4 style="color:  #5e72e4; ">${total}</h4>
      </div>
    </div>
  </div>    
    
    `;
    summary.html(str);
  };

  const start = () => {
    renderSiteBar();
    const { addAccountTableToTable, clearAccountable } = initAccount();
    const { addRepairingToTable, clearRepairingTable } = initRepairing();
    const { addExpensesToTable, clearExpensesTable } = initExpenses();
    const { addPaymentToTable, clearPaymentTable } = initPayment();
    user = new Vue({
      el: "#user",
      data: {
        user: { name: "" }
      }
    });
    MainDate = new Vue({
      el: "#MainDate",
      data: {
        date: moment(new Date()).format("YYYY-MM"),
        options: {
          format: "YYYY-MM",
          useCurrent: true
        }
      },
      watch: {
        date(val) {
          let [y, m] = val.split("-");
          m = parseInt(m);
          y = parseInt(y);

          getData({
            m,
            y,
            success({ data: { payment, expenses, repairing, account } }) {
              clearAccountable();
              clearRepairingTable();
              clearPaymentTable();
              clearExpensesTable();
              for (let p of payment) addPaymentToTable(p);
              for (let e of expenses) addExpensesToTable(e);
              for (let r of repairing) addRepairingToTable(r);
              for (let a of Object.values(account)) addAccountTableToTable(a);
              initSummary();
            }
          });
        }
      },
      mounted() {
        let [y, m] = this.date.split("-");
        m = parseInt(m);
        y = parseInt(y);
        getData({
          m,
          y,
          success({ data: { payment, expenses, repairing, account } }) {
            for (let p of payment) addPaymentToTable(p);
            for (let e of expenses) addExpensesToTable(e);
            for (let r of repairing) addRepairingToTable(r);
            for (let a of Object.values(account)) addAccountTableToTable(a);
            initSummary();
          }
        });
        getDataConst({
          success({ data }) {
            user.user = data.user;
          }
        });
      }
    });
  };
  start();
});
