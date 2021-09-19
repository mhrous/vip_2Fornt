let i = 1;
$(document).ready(function() {
  const { token, power } = testLogin("oneDriver");
  let user, MainDate;
  const __DATA__ = {
    cars: [],
    partners: [],
    payment: [],
    expenses: [],
    travel: []
  };

  const initTravel = () => {
    let vueObj;
    const tableNode = $("#travel-table");
    const repairingTable = $("#repairing-table");
    const _repairingTable = repairingTable.DataTable({
      paging: false,
      searching: false
    });

    const addToRepairingTable = data => {
      console.log(data.repairing);

      if (!data.repairing) return;
      console.log(data.repairing);
      data.repairing.forEach(obj => {
        const newRow = _repairingTable.row
          .add([
            moment(data.date).format("YYYY-MM-DD"),
            obj.clientName || FALSE,
            obj.clientPhone || FALSE,
            ` <a href="./onePartner.html?_id=${obj.partner}">${
              __DATA__.partners.find(c => c._id == obj.partner).name
            }</a>`,
            obj.from || FALSE,
            obj.value
          ])
          .draw(false)
          .node();
        $(newRow).addClass(`${data._id}`);
      });
    };
    const removeFromRepairingTable = data => {
      if (!data.repairing) return;
      const row = _repairingTable
        .rows(`.${data._id}`)
        .remove()
        .draw();
    };
    const editFromRepairingTable = data => {
      data.forEach(obj => {
        console.log(obj);
        const row = _repairingTable.row(`#${new Date(obj._id).getTime()}`);
        const rowNode = row
          .data([
            moment(obj.date).format("YYYY-MM-DD"),
            obj.clientName || FALSE,
            obj.clientPhone || FALSE,
            ` <a href="./onePartner.html?_id=${obj.partner}">${
              __DATA__.partners.find(c => c._id == obj.partner).name
            }</a>`,
            obj.from || FALSE,
            obj.value
          ])
          .draw(false);
      });
    };

    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [{ targets: [0, 1, 2, 3, 5, 6], width: "75px" }]
    };
    const travelTable = tableNode.DataTable(tableConfig);
    const renderRepairing = array => {
      if (array.length == 0) return FALSE;
      let str = "<div>";
      array.forEach(e => {
        str += `<p> ${
          __DATA__.partners.find(c => c._id == e.partner).name
        } : (${e.value})</p>`;
      });
      str += "</div>";
      return str;
    };
    const getRes = obj =>
      obj.cashTo +
      obj.cashBack +
      obj.repairing.reduce((a, b) => a + b.value, 0) -
      obj.expenses;

    $("body").on("click", "#travel-table .remove-table", function() {
      const id = $(this).data("id");
      const row = travelTable.row("#" + $(this).data("id"));
      const index = __DATA__.travel.findIndex(e => e._id == id);
      swal(
        {
          title: `  هل تريد حذف السفرة `,
          type: "info",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "نعم",
          cancelButtonText: "لا"
        },
        function(isConfirm) {
          if (isConfirm) {
            deleteTravel({
              id,
              success() {
                swal("حذف", "", "success");
                row.remove().draw();
                removeFromRepairingTable(__DATA__.travel[index]);
                __DATA__.travel = [
                  ...__DATA__.travel.slice(0, index),
                  ...__DATA__.travel.slice(index + 1)
                ];
              }
            });
          }
        }
      );
    });
    $("body").on("click", "#travel-table .edit-table", function() {
      const id = $(this).data("id");
      const data = __DATA__.travel.find(e => e._id == id);
      $("#travel-modal #modal").modal("show");
      vueObj.H_.title = "تعديل  السفرة";
      vueObj.H_.edit = true;
      vueObj.H_.okBtnTitle = "تعديل";
      vueObj.H_.partner = __DATA__.partners;

      vueObj.H_.id = id;
      vueObj.date = data.date;
      vueObj.expenses = data.expenses;
      vueObj.cashTo = data.cashTo;
      vueObj.cashBack = data.cashBack;
      vueObj.repairing = data.repairing;
    });

    const addToTravelTable = obj => {
      __DATA__.travel = [...__DATA__.travel, obj];
      addToRepairingTable(obj);
      const newRow = travelTable.row
        .add([
          moment(obj.date).format("YYYY-MM-DD"),
          obj.expenses,
          obj.cashTo,
          obj.cashBack,
          renderRepairing(obj.repairing),
          getRes(obj),
          renderTableAction(obj._id)
        ])
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };

    const editFromTravelTable = ({ id, data }) => {
      __DATA__.travel = __DATA__.travel.map(e => (e._id == id ? data : e));
      const index = __DATA__.travel.findIndex(e => e._id == id);
      const row = travelTable.row("#" + id);
      if (
        new Date(data.date).getMonth() == new Date(MainDate.date).getMonth()
      ) {
        console.log(data.repairing, ";;;;;;;;;");
        removeFromRepairingTable(data);
        addToRepairingTable(data);
        const rowNode = row
          .data([
            moment(data.date).format("YYYY-MM-DD"),
            data.expenses,
            data.cashTo,
            data.cashBack,
            renderRepairing(data.repairing),

            getRes(data),
            renderTableAction(data._id)
          ])
          .draw(false);
      } else {
        row.remove().draw();
        removeFromRepairingTable(__DATA__.travel[index]);

        __DATA__.travel = [
          ...__DATA__.travel.slice(0, index),
          ...__DATA__.travel.slice(index + 1)
        ];
      }
    };

    const clearTable = () => {
      _repairingTable.clear().draw();
      travelTable.clear().draw();
      __DATA__.travel = [];
    };

    const modalInit = () => {
      const validTravel = obj =>
        obj.expenses &&
        obj.date &&
        !obj.repairing.find(e => !e.partner || !e.value);

      vueObj = new Vue({
        el: "#travel-modal #modal",
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
          expenses: null,
          cashTo: null,
          cashBack: null,
          repairing: []
        },
        methods: {
          addRepairing() {
            this.repairing = [
              ...this.repairing,
              {
                _id: new Date().getTime(),
                partner: null,
                from: null,
                clientPhone: null,
                clientName: null,
                value: null,
                isGO: true
              }
            ];
          },
          removeRepairing(_id) {
            this.repairing = this.repairing.filter(e => e._id !== _id);
          },

          ok() {
            const obj = TO_JSON(this.$data);
            delete obj.H_;
            obj.date = moment(obj.date).format("YYYY-MM-DD");

            if (!validTravel(obj)) {
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

              putTravel({
                id,
                data: obj,
                success({ data }) {
                  editFromTravelTable({ data, id });
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
              obj.driver = user.user._id;
              obj.car = user.car._id;

              addTravel({
                data: obj,
                success({ data }) {
                  if (
                    new Date(data.date).getMonth() ==
                    new Date(MainDate.date).getMonth()
                  )
                    addToTravelTable(data);
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
            $("#travel-modal #modal").modal("hide");
          }
        }
      });

      const newTravelBtn = $("#new-travel");
      const modalNode = $("#travel-modal #modal");
      newTravelBtn.on("click", () => {
        modalNode.modal("show");
        vueObj.H_.title = "اضافة سفرة";
        vueObj.H_.edit = false;
        vueObj.H_.okBtnTitle = "اضافة";
        vueObj.H_.partner = __DATA__.partners;

        vueObj.date = moment().format("YYYY-MM-DD");
        vueObj.expenses = null;
        vueObj.cashTo = null;
        vueObj.cashBack = null;
        vueObj.repairing = [];
      });
    };
    modalInit();
    return {
      addTravelToTable: addToTravelTable,
      clearTravelTable: clearTable
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
            obj.date = moment(obj.date).format("YYYY-MM-DD");

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

  const initExpenses = () => {
    const renderPartnerLink = ({ _id, name }) => `
    <a href="./onePartner.html?_id=${_id}">${name}</a>
    `;
    let vueObj;
    const tableNode = $("#expenses-table");
    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [
        { targets: [0, 5], width: "75px" },
        { targets: [2, 3, 4, 6], width: "50px" }
      ]
    };
    const expensesTable = tableNode.DataTable(tableConfig);

    $("body").on("click", "#expenses-table .remove-table", function() {
      const id = $(this).data("id");
      const row = expensesTable.row("#" + $(this).data("id"));
      const index = __DATA__.expenses.findIndex(e => e._id == id);
      swal(
        {
          title: `  هل تريد الغاء المصروف `,
          type: "info",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "نعم",
          cancelButtonText: "لا"
        },
        function(isConfirm) {
          if (isConfirm) {
            deleteExpenses({
              id,
              success() {
                swal("حذف", "", "success");
                row.remove().draw();
                __DATA__.expenses = [
                  ...__DATA__.expenses.slice(0, index),
                  ...__DATA__.expenses.slice(index + 1)
                ];
              }
            });
          }
        }
      );
    });
    $("body").on("click", "#expenses-table .edit-table", function() {
      const id = $(this).data("id");
      const data = __DATA__.expenses.find(e => e._id == id);

      $("#expenses-modal #modal").modal("show");
      vueObj.H_.title = "تعديل  المصروف";
      vueObj.H_.edit = true;
      vueObj.H_.okBtnTitle = "تعديل";
      vueObj.H_.partner = __DATA__.partners;
      vueObj.H_.id = id;
      vueObj.date = data.date;
      vueObj.amount = data.amount;
      vueObj.reason = data.reason;
      vueObj.onCar = data.onCar;
      vueObj.onDriver = data.onDriver;
      vueObj.onPartner = data.onPartner;
      vueObj.partner = data.partner._id;
    });

    const addToExpensesTable = obj => {
      __DATA__.expenses = [...__DATA__.expenses, obj];
      const newRow = expensesTable.row
        .add([
          moment(obj.date).format("YYYY-MM-DD"),
          obj.reason,
          obj.amount,
          obj.onCar ? TRUE : FALSE,
          obj.onDriver ? TRUE : FALSE,
          obj.onPartner ? renderPartnerLink(obj.partner) : FALSE,
          renderTableAction(obj._id)
        ])
        .draw(false)
        .node();
      $(newRow).attr("id", obj._id);
    };
    const editFromExpensesTable = ({ id, data }) => {
      __DATA__.expenses = __DATA__.expenses.map(e => (e._id == id ? data : e));
      const index = __DATA__.expenses.findIndex(e => e._id == id);

      const row = expensesTable.row("#" + id);
      if (
        new Date(data.date).getMonth() == new Date(MainDate.date).getMonth()
      ) {
        const rowNode = row
          .data([
            moment(data.date).format("YYYY-MM-DD"),
            data.reason,
            data.amount,
            data.onCar ? TRUE : FALSE,
            data.onDriver ? TRUE : FALSE,
            data.onPartner ? renderPartnerLink(data.partner) : FALSE,
            renderTableAction(data._id)
          ])
          .draw(false);
      } else {
        row.remove().draw();
        __DATA__.expenses = [
          ...__DATA__.expenses.slice(0, index),
          ...__DATA__.expenses.slice(index + 1)
        ];
      }
    };
    const clearTable = () => {
      expensesTable.clear().draw();
      __DATA__.expenses = [];
    };

    const modalInit = () => {
      const validExpenses = obj =>
        obj.amount &&
        obj.date &&
        (obj.onPartner || obj.onDriver || obj.onCar) &&
        ((obj.onPartner && obj.partner) || (!obj.onPartner && !obj.partner));

      vueObj = new Vue({
        el: "#expenses-modal #modal",
        data: {
          H_: {
            title: "",
            okBtnTitle: "",
            edit: null,
            partner: __DATA__.partners,
            options: {
              format: "YYYY-MM-DD",
              useCurrent: true
            }
          },

          date: null,
          amount: null,
          reason: "",
          onCar: true,
          onDriver: true,
          onPartner: false,
          partner: null
        },
        methods: {
          ok() {
            const obj = TO_JSON(this.$data);
            if (!obj.partner) delete obj.partner;
            obj.date = moment(obj.date).format("YYYY-MM-DD");
            delete obj.H_;

            if (!validExpenses(obj)) {
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

              putExpenses({
                id,
                data: obj,
                success({ data }) {
                  editFromExpensesTable({ data, id });
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
              obj.driver = user.user._id;
              obj.car = user.car._id;

              addExpenses({
                data: obj,
                success({ data }) {
                  if (
                    new Date(data.date).getMonth() ==
                    new Date(MainDate.date).getMonth()
                  )
                    addToExpensesTable(data);
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
            $("#expenses-modal #modal").modal("hide");
          }
        }
      });
      const newExpensesBtn = $("#new-expenses");
      const modalNode = $("#expenses-modal #modal");
      newExpensesBtn.on("click", () => {
        modalNode.modal("show");
        vueObj.H_.title = "اضافة مصروف";
        vueObj.H_.edit = false;
        vueObj.H_.partner = __DATA__.partners;
        vueObj.H_.okBtnTitle = "اضافة";
        vueObj.date = moment().format("YYYY-MM-DD");
        vueObj.amount = null;
        vueObj.reason = "";
        vueObj.onCar = true;
        vueObj.onDriver = true;
        vueObj.onPartner = false;
        vueObj.partner = null;
      });
    };
    modalInit();
    return {
      addExpensesToTable: addToExpensesTable,
      clearExpensesTable: clearTable
    };
  };

  initSummary = () => {
    const summary = $("#summary");
    const countTravel = __DATA__.travel.length;
    const expensesMax = user.car.expensesMax;
    const numberOfTavelAbofExpenseMax = __DATA__.travel.reduce(
      (a, b) => a + (b.expenses > expensesMax ? 1 : 0),
      0
    );
    const numberRepairing = __DATA__.travel.reduce(
      (a, b) => a + b.repairing.length,
      0
    );
    const totalTravel = __DATA__.travel.reduce(
      (a, obj) =>
        a +
        obj.cashTo +
        obj.cashBack +
        obj.repairing.reduce((_a, _b) => _a + _b.value, 0),
      0
    );

    const totalExpenses = __DATA__.travel.reduce(
      (a, obj) => a + obj.expenses,
      0
    );
    const totalExpensesOnDriver = __DATA__.expenses.reduce(
      (a, b) => a + (b.onDriver ? b.amount : 0),
      0
    );
    const totalExpensesOnCar = __DATA__.expenses.reduce(
      (a, b) => a + (b.onCar ? b.amount : 0),
      0
    );
    const totalRepairing = __DATA__.travel.reduce(
      (a, obj) => a + obj.repairing.reduce((_a, _b) => _a + _b.value, 0),
      0
    );
    const totalPayment = __DATA__.payment.reduce((a, b) => a + b.amount, 0);

    const getFromUser =
      totalTravel -
      totalExpenses -
      totalExpensesOnDriver -
      totalRepairing -
      totalPayment;
    const caProduct = totalTravel - totalExpenses - totalExpensesOnCar;
    let ematyTravel = 0;
    __DATA__.travel.forEach(e => {
      const repairingBackValue = e.repairing.reduce(
        (a, b) => a + (b.isGO ? 0 : b.value),
        0
      );
      const repairingGoValue = e.repairing.reduce(
        (a, b) => a + (b.isGO ? b.value : 0),
        0
      );

      if (e.cashTo == 0 && repairingGoValue == 0) ematyTravel++;
      if (e.cashBack == 0 && repairingBackValue == 0) ematyTravel++;
    });

    //   str = `

    //   <div class="card  shadow p-2 mb-3">
    //   <div class="card-header">
    //     <h4 style="color:  #5e72e4; text-align: center;">صافي السيارة</h4>
    //   </div>
    //   <div class="card-body" style="text-align: right;">
    //     <div class="row">
    //       <div class="col-9">
    //         <h4 style="color:  #5e72e4; ">سفرات</h4>
    //       </div>
    //       <div class="col-3">
    //         <h4 style="color:  #5e72e4; ">${totalTravel}</h4>
    //       </div>
    //     </div>
    //     <div class="row">
    //       <div class="col-9">
    //         <h4 style="color:  #5e72e4; ">مصروف</h4>
    //       </div>
    //       <div class="col-3">
    //         <h4 style="color:  #5e72e4; ">${totalExpenses}</h4>
    //       </div>
    //     </div>
    //     <div class="row">
    //       <div class="col-9">
    //         <h4 style="color:  #5e72e4; ">تصليح</h4>
    //       </div>
    //       <div class="col-3">
    //         <h4 style="color:  #5e72e4; ">${totalExpensesOnCar}</h4>
    //       </div>
    //     </div>
    //   </div>

    //   <div class="card-footer">
    //     <div class="row">

    //       <div class="col-9"></div>
    //       <div class="col-3" style="text-align: right;">
    //         <h4 style="color:  #5e72e4;">${caProduct}</h4>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    str = `
    <div class="card shadow mb-3">
    <div class="card-header">
      <h4 style="color:  #5e72e4; text-align: center;">معلومات السائق</h4>
    </div>
    <div class="card-body" style="text-align: right;">
      <div class="row">
        <div class="col-6">
          <div class="row mb-3">
            <div class="col-9">
              <h4 class="mb-3">عدد السفرات :</h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${countTravel}</h4>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-9">
              <h4 class="mb-3">عدد السفرات الفارغة :</h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${ematyTravel}</h4>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-9">
              <h4 class="mb-3">تجاوز المصروف الاقصى (${expensesMax}) :</h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${numberOfTavelAbofExpenseMax}</h4>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-9">
              <h4 class="mb-3">عدد ايصالات الدين :</h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${numberRepairing}</h4>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3 row">
            <div class="col-9">
              <h4 class="mb-3">قيمة السفرات :</h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${totalTravel}</h4>
            </div>
          </div>
          <div class="mb-3 row">
            <div class="col-9">
              <h4 class="mb-3">اجمالي المصروف :</h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${totalExpenses}</h4>
            </div>
          </div>

          <hr />
          <div class="mb-3 row">
          <div class="col-9">
          <h4 class="mb-3">الاجمالي  :</h4>

          </div>
          <div class="col-3">
            <h4 style="color:  #5e72e4;">${totalTravel - totalExpenses}</h4>
          </div>
        </div>


          <div class="mb-3 row">
            <div class="col-9">
              <h4 class="mb-3">
                اجمالي التصليحات دفعها السائق :
              </h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${totalExpensesOnDriver}</h4>
            </div>
          </div>
  

  
          <div class="mb-3 row">
            <div class="col-9">
              <h4 class="mb-3">اجمالي وصول الدين :</h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${totalRepairing}</h4>
            </div>
          </div>
          <div class="mb-3 row">
            <div class="col-9">
              <h4 class="mb-3">اجمالي الدفعات :</h4>
            </div>
            <div class="col-3">
              <h4 style="color:  #5e72e4;">${totalPayment}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer" style="text-align:right;">
      <div class="mb-3 row">
        <div class="col-6"></div>
        <div class="col-6 row">
        <div class="col-9">
        <h4 class="mb-3">المبلغ الواجب قبضه :</h4>
      </div>
      <div class="col-3">
        <h4 style="color:  #5e72e4;">${getFromUser}</h4>
      </div>
        </div>
        
      </div>
    </div>
  </div>
  
  

    `;
    summary.html(str);
  };
  const start = () => {
    renderSiteBar();
    const { addExpensesToTable, clearExpensesTable } = initExpenses();
    const { addPaymentToTable, clearPaymentTable } = initPayment();
    const { addTravelToTable, clearTravelTable } = initTravel();

    $("#tap-summary").on("click", initSummary);

    user = new Vue({
      el: "#user",
      data: {
        user: { name: "" },
        car: null
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
            success({ data: { payment, expenses, travel } }) {
              clearPaymentTable();
              clearExpensesTable();
              clearTravelTable();
              for (let p of payment) addPaymentToTable(p);
              for (let p of expenses) addExpensesToTable(p);
              for (let t of travel) addTravelToTable(t);
              initSummary();
            }
          });
        }
      },
      mounted() {
        let [y, m] = this.date.split("-");
        m = parseInt(m);
        y = parseInt(y);

        getDataConst({
          success({ data: { car, partners } }) {
            user.user = car.driver;
            __DATA__.car = car;
            __DATA__.partners = partners;
            user.car = car;

            getData({
              m,
              y,
              success({ data: { payment, expenses, travel } }) {
                for (let p of expenses) addExpensesToTable(p);
                for (let p of payment) addPaymentToTable(p);
                for (let t of travel) addTravelToTable(t);
                initSummary();
              }
            });
          }
        });
      }
    });
  };
  start();
});
