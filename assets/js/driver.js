$(document).ready(function() {
  const { token, power } = testLogin("driver");

  const allDriverTableInit = () => {
    const tableNode = $("#all-drivers-table");

    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [{ orderable: false, targets: 1 }]
    };
    const driverTable = tableNode.DataTable(tableConfig);

    getDriver({
      success({ data }) {
        data.forEach(({ address, name, phone, _id }) => {
          driverTable.row
            .add([
              `<a href="./oneDriver.html?_id=${_id}">${name}</a>`,
              renderPhone(phone),
              address
            ])
            .draw(false);
        });
      }
    });
  };
  const accountInit = () => {
    const tableNode = $("#account-table");
    const tableConfig = {
      paging: false,
      searching: false
    };
    const accountTable = tableNode.DataTable(tableConfig);

    const bulid = data => {
      accountTable.clear().draw();

      for (let obj of Object.values(data)) {
        // const expensesMax = obj.expensesMax;

        const name = obj.name;
        const countTravel = obj.travel.length;
        let ematyTravel = 0;
        obj.travel.forEach(e => {
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
        const numberOfTavelAbofExpenseMax = obj.travel.reduce(
          (a, b) => a + (b.expenses > b.car.expensesMax ? 1 : 0),
          0
        );
        const numberRepairing = obj.travel.reduce(
          (a, b) => a + b.repairing.length,
          0
        );
        const totalRepairing = obj.travel.reduce(
          (a, b) => a + b.repairing.reduce((_a, _b) => _a + _b.value, 0),
          0
        );
        const totalTravel = obj.travel.reduce(
          (a, b) =>
            a +
            b.cashTo +
            b.cashBack +
            b.repairing.reduce((_a, _b) => _a + _b.value, 0),
          0
        );
        const totalExpenses = obj.travel.reduce((a, b) => a + b.expenses, 0);
        const totalExpensesOnDriver = obj.expenses.reduce(
          (a, b) => a + b.amount,
          0
        );
        const totalPayment = obj.payment.reduce((a, b) => a + b.amount, 0);
        const total =
          totalTravel - totalExpenses -totalRepairing- totalPayment - totalExpensesOnDriver;
        accountTable.row
          .add([
            name,
            countTravel,
            ematyTravel,
            numberOfTavelAbofExpenseMax,
            numberRepairing,
            totalRepairing,
            totalTravel,
            totalExpenses,
            totalExpensesOnDriver,
            totalPayment,
            total
          ])
          .draw(false);
      }
    };

    return { accountBulid: bulid };
  };

  const start = () => {
    renderSiteBar();
    const { accountBulid } = accountInit();
    allDriverTableInit();

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
            success({ data }) {
              accountBulid(data);
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
          success({ data }) {

            accountBulid(data);
          }
        });
      }
    });
  };
  start();
});
