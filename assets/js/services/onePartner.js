const endPoint="https://vip2020.herokuapp.com/api",headers={},id=window.location.search.split("=")[1],getDataConst=({success:e})=>{$.ajax({type:"GET",url:`${endPoint}/page/one_partner_const${window.location.search}`,success:e,headers:headers})},getData=({success:e,m:a,y:s})=>{$.ajax({type:"GET",url:`${endPoint}/page/one_partner${window.location.search}&m=${a}&y=${s}`,success:e,headers:headers})},addPayment=({data:e,success:a,error:s})=>{$.ajax({type:"POST",url:`${endPoint}/payment`,data:e,success:a,error:s,headers:headers})},deletePayment=({id:e,success:a})=>{$.ajax({type:"DELETE",url:`${endPoint}/payment/${e}`,success:a,headers:headers})},putPayment=({id:e,data:a,success:s,error:t})=>{$.ajax({type:"PUT",url:`${endPoint}/payment/${e}`,success:s,data:a,error:t,headers:headers})};