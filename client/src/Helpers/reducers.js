const contextReducer = (state, action) => {
  switch (action.type) {
    case "login":
      localStorage.setItem("web3", JSON.stringify(action.payload));
      localStorage.setItem("loggedIn", true);
      return {
        ...state,
        loggedIn: true,
        web3: action.payload,
      };
    case "logout":
      localStorage.removeItem("web3");
      return {
        ...state,
        loggedIn: false,
        web3: null,
      };
    default:
      throw new Error();
  }
};

export { contextReducer };
