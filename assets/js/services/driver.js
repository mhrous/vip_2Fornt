const endPoint = "https://amyal-one.herokuapp.com/api";

const headers = {};

const getDriver = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/user/?power=D&onCar=1`,
    success,
    headers
  });
};

const getData = ({ success, m, y }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/page/driver_info?m=${m}&y=${y}`,
    success,
    headers
  });
};
