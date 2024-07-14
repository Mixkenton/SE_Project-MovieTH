import { MoviesCreateInterface, MoviesInterface } from "../../interface/fook";

// const apiUrl = "http://localhost:8080";
const apiUrl = "https://api.movieth.site";
const jwt = localStorage.getItem('token');

async function ListMovies() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
        },
    };
    let res = await fetch(`${apiUrl}/movies`, requestOptions)
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

  async function ListSubscribe() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
    };
    let res = await fetch(`${apiUrl}/subscribes`, requestOptions)
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

  async function DeleteMovieByID(id: Number | undefined) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/movie/${id}`, requestOptions)
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

  async function DeleteUserByID(id: Number | undefined) {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/user/${id}`, requestOptions)
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

  async function GetMovieById(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
        },
    };
  
    let res = await fetch(`${apiUrl}/movie/${id}`, requestOptions)
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

  async function GetSubscribeByID(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/subscribe/${id}`, requestOptions)
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

  async function UpdateMovie(data: MoviesInterface) {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json",'Authorization': `Bearer ${jwt}` },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/movie`, requestOptions)
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

  async function GetCategories() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
        },
    };
  
    let res = await fetch(`${apiUrl}/categories`, requestOptions)
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

  async function GetSoundtrack() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/soundtrack`, requestOptions)
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

  async function GetTarget() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/target`, requestOptions)
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

  async function CreateMovie(data: MoviesCreateInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json",'Authorization': `Bearer ${jwt}` },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/movie`, requestOptions)
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
    ListMovies,
    DeleteMovieByID,
    GetMovieById,
    UpdateMovie,
    GetCategories,
    GetSoundtrack,
    GetTarget,
    CreateMovie,
    DeleteUserByID,
    GetSubscribeByID,
    ListSubscribe,
}