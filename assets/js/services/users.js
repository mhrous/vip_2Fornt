const endPoint="https://vip2020.herokuapp.com/api/user",headers={},addUser=({data:e,success:s,error:r})=>{$.ajax({type:"POST",url:`${endPoint}`,data:e,success:s,error:r,headers:headers})},getUser=({success:e})=>{$.ajax({type:"GET",url:`${endPoint}`,success:e,headers:headers})},deleteUser=({id:e,success:s})=>{$.ajax({type:"DELETE",url:`${endPoint}/${e}`,success:s,headers:headers})},putUser=({id:e,data:s,success:r,error:a})=>{$.ajax({type:"PUT",url:`${endPoint}/${e}`,success:r,data:s,error:a,headers:headers})};