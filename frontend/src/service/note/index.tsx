import { ReviewInterface, HistoryInterface} from "../../interface/note";

// const apiUrl = "http://localhost:8080";
const apiUrl = "https://api.movieth.site";
const jwt = localStorage.getItem('token');

async function ListReviews() {
    const requestOptions = {
    method: "GET",
    headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
    },

    };


    let res = await fetch(`${apiUrl}/reviews`, requestOptions)
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

async function GetReviews(MovieID: Number | undefined) {
    const requestOptions = {
    method: "GET",
    headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
    },
    
    };
    
    
    let res = await fetch(`${apiUrl}/review/${MovieID}`, requestOptions)
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

async function GetReviewsByUserID(UserID: Number | undefined,MovieID: Number | undefined) {
    const requestOptions = {
    method: "GET",
    headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
    },
    
    };
    
    
    let res = await fetch(`${apiUrl}/getreview/${UserID}/${MovieID}`, requestOptions)
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

async function CreateReview(data: ReviewInterface) {
    const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,},
    body: JSON.stringify(data),

    };


    let res = await fetch(`${apiUrl}/review`, requestOptions)
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

async function ListRating() {
    const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
    
    };
    
    
    let res = await fetch(`${apiUrl}/ratings`, requestOptions)
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

async function ListGenre() {
    const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
    
    };
    
    
    let res = await fetch(`${apiUrl}/genres`, requestOptions)
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

async function DeleteReview(userId: Number | undefined,movieId: Number | undefined) {
    const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
    
    };
    
    
    let res = await fetch(`${apiUrl}/reviews/${userId}/${movieId}`, requestOptions)
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

async function UpdateReview(data: ReviewInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/updatereview`, requestOptions)
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

//============================History====================================================

async function ListHistoryByUserID(UserID: Number | undefined) {
  const requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
  },
  
  };
  
  
  let res = await fetch(`${apiUrl}/listHistoryByUserId/${UserID}`, requestOptions)
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

async function CreateHistory(data: HistoryInterface) {
  const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
  },
  body: JSON.stringify(data),

  };


  let res = await fetch(`${apiUrl}/createHistory`, requestOptions)
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

async function DeleteHistoryByID(userId: Number | undefined,id: Number | undefined) {
  const requestOptions = {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
  },
  
  };
  
  
  let res = await fetch(`${apiUrl}/deleteHistory/${userId}/${id}`, requestOptions)
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

//========================= Movie ========================================
async function GetMoviesByCateId(cateid: Number | undefined) {
  const requestOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${jwt}`,
  },
  
  };
  
  
  let res = await fetch(`${apiUrl}/getmoviesbycategories/${cateid}`, requestOptions)
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

async function ListMoviesForUser() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
      },
  };
  let res = await fetch(`${apiUrl}/moviesforuser`, requestOptions)
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

async function GetMovieByIdForUser(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
      },
  };

  let res = await fetch(`${apiUrl}/movieforuser/${id}`, requestOptions)
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

async function GetCategoriesForUser() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/categoriesforuser`, requestOptions)
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
export {

  ListReviews,
  GetReviews,
  CreateReview,
  ListMovies,
  ListGenre,
  ListRating,
  DeleteReview,
  UpdateReview,
  GetMovieById,
  GetReviewsByUserID,
  ListHistoryByUserID,
  CreateHistory,
  DeleteHistoryByID,
  GetMoviesByCateId,
  ListMoviesForUser,
  GetMovieByIdForUser,
  GetCategoriesForUser
};


