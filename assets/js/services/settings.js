const endPoint = "https://amyal-one.herokuapp.com/api";

const headers = {};

const getMe = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/user/me`,
    success,
    headers
  });
};

const putMe = ({ data, success, error }) => {
  $.ajax({
    type: "PUT",
    url: `${endPoint}/user/me`,
    success,
    headers,
    data,
    error
  });
};
const getPartnerAndDriverName = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/user/name`,
    success,
    headers
  });
};
const InfoDriver = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/info/driver`,
    success,
    headers
  });
};

const InfoPartner = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/info/partner`,
    success,
    headers
  });
};

const InfoCar = ({ success }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/info/car`,
    success,
    headers
  });
};

//
const accountDriver = ({ success, y, m }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/account/drivers?y=${y}&m=${m}`,
    success,
    headers
  });
};

//

const accountCar = ({ success, y, m }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/account/cars?y=${y}&m=${m}`,
    success,
    headers
  });
};
const accountPartner = ({ success, y, m }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/account/partners?y=${y}&m=${m}`,
    success,
    headers
  });
};

const driver = ({ success, y, m, d }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/account/_driver?y=${y}&m=${m}&d=${d}`,
    success,
    headers
  });
};
const partner = ({ success, y, m, p }) => {
  $.ajax({
    type: "GET",
    url: `${endPoint}/reports/account/_partner?y=${y}&m=${m}&p=${p}`,
    success,
    headers
  });
};
