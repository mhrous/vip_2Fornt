$(document).ready(function() {
  const { token, power } = testLogin("notifications");
  renderSiteBar();
  const tableNode = $("table");

  const tableConfig = {
    paging: false,
    searching: false
  };
  const driverTable = tableNode.DataTable(tableConfig);
});
