import { UserForLoginInterface , UserForRegInterface, UserInterface,LoginInterface } from "../../interface/login";
// const apiUrl = "http://localhost:8080";
const apiUrl = "https://api.movieth.site";
const jwt = localStorage.getItem('token');

async function LoginByAuth(data: LoginInterface) {
  const requestOptions = {
    method: "POST",
    headers: { 'Authorization': `Bearer ${jwt}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/login`, requestOptions)
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

async function ListUsersToLogin(data: UserForLoginInterface) {
    console.log("Data sent to ListUsers:", data.Email);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
    };
    let res = await fetch(
      `${apiUrl}/user/${data.Email}/${data.Password}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return { status: true, message: res.data };
        } else {
          return { status: false, message: res.error };
        }
      })
    console.log(res);
    return res;
}

async function CreateUser(data: UserForRegInterface) {
  const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    let res = await fetch(`${apiUrl}/user`, requestOptions)
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

async function GetGenders() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/gender`, requestOptions)
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

async function GetPrefix() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/prefix`, requestOptions)
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

async function GetStatusUser() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/statususer`, requestOptions)
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

async function ListUsers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };
  let res = await fetch(`${apiUrl}/users`, requestOptions)
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

async function GetUserById(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/userid/${id}`, requestOptions)
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

async function UpdateUser(data: UserInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/user`, requestOptions)
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
    ListUsersToLogin,
    CreateUser,
    GetGenders,
    GetPrefix,
    GetStatusUser,
    ListUsers,
    GetUserById,
    UpdateUser,
    LoginByAuth,
}