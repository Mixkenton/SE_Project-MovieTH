import { PaymentUploadInterface,Topic,Report } from "../../interface/mix";

// const apiUrl = "http://localhost:8080";
const apiUrl = "https://api.movieth.site";
const jwt = localStorage.getItem('token');

async function PaymentUserUpload(ID: Number | undefined,data: PaymentUploadInterface,PackageID: Number | undefined):Promise<any> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/payment/${ID}/${PackageID}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}
async function PaymentAdmin() {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/admin/payment`, requestOptions)
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res.data;

    }else{
      return false;
    }

  });
  return res;
}
async function PaymentAdminAllowed(ID: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/admin/payment/${ID}`, requestOptions)
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res.data;

    }else{
      return false;
    }

  });
  return res;
}
async function UpdateSubscribe(UserID: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/admin/subscribe/${UserID}`, requestOptions)
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res.data;

    }else{
      return false;
    }

  });
  return res;
}

async function PaymentAdminNotAllowed(ID: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/admin/payment2/${ID}`, requestOptions)
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res.data;

    }else{
      return false;
    }

  });
  return res;
}
async function UpdateSubscribe2(UserID: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/admin/subscribe2/${UserID}`, requestOptions)
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res.data;

    }else{
      return false;
    }

  });
  return res;
}
async function SubscribeCheck(UserID: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/login/subscribe/${UserID}`, requestOptions)
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res.data;

    }else{
      return false;
    }

  });
  return res;
}

async function GetUserByID(UserID: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/payment/${UserID}`, requestOptions)
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res.data;

    }else{
      return false;
    }

  });
  return res;
}
async function GetPackageByID(PackageID: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = await fetch(`${apiUrl}/payment/package/${PackageID}`, requestOptions)
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res.data;

    }else{
      return false;
    }

  });
  return res;
}
async function UpdateNameAdmin(ID: Number,AdminName: string, PriceBill:Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };
  let res = await fetch(`${apiUrl}/admin/payment/nameupdate/${ID}/${AdminName}/${PriceBill}`, requestOptions)
  
  
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res;

    }else{
      return false;
    }

  });
  return res;
}
async function GetReport() {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
 
  };
  let res = await fetch(`${apiUrl}/report`, requestOptions)
  
  
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res;

    }else{
      return false;
    }

  });
  return res;
}
async function GetTopicByID(IDTopic: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };
  let res = await fetch(`${apiUrl}/report2/${IDTopic}`, requestOptions)
  
  
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res;

    }else{
      return false;
    }

  });
  return res;
}
async function CreateReport(data: Topic) {
  const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
  },
  body: JSON.stringify(data),

  };


  let res = await fetch(`${apiUrl}/report/create`, requestOptions)
  .then((response) => response.json())
  .then((res) => {
  if (res.data) {
  return { status: true, message: res.data };
  } else {
  return { status: false, message: res.error };
  }

  });

  return res;
}
async function GetReportTopicByID(UserID: Number,IDTopic: Number) {
  const requestOptions ={
    medthod: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };
  let res = await fetch(`${apiUrl}/report/comment/${UserID}/${IDTopic}`, requestOptions)
  
  
  .then((response) => response.json())
  .then((res) =>{
    if(res.data){
      return res;

    }else{
      return false;
    }

  });
  return res;
}
async function DeleteReportByUserID(id: Number | undefined) {
  const requestOptions = {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
  },
  
  };
  
  
  let res = await fetch(`${apiUrl}/report/comment/delete/${id}`, requestOptions)
  .then((response) => response.json())
  .then((res) => {
  if (res.data) {
  return res.data;
  } else {
  return false;
  }
  
  });
  
  return res;
}
async function UpdateReport(data: Report) {
  const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
  },
  body: JSON.stringify(data),

  };


  let res = await fetch(`${apiUrl}/report/update`, requestOptions)
  .then((response) => response.json())
  .then((res) => {
  if (res.data) {
  return { status: true, message: res.data };
  } else {
  return { status: false, message: res.error };
  }

  });

  return res;
}



export{
  UpdateNameAdmin,
  PaymentUserUpload,
  PaymentAdmin,
  PaymentAdminAllowed,
  UpdateSubscribe,
  PaymentAdminNotAllowed,
  UpdateSubscribe2,
  SubscribeCheck,
  GetUserByID,
  GetPackageByID,
  GetReport,
  GetTopicByID,
  CreateReport,
  GetReportTopicByID,
  DeleteReportByUserID,
  UpdateReport,


}