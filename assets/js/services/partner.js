const endPoint = "https://amyal-one.herokuapp.com/api/user";

const headers = {};

const getPartner = ({ success }) => {
    $.ajax({
      type: "GET",
      url: `${endPoint}?power=P`,
      success,
      headers
    });
  };


