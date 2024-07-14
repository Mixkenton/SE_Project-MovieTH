import { WatchListInterface } from "../../interface/gam";
import { WatchListMovieInterface } from "../../interface/gam";
import { ColorInterface } from "../../interface/gam";
import { CategoriesWatchlistInterface } from "../../interface/gam";
//////////////////////////////////////////////////////////////////
import { DownloadInterface } from "../../interface/gam";

// const apiUrl = "http://localhost:8080";
const apiUrl = "https://api.movieth.site";

const jwt = localStorage.getItem('token');

//////////////////////////#1///////////////////////////////////////

async function CreateWatchlist(data: WatchListInterface) {
  try {
    const response = await fetch(`${apiUrl}/watchlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      return { success: false, error: responseData.error || "บันทึกไม่สำเร็จ" };
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึก" };
  }
}

const UpdateWatchlist = async (watchlistID: number | undefined, data: any): Promise<{ success: boolean, error?: string }> => {
  try {
    const response = await fetch(`${apiUrl}/watchlists/${watchlistID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: result.error || 'Update failed' };
    }
  } catch (error) {
    console.error('Error updating watchlist:', error);
    return { success: false, error: 'Update failed' };
  }
};

async function GetWatchlist(watchlistId?: number): Promise<WatchListInterface[]> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let url = `${apiUrl}/watchlists`;
  if (watchlistId) {
    url += `/${watchlistId}`;
  }

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch watchlist data. Status: ${response.status}`);
    }

    const data = await response.json();
    // สมมติว่าการค้นหาด้วย ID จะคืนค่าเป็น object ไม่ใช่ array
    const watchlists = watchlistId ? [data.data] : data.data;

    return watchlists as WatchListInterface[];
  } catch (error) {
    console.error("Error while fetching watchlist data:", error);
    throw error;
  }
}


async function GetWatchlistByUserID(UserID: number) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  try {
    const response = await fetch(`${apiUrl}/watchlists/${UserID}`, requestOptions);
    console.log("Backend:", response);
    const res = await response.json();

    if (response.ok) {
      return res.watchlist || [];
    } else {
      console.error('Error fetching watchlist:', res.error);
      return [];
    }
  } catch (error) {
    console.error('Network error when fetching watchlist:', error);
    return [];
  }
}


async function DeleteWatchlist(id: number | undefined) {
  if (!id || isNaN(id)) {
    console.error("Invalid watchlist ID:", id);
    return false;
  }

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  try {
    let res = await fetch(`${apiUrl}/watchlists/${id}`, requestOptions);
    let data = await res.json();

    if (res.ok) {
      return data.data;
    } else {
      console.error("Error deleting watchlist:", data.error || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Error deleting watchlist:", error);
    return false;
  }
}


/////////////////////////////////////////////////////////////////////////

async function AddMovieToWatchlist(data: WatchListMovieInterface): Promise<{ success: boolean, data?: WatchListMovieInterface, error?: string }> {
  try {
    const response = await fetch(`${apiUrl}/watchlists/:id/movies/:movieID`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      return { success: false, error: responseData.error || "เพิ่มหนังลงในรายการดูภาพยนตร์ไม่สำเร็จ" };
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการเพิ่มหนังลงในรายการดูภาพยนตร์" };
  }
}

async function GetMoviesInWatchlist(WatchlistID: number){
  const requestOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${jwt}`,
      },
  };

  try {
      const response = await fetch(`${apiUrl}/watchlists/movies/${WatchlistID}`, requestOptions);
      console.log("Backend Response:", response);

      const res = await response.json();
      console.log("Parsed Response:", res);

      if (response.ok) {
          return res.watchlistmovie;
      } else {
          console.error('Error fetching watchlist:', res.error);
          return [];
      }
  } catch (error) {
      console.error('Network error when fetching watchlist:', error);
      return [];
  }
}


async function DeleteMovieWatchlist(watchlistId : number, movieId : number) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  let res = await fetch(`${apiUrl}/watchlists/${watchlistId}/movies/${movieId}`, requestOptions)
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

///////////////////////////////////////////////////////////////

async function GetColor(): Promise<ColorInterface[]> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  try {
    const response = await fetch(`${apiUrl}/color`, requestOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch color data. Status: ${response.status}`);
    }

    const data = await response.json();
    const color = data.data;

    return color as ColorInterface[];
  } catch (error) {
    console.error("Error while fetching color data:", error);
    throw error;
  }
}

//////////////////////////////////////////////////////////////////////////////

async function GetCategories_Watchlist(): Promise<CategoriesWatchlistInterface[]> {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  try {
    const response = await fetch(`${apiUrl}/categories/watchlist`, requestOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch categories data. Status: ${response.status}`);
    }

    const data = await response.json();
    const categories = data.data;

    return categories as CategoriesWatchlistInterface[];
  } catch (error) {
    console.error("Error while fetching categories data:", error);
    throw error;
  }
}

/////////////////////////////////////////////////////////////////////////

async function CreateDownload(data: DownloadInterface) {
  try {
    const response = await fetch(`${apiUrl}/downloads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      return { success: false, error: responseData.error || "บันทึกไม่สำเร็จ" };
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการบันทึก" };
  }
}

async function DeleteDownloadMovie(userId: number, movieId: number) {
  const requestOptions = {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${jwt}`,
      },
  };

  try {
      let response = await fetch(`${apiUrl}/downloads/${userId}/${movieId}`, requestOptions);
      if (response.ok) {
          return true;
      } else {
          console.error('Deletion failed with status:', response.status);
          const errorResponse = await response.json();
          console.error('Error response:', errorResponse);
          return false;
      }
  } catch (error) {
      console.error('Network or other error:', error);
      return false;
  }
}


async function GetDownloadMovies(UserID: number) {
  const requestOptions = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  try {
    const response = await fetch(`${apiUrl}/downloads/${UserID}`, requestOptions);
    console.log("Backend:", response);
    const res = await response.json();
    console.log(res);

    if (response.ok) {
      return res.download || [];
    } else {
      console.error('Error fetching download:', res.error);
      return [];
    }
  } catch (error) {
    console.error('Network error when fetching download:', error);
    return [];
  }
}

async function GetPackageByUserID(UserID: number) {
  const requestOptions = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${jwt}`,
    },
  };

  try {
    const response = await fetch(`${apiUrl}/downloads/package/${UserID}`, requestOptions);
    console.log("Backend:", response);
    const res = await response.json();
    console.log(res);

    if (response.ok) {
      return res.package_id || [];
    } else {
      console.error('Error fetching:', res.error);
      return [];
    }
  } catch (error) {
    console.error('Network error when fetching:', error);
    return [];
  }
}



//////////////////////////////////////////////////////////////////////////

export {
  CreateWatchlist,
  UpdateWatchlist,
  GetWatchlist,
  DeleteWatchlist,
  GetWatchlistByUserID,
  AddMovieToWatchlist,
  GetColor,
  GetCategories_Watchlist,
  GetMoviesInWatchlist,
  DeleteMovieWatchlist,
  CreateDownload,
  DeleteDownloadMovie,
  GetDownloadMovies,
  GetPackageByUserID
};