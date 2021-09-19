$(document).ready(function() {
  const { token, power } = testLogin("travel");
  renderSiteBar();
  const tableNode = $("table");

  const tableConfig = {
    paging: false,
    searching: false
  };
  const driverTable = tableNode.DataTable(tableConfig);

  $("#new-travel").on("click", function() {
    $("#travel-modal #modal").modal("show");
  });

  new Vue({
    el: "#travel-modal",
    data: {
      H_: {
        title: "اضافة رحلة"
      },
      t: []
    },
    methods: {
      addT() {
        this.t = [
          ...this.t,

          {
            id: new Date().getTime(),
            name: "",
            number: "",
            l: "",
            from: "",
            value: ""
          }
        ];
      },

      removeT(id) {
        this.t = this.t.filter(e => e.id !== id);
      }
    }
  });
});
