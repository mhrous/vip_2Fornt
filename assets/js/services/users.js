const endPoint = "https://amyal-one.herokuapp.com/api/user";

const headers = {};

const addUser = ({ data, success, error }) => {
  $.ajax({
    type: "POST",
    url: `${endPoint}`,
    data,
    success,
    error,
    headers
  });
};
const getUser = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}`,
    success,
    headers
  });
};

const deleteUser = ({ id, success }) => {
  $.ajax({
    type: "DELETE",
    url: `${endPoint}/${id}`,
    success,
    headers
  });
};

const putUser = ({ id, data, success, error }) => {
  $.ajax({
    type: "PUT",
    url: `${endPoint}/${id}`,
    success,
    data,
    error,

    headers
  });
};
