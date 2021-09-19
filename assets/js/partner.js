$(document).ready(function() {
  const { token, power } = testLogin("partner");

  const allPartnerTableInit = () => {
    const tableNode = $("#all-partner-table");

    const tableConfig = {
      paging: false,
      searching: false,
      columnDefs: [{ orderable: false, targets: 1 }]
    };
    const driverTable = tableNode.DataTable(tableConfig);

    getPartner({
      success({ data }) {
        data.forEach(({ address, name, phone, _id }) => {
          driverTable.row
            .add([
              `<a href="./onePartner.html?_id=${_id}">${name}</a>`,
              renderPhone(phone),
              address
            ])
            .draw(false);
        });
      }
    });
  };



  const start = () => {
    renderSiteBar();
    setTimeout(allPartnerTableInit, 0);
  };

  start();
});
