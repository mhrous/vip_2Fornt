const endPoint = "https://amyal-one.herokuapp.com";


const logIn = ({ data, success, error }) => {
  $.ajax({
    type: "POST",
    url: `${endPoint}/signin`,
    data,
    success,
    error
  });
};
