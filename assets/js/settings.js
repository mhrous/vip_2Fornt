$(document).ready(function(){const{token:e,power:t}=testLogin();let r=null;const s=()=>{r=new Vue({el:"#card",data:{H_:{showPassword:!1,showNewPassword:!1},name:"",address:"",phone:[],password:"",newpPassword:""},methods:{newPhone(){this.phone=[...this.phone,{phoneType:"",value:"",_id:(new Date).getTime()}]},removePhon(e){this.phone=this.phone.filter(t=>t._id!==e)},ok(){const e=JSON.parse(JSON.stringify(this.$data));delete e.H_,e.password?(e=>{if(!(e.name&&e.address&&e.phone&&e.password))return!1;for(let{value:t,phoneType:r}of e.phone)if(!t||!r)return!1;return!0})(e)?putMe({data:e,success:({data:e})=>{this.name=e.name,this.address=e.address,this.phone=e.phone||[],this.password="",this.newpPassword="",this.H_={showPassword:!1,showNewPassword:!1},swal({title:"تم التغير بنجاح",type:"success",confirmButtonText:"اغلاق",closeOnConfirm:!1})},error(e){swal({title:e.responseJSON.error,type:"info",confirmButtonText:"اعد التعبئة",closeOnConfirm:!1})}}):swal({title:"بعض الحقول ناقصة",type:"warning",confirmButtonText:"اعد التعبئة",closeOnConfirm:!1}):swal({title:"يجب ادخال كلمة المرور",type:"warning",confirmButtonText:"اعد التعبئة",closeOnConfirm:!1})}}})},a=()=>{const e=new Vue({el:"#reports",data:{years:[2019,2020,2021,2022,2023,2024,2025],months:[1,2,3,4,5,6,7,8,9,10,11,12],ySelect:(new Date).getFullYear(),mSelect:(new Date).getMonth()+1,driver:[],partner:[],sDriver:null,sPartner:null},methods:{reset(){this.ySelect=(new Date).getFullYear(),this.mSelect=(new Date).getMonth()+1,this.sDriver=null,this.sPartner=null},printInfoDriver(){InfoDriver({success({data:e}){pdfMake.createPdf(e.doc).download(e.fileName)}})},printInfoPartner(){InfoPartner({success({data:e}){pdfMake.createPdf(e.doc).download(e.fileName)}})},printInfoCar(){InfoCar({success({data:e}){pdfMake.createPdf(e.doc).download(e.fileName)}})},printAccountDriver(){accountDriver({success({data:e}){console.log(e),pdfMake.createPdf(e.doc).download(e.fileName)},y:this.ySelect,m:this.mSelect})},printAccountCars(){accountCar({success({data:e}){pdfMake.createPdf(e.doc).download(e.fileName)},y:this.ySelect,m:this.mSelect})},printDriver(){driver({success({data:e}){pdfMake.createPdf(e.doc).download(e.fileName)},y:this.ySelect,m:this.mSelect,d:this.sDriver})},PrintPartner(){partner({success({data:e}){pdfMake.createPdf(e.doc).download(e.fileName)},y:this.ySelect,m:this.mSelect,p:this.sPartner})}}});getPartnerAndDriverName({success({data:t}){t.forEach(t=>{"D"==t.power?e.driver=[...e.driver,t]:"P"==t.power&&(e.partner=[...e.partner,t])})}})};renderSiteBar(),getMe({success({data:e}){r.name=e.name,r.address=e.address,r.phone=e.phone||[]}}),s(),a()});