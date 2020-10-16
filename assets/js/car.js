$(document).ready(function(){const{token:e,power:a}=testLogin("car");let t=null,r=null,n=[];const d=()=>{const e=$("#all-cars-table"),t={paging:!1,searching:!1,columnDefs:[{orderable:!1,targets:[4]},{targets:[3,1,0],width:"70px"}]};"admin"==a&&($("#car-table-header").append("<th></th>"),t.columnDefs.push({width:"50px",orderable:!1,targets:5}));const d=e.DataTable(t);$("body").on("click",".remove-table",function(){const e=$(this).data("id"),a=d.row("#"+$(this).data("id")),t=n.findIndex(a=>a._id==e);swal({title:`هل تريد حذف ${n[t].name}`,type:"info",showCancelButton:!0,confirmButtonClass:"btn-danger",confirmButtonText:"نعم",cancelButtonText:"لا"},function(r){r&&deleteCar({id:e,success(){swal("حذف","","success"),a.remove().draw(),n=[...n.slice(0,t),...n.slice(t+1)]}})})}),$("body").on("click",".edit-table",function(){const e=$(this).data("id"),a=n.find(a=>a._id==e),t=[];a.partners.forEach(({partner:e,value:a,_id:r})=>{t.push({partner:e._id,value:a,_id:r})}),$("#car-modal #modal").modal("show"),r.H_.title="تعديل سيارة",r.H_.edit=!0,r.H_.okBtnTitle="تعديل",r.H_.id=e,r.name=a.name,r.number=a.number,r.driver=a.driver._id,r.expensesMax=a.expensesMax,r.partners=t});const s=e=>{let a="<div>";return e.forEach(e=>{a+=`<div class="row mb-3">\n                    ${e.partner.name} (${e.value})\n                </div> `}),a+="</div>"},i=e=>{n=[...n,e];const t=[e.name,e.number,e.driver.name,e.expensesMax,s(e.partners)];"admin"===a&&t.push(renderTableAction(e._id));const r=d.row.add(t).draw(!1).node();$(r).attr("id",e._id)};return getCar({success({data:e}){e.forEach(e=>{i(e)})}}),{addToTable:i,editFromTable:({id:e,data:t})=>{n=n.map(a=>a._id==e?t:a);const r=d.row("#"+e),i=[t.name,t.number,t.driver.name,t.expensesMax,s(t.partners)];"admin"===a&&i.push(renderTableAction(t._id));r.data(i).draw(!1)}}},s=({addToTable:e,editFromTable:t})=>{if("admin"!=a)return void $("#add-new-car-section").addClass("hide");r=new Vue({el:"#car-modal #modal",data:{H_:{title:"",okBtnTitle:"",edit:null,driverName:[],partnerName:[]},name:"",number:"",driver:"",expensesMax:null,partners:[{partner:"",value:null,_id:(new Date).getTime()}]},methods:{ok(){const a=JSON.parse(JSON.stringify(this.$data));if(delete a.H_,(e=>{if(!(e.name&&e.number&&e.driver&&e.expensesMax&&0!=e.partners.length))return!1;for(let a of e.partners)if(!a.partner||!a.value)return!1;return!0})(a)){if(this.H_.edit){const e=this.H_.id;putCar({id:e,data:a,success({data:a}){t({data:a,id:e})},error(e){swal({title:e.responseJSON.error,type:"info",confirmButtonText:"اعد التعبئة",closeOnConfirm:!1})}})}else addCar({data:a,success({data:a}){e(a)},error(e){swal({title:e.responseJSON.error,type:"info",confirmButtonText:"اعد التعبئة",closeOnConfirm:!1})}});$("#car-modal #modal").modal("hide")}else swal({title:"بعض الحقول ناقصة",type:"warning",confirmButtonText:"اعد التعبئة",closeOnConfirm:!1})},addPartner(){this.partners=[...this.partners,{partner:"",value:0,_id:(new Date).getTime()}]},removePartner(e){this.partners=this.partners.filter(a=>a._id!==e)}}});const n=$("#new-car"),d=$("#car-modal #modal");n.on("click",()=>{d.modal("show"),r.H_.title="اضافة سيارة",r.H_.edit=!1,r.H_.okBtnTitle="اضافة",r.name="",r.number="",r.driver="",r.expensesMax=null,r.partners=[{partner:"",value:null,_id:(new Date).getTime()}]})};(()=>{renderSiteBar();const{addToTable:e,editFromTable:a}=d();s({addToTable:e,editFromTable:a});const{accountBulid:n}=(()=>{const e=$("#account-table").DataTable({paging:!1,searching:!1});return{accountBulid:a=>{e.clear().draw();for(let t of Object.values(a)){const a=t.expensesMax,r=t.name,n=t.number,d=t.driverName,s=t.travel.length;let i=0;t.travel.forEach(e=>{const a=e.repairing.reduce((e,a)=>e+(a.isGO?0:a.value),0),t=e.repairing.reduce((e,a)=>e+(a.isGO?a.value:0),0);0==e.cashTo&&0==t&&i++,0==e.cashBack&&0==a&&i++});const o=t.travel.reduce((e,t)=>e+(t.expenses>a?1:0),0),l=t.travel.reduce((e,a)=>e+a.repairing.length,0),c=t.travel.reduce((e,a)=>e+a.repairing.reduce((e,a)=>e+a.value,0),0),u=t.travel.reduce((e,a)=>e+a.cashTo+a.cashBack+a.repairing.reduce((e,a)=>e+a.value,0),0),m=t.travel.reduce((e,a)=>e+a.expenses,0),p=t.expenses.reduce((e,a)=>e+a.amount,0),h=u-m-p;e.row.add([r,n,d,s,i,o,l,c,u,m,p,h]).draw(!1)}}}})();getPartnerAndDriverName({success({data:e}){e.forEach(e=>{"D"==e.power?r.H_.driverName=[...r.H_.driverName,e]:"P"==e.power&&(r.H_.partnerName=[...r.H_.partnerName,e])})}}),t=new Vue({el:"#MainDate",data:{date:moment(new Date).format("YYYY-MM"),options:{format:"YYYY-MM",useCurrent:!0}},watch:{date(e){let[a,t]=e.split("-");t=parseInt(t),a=parseInt(a),getData({m:t,y:a,success({data:e}){n(e)}})}},mounted(){let[e,a]=this.date.split("-");a=parseInt(a),e=parseInt(e),getData({m:a,y:e,success({data:e}){n(e)}})}})})()});