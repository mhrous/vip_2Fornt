const endPoint = "https://amyal-one.herokuapp.com/api";
const headers = {};
const id = window.location.search.split("=")[1];

const getDataConst = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/page/one_partner_const${window.location.search}`,
    success,
    headers
  });
};

const getData = ({ success, m, y }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/page/one_partner${window.location.search}&m=${m}&y=${y}`,
    success,
    headers
  });
};

const addPayment = ({ data, success, error }) => {
  $.ajax({
    type: "POST",
    url: `${endPoint}/payment`,
    data,
    success,
    error,
    headers
  });
};

const deletePayment = ({ id, success }) => {
  $.ajax({
    type: "DELETE",
    url: `${endPoint}/payment/${id}`,
    success,
    headers
  });
};

const putPayment = ({ id, data, success, error }) => {
  $.ajax({
    type: "PUT",
    url: `${endPoint}/payment/${id}`,
    success,
    data,
    error,

    headers
  });
};
