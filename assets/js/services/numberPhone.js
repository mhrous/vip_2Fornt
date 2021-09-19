const endPoint = "https://amyal-one.herokuapp.com/api/user";

const headers = {};

const getDriver = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}`,
    success,
    headers
  });
};
