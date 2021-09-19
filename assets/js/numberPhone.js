$(document).ready(function() {
  const { token, power } = testLogin("numberPhone");

  const driverTableInit = () => {
    const tableNode = $("#driver-table");
    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [{ orderable: false, targets: 1 }],
   
    };
    const driverTable = tableNode.DataTable(tableConfig);

    getDriver({
      success({ data }) {
        data.forEach(({ address, name, phone }) => {
          driverTable.row.add([name, renderPhone(phone), address]).draw(false);
        });
      }
    });
  };
  const start = () => {
    renderSiteBar();
    driverTableInit();
  };
  start();
});
