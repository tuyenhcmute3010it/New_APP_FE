import ItemQuantity from "@/components/example/restaurant/order/item.quantity";
import axios from "@/utils/axios.customize";
import { da } from "@faker-js/faker/.";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
export const registerAPI = (name: string, email: string, password: string) => {
  const url = `/api/v1/auth/register`;
  return axios.post<IBackendRes<IRegister>>(url, { name, email, password });
};
export const verifyCodeAPI = (email: string, code: string) => {
  const url = `/api/v1/auth/verify-code`;
  return axios.post<IBackendRes<IRegister>>(url, { email, code });
};
export const resendCodeAPI = (email: string) => {
  console.log("email >>>>", email);
  const url = `/api/v1/auth/verify-email`;
  return axios.post<IBackendRes<IRegister>>(url, { email });
};
export const loginAPI = (username: string, password: string) => {
  const url = `/api/v1/auth/login`;
  return axios.post<IBackendRes<IUserLogin>>(url, { username, password });
};
export const getAccountAPI = () => {
  const url = `/api/v1/auth/account`;
  return axios.get<IBackendRes<IUserLogin>>(url);
};
export const getTopRestaurant = (ref: string) => {
  const url = `/api/v1/restaurants/${ref}`;
  return axios.post<IBackendRes<ITopRestaurant[]>>(url);
};
export const getRestaurantById = (id: string) => {
  const url = `/api/v1/restaurants/${id}`;
  return axios.get<IBackendRes<IRestaurant>>(url);
};

export const placeOrderAPI = (data: any) => {
  const url = `/api/v1/orders`;
  return axios.post<IBackendRes<IOrderHistory>>(url, { ...data });
};
export const getOrderHistoryAPI = (data: any) => {
  const url = `/api/v1/orders`;
  return axios.get<IBackendRes<IOrderHistory[]>>(url);
};
export const updateUserAPI = (_id: string, name: string, phone: string) => {
  const url = `/api/v1/users`;
  return axios.patch<IBackendRes<IUserLogin>>(url, { _id, name, phone });
};

export const updatePassword = (
  currentPassword: string,
  newPassword: string
) => {
  const url = `/api/v1/users/password`;
  return axios.post<IBackendRes<IUserLogin>>(url, {
    currentPassword,
    newPassword,
  });
};

interface ILike {
  _id: string;
  restaurant?: IRestaurant;
  user?: string; // Optional for user-specific likes
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export const likedRestaurant = (restaurant: string, quantity: number) => {
  const url = `/api/v1/likes`;
  return axios
    .post<IBackendRes<ILike>>(url, {
      restaurant,
      quantity,
    })
    .catch((error) => {
      throw new Error(
        error.response?.data?.message ||
          `Failed to ${quantity === 1 ? "like" : "dislike"} restaurant`
      );
    });
};
export const getRestaurantLikeStatus = (restaurant: string) => {
  const url = `/api/v1/likes`;
  return axios.get<IBackendRes<ILike[]>>(url, {
    params: {
      restaurant,
    },
  });
};
export const getUserLikes = (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  const url = `/api/v1/likes`;
  console.log(currentPage);
  console.log(pageSize);
  return axios
    .get<{
      meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
      };
      result: ILike[];
    }>(url, {
      params: {
        current: currentPage,
        pageSize,
      },
    })
    .catch((error) => {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user likes"
      );
    });
};
export const getRestaurantByName = (name: string) => {
  const url = `/api/v1/restaurants?current=1&pageSize=10&name=/${name}/i`;
  return axios.get<IBackendRes<IModelPaginate<IRestaurant>>>(url);
};
export const forgotPassword = (
  code: string,
  email: string,
  password: string
) => {
  const url = `/api/v1/auth/forgot-password`;
  return axios.post<IBackendRes<IForgotPassword>>(url, {
    code,
    email,
    password,
  });
};
export const getUrlBaseBackend = () => {
  const backend =
    Platform.OS === "android"
      ? process.env.EXPO_PUBLIC_ANDROID_API_URL
      : process.env.EXPO_PUBLIC_IOS_API_URL;
  return backend;
};
export const printAsyncStorage = () => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys!, (error, stores) => {
      let asyncStorage: any = {};
      stores?.map((result, i, store) => {
        asyncStorage[store[i][0]] = store[i][1];
      });
      console.log(JSON.stringify(asyncStorage, null, 2));
    });
  });
};
export const processDataRestaurantMenu = (restaurant: IRestaurant | null) => {
  if (!restaurant) return [];
  return restaurant.data?.menu?.map((menu, index) => {
    return {
      index,
      key: menu._id,
      title: menu.title,
      data: menu.menuItem,
    };
  });
};
export const currencyFormatter = (value: any) => {
  const options = {
    significantDigits: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
    symbol: "d",
  };
  if (typeof value !== "number") value = 0.0;
  value = value.toFixed(options.significantDigits);
  const [currency, decimal] = value.split(".");
  return `${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator
  )}${options.symbol}`;
};
// src/utils/api.ts (or wherever your API functions are defined)
export const getArticlesAPI = (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  const url = `/api/v1/articles`;
  return axios
    .get<{
      statusCode: number;
      message: string;
      data: {
        meta: {
          current: number | null;
          pageSize: number | null;
          pages: number;
          total: number;
        };
        result: IArticle[];
      };
    }>(url, {
      params: {
        current: currentPage,
        pageSize,
      },
    })
    .catch((error) => {
      throw new Error(
        error.response?.data?.message || "Failed to fetch articles"
      );
    });
};

export const getRecentArticles = (limit: number = 20) => {
  const url = `/api/v1/articles/notifications`;
  // Calculate 7 days ago in +07 timezone
  const sinceDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  // Adjust for +07 (7 hours ahead of UTC)
  sinceDate.setHours(sinceDate.getHours() + 7);
  const since = sinceDate.toISOString();
  console.log("Fetching recent articles with createdSince:", since);
  return axios
    .get<{
      statusCode: number;
      message: string;
      data: {
        result: IArticle[];
        meta: {
          current: number;
          pageSize: number;
          pages: number;
          total: number;
        };
      };
    }>(url, {
      params: {
        current: 1,
        pageSize: limit,
        createdSince: since,
        isDeleted: false,
        sort: "-createdAt",
      },
    })
    .catch((error) => {
      console.error("Fetch recent articles error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to fetch recent articles"
      );
    });
};

export const getArticlesByQuery = (query: string, limit: number = 20) => {
  const url = `/api/v1/articles`;
  console.log("Searching articles with query:", query);
  return axios
    .get<{
      statusCode: number;
      message: string;
      data: {
        result: IArticle[];
        meta: {
          current: number;
          pageSize: number;
          pages: number;
          total: number;
        };
      };
    }>(url, {
      params: {
        q: query,
        current: 1,
        pageSize: limit,
        isDeleted: false,
        sort: "-createdAt",
      },
    })
    .catch((error) => {
      console.error("Fetch articles error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to fetch articles"
      );
    });
};
export const getListArticlesAPI = (
  page: number = 1,
  pageSize: number = 10,
  sort: string = "createdAt"
) => {
  const url = `/api/v1/articles`;
  console.log("Fetching articles with params:", {
    current: page,
    pageSize,
    sort,
    isDeleted: false,
  });
  return axios
    .get<{
      statusCode: number;
      message: string;
      data: {
        result: IArticle[];
        meta: {
          current: number;
          pageSize: number;
          pages: number;
          total: number;
        };
      };
    }>(url, {
      params: { current: page, pageSize, sort, isDeleted: false },
    })
    .catch((error) => {
      console.error("Fetch articles error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to fetch articles"
      );
    });
};
interface IArticle {
  _id: string;
  title: string;
  content: string;
  thumbnail: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    email: string;
  };
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
export const getArticleById = (id: string) => {
  const url = `/api/v1/articles/${id}`;
  return axios
    .get<{
      statusCode: number;
      message: string;
      data: {
        message: string;
        data: IArticle;
      };
    }>(url)
    .catch((error) => {
      throw new Error(
        error.response?.data?.message || "Failed to fetch article"
      );
    });
};
// src/utils/api.ts
interface ILike {
  _id: string;
  article: {
    _id: string;
    title: string;
    thumbnail?: string;
  };
  quantity: number; // 1 for like, -1 for dislike
  updatedAt: string;
}

// src/utils/api.ts

////////////
// src/utils/api.ts
interface ILike {
  _id: string;
  article: {
    _id: string;
    title: string;
    thumbnail?: string;
  };
  quantity: number;
  updatedAt: string;
}

export const likedArticle = (articleId: string, quantity: number) => {
  const url = `/api/v1/likes`;
  return axios
    .post<{
      message: string;
      data: ILike | null;
    }>(url, { article: articleId, quantity })
    .catch((error) => {
      throw new Error(error.response?.data?.message || "Failed to update like");
    });
};

export const getArticleLikeStatus = (articleId: string) => {
  const url = `/api/v1/likes/${articleId}`;
  return axios
    .get<{
      message: string;
      data: ILike | null;
    }>(url)
    .catch((error) => {
      console.error(
        `Like status error for article ${articleId}:`,
        error.response?.data
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch article like status"
      );
    });
};
export const getUserArticleLikes = (
  page: number = 1,
  pageSize: number = 20
) => {
  const url = `/api/v1/likes`;
  return axios
    .get<{
      meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
      };
      result: ILike[];
    }>(url, {
      params: {
        current: page,
        pageSize,
      },
    })
    .catch((error) => {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user likes"
      );
    });
};
