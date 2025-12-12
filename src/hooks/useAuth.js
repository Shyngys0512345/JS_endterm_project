import { useSelector, useDispatch } from "react-redux";
import { signup as s, login as l, logout as lo } from "../services/authService";
import { setUser, clearUser } from "../store/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const signup = async (email, password) => {
    const userCredential = await s(email, password);
    dispatch(setUser(userCredential.user));
    return userCredential.user;
  };

  const login = async (email, password) => {
    const userCredential = await l(email, password);
    dispatch(setUser(userCredential.user));
    return userCredential.user;
  };

  const logout = async () => {
    await lo();
    dispatch(clearUser());
  };

  return {
    user,
    signup,
    login,
    logout,
    isAuthenticated: !!user
  };
}
