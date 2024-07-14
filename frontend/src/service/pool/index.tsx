import { UserInterface } from "../../interface/pool";

// const apiUrl = "http://localhost:8080";
const apiUrl = "https://api.movieth.site";
const jwt = localStorage.getItem('token');

async function GetUserInfo(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/userinfo/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return res.data
      } else {
        return false;
      }
    });
  return res;
}

async function UpdateUser(data: UserInterface) {
  const userId = localStorage.getItem("UserID");

  if (!userId) {
    return { status: false, message: "User ID is not available" };
  }
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      ID: parseInt(userId),
      Username: data.Username,
      Firstname: data.Firstname,
      Lastname: data.Lastname,
      Address: data.Address,
      Dob: data.Dob,
      GenderID: data.GenderID,
      PrefixID: data.PrefixID,
    }),
  };

  let res = await fetch(`${apiUrl}/userinfo`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      // console.log("UpdateUser Response:", res);
      if (res.data) {
        return { status: true, message: res.data };
      }
      else if (res.message === 'User information updated successfully') {
        return { status: true, message: res.message };
      } else {
        return { status: false, message: res.error };
      }
    });

  // console.log(res);
  return res;
}

async function UpdateUserPass(data: UserInterface) {
  const userId = localStorage.getItem("UserID");

  if (!userId) {
    return { status: false, message: "User ID is not available" };
  }
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      ID: parseInt(userId),
      Password: data.Password,
    }),
  };

  let res = await fetch(`${apiUrl}/userpass`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      }
      else if (res.message === 'User information updated successfully') {
        return { status: true, message: res.message };
      } else {
        return { status: false, message: res.error };
      }
    });

  // console.log(res);
  return res;
}

async function ComparePasswords(enteredPassword: string, userId: any): Promise<boolean> {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      enteredPassword,
      userID: userId,
    }),
  };

  const response = await fetch(`${apiUrl}/comparePasswords/${userId}/${enteredPassword}`, requestOptions);
  const result = await response.json();

  return result.isMatch;
}


async function GetPackageInfo() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/packages`, requestOptions)
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

async function GetUserPackageInfo(id: any) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/userpackage/${id}`, requestOptions)
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

async function GetUserBill(id: any) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/userbill/${id}`, requestOptions)
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

async function CancelSubscription(userId: any) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`, },
  };

  let res = await fetch(`${apiUrl}/cancelSub/${userId}`, requestOptions)
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

export {
  GetPackageInfo,
  GetUserInfo,
  UpdateUser,
  GetUserPackageInfo,
  CancelSubscription,
  GetUserBill,
  ComparePasswords,
  UpdateUserPass
};