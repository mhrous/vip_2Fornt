(function() {
  const token = localStorage.getItem("token");
  const power = localStorage.getItem("power");
  logInlocally({ token, power });

  const logInForm = new Vue({
    el: "#form",
    data: {
      name: "",
      password: "",
      showPassword: false,
      error: ""
    },
    methods: {
      login() {
        if (this.name === "" || this.password === "") {
          return;
        }
        const data = { name: this.name, password: this.password };
        logIn({
          data,
          success: ({ data }) => {
            this.error = "";
            localStorage.setItem("token", data.token);
            localStorage.setItem("power", data.power);
            this.name = "";
            this.password = "";
            logInlocally(data);
          },
          error: ({ responseJSON }) => {
            this.error = responseJSON.message;
          }
        });
      }
    }
  });
})();
