"use client";

// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import cookies from "@/utils/cookies";
// import {cookies} from "next/headers"

// ** Config
import authConfig from "@/configs/auth";

import { AuthServices } from "@/services";

import { useToast } from "@/components/ui/use-toast";

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  ISignupFormValues,
  ICompanyFormValues,
  ChannelParams,
  ForgotPasswordParams,
  ResetPasswordParams,
} from "./types";

import { login, signup } from "@/server/auth.actions";

// ** Third Party Imports
// import toast from 'react-hot-toast'
// import { IUser } from 'src/types/apps/user'

const steps = [
  {
    title: "Create Account",
    subtitle: "Add Persnol Details",
  },
  {
    title: "Create Company",
    subtitle: "Add Company Details",
  },
  {
    title: "Subscriptions",
    subtitle: "Pick a plan that works best for you",
  },
];

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  profileUpdate: () => Promise.resolve(),
  changeCredentials: () => Promise.resolve(),
  // Signup related
  activeStep: 0,
  steps,
  handleBack: () => Promise.resolve(),
  handleNext: () => Promise.resolve(),
  handleReset: () => Promise.resolve(),

  // API status
  status: "idle",
  // @ts-ignore
  setStatus: () => "",
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [status, setStatus] = useState<AuthValuesType["status"]>("idle");
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultProvider.isInitialized
  );
  const [activeStep, setActiveStep] = useState<number>(
    defaultProvider.activeStep
  ); // signup step form

  // ** Hooks
  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true);

      setIsInitialized(true);

      const accessToken = cookies.get(authConfig.storageTokenKeyName);
      const refreshToken = cookies.get(authConfig.refreshTokenKeyName);
      const user = JSON.parse(window.localStorage.getItem("userData") || "{}");

      if (accessToken && refreshToken && user) {
        saveLogin({ accessToken, refreshToken, user });
      }

      setLoading(false);
    };
    initAuth();
  }, []);

  const handleLogin = (params: FormData, errorCallback?: ErrCallbackType) => {
    setStatus("pending");
    login({ body: params })
      .then(async ({ data: response }) => {
        saveLogin({
          accessToken: response.tokens.accessToken || "",
          refreshToken: response.tokens.refreshToken || "",
          user: response.user,
        });
        router.push("/apps/payment");
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        if (errorCallback) errorCallback(error.response?.data);
      });
  };

  const handleLogout = () => {
    setUser(null);
    setIsInitialized(false);
    window.localStorage.removeItem("userData");
    cookies.remove(authConfig.storageTokenKeyName);
    cookies.remove(authConfig.refreshTokenKeyName);
    window.localStorage.removeItem(authConfig.storageTokenKeyName);
    window.localStorage.removeItem(authConfig.refreshTokenKeyName);
    router.push("/login");
  };

  const handleRegister = (
    params: FormData,
    query: any,
    errorCallback?: ErrCallbackType
  ) => {
    setStatus("pending");
    signup({ body: params })
      .then(async ({ data: response }) => {
        saveLogin({
          accessToken: response.tokens.accessToken || "",
          refreshToken: response.tokens.refreshToken || "",
          user: response.user,
        });
        router.push("/channels");
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        if (errorCallback) errorCallback(error.response);
      });
  };

  const changePassword = async (body: any, errorCallback?: ErrCallbackType) => {
    setStatus("pending");
    try {
      const { data } = await AuthServices.changePassword(body);
      router.push("/channels");
      setStatus("success");
      handleNext();
    } catch (error: any) {
      setStatus("error");
      //   toast.error(error?.response?.data?.message || 'Something went wrong!')
      if (errorCallback) errorCallback(error?.response?.data);
    }
  };

  // const handleProfileUpdate = (id: string, body: IUser, errorCallback?: ErrCallbackType) => {
  const handleProfileUpdate = (
    id: string,
    body: any,
    errorCallback?: ErrCallbackType
  ) => {
    setStatus("pending");
    AuthServices.profileUpdate(id, body)
      .then(async ({ data: response }) => {
        const data = {
          activeChannel: response?.data?.employees?.activeChannel,
          email: response?.data?.employees?.email,
          firebase_uid: response?.data?.employees?.firebase_uid,
          first_name: response?.data?.employees?.first_name,
          gender: response?.data?.employees?.gender,
          id: response?.data?.employees?.id,
          last_name: response?.data?.employees?.last_name,
          profile_picture: response?.data?.employees?.profile_picture,
          referalCode: response?.data?.employees?.referalCode,
          role: response?.data?.employees?.role,
        };
        saveLogin({
          accessToken: localStorage.getItem("accessToken") || "",
          refreshToken: localStorage.getItem("refreshToken") || "",
          user: data,
        });
        router.push("/channels");
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        if (errorCallback) errorCallback(error.response);
      });
  };

  // ** Forget password
  const handleForgotPassword = (
    params: ForgotPasswordParams,
    errorCallback?: ErrCallbackType
  ) => {
    setStatus("pending");
    AuthServices.forgotPassword(params)
      .then(async ({ data: response }) => {
        // toast.success('Email send success, Check your email')
        setStatus("success");
        router.push("/login");
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: error?.response?.data?.message || `Something went wrong`,
        });
        setStatus("error");
        if (errorCallback) errorCallback(error.response?.data);
      });
  };

  // ** Forget password
  const handleResetPassword = (
    params: ResetPasswordParams,
    token: string,
    errorCallback?: ErrCallbackType
  ) => {
    setStatus("pending");
    AuthServices.resetPassword(params, token)
      .then(async ({ data: response }) => {
        // toast.success('Password reset success, Try login Now')
        setStatus("success");
        router.push("/login");
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
        setStatus("error");
        if (errorCallback) errorCallback(error.response?.data);
      });
  };

  // Handle Stepper Back
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle Stepper Next
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      //   toast.success('Form Submitted')
    }
  };

  // Handle Stepper Reset all process
  const handleReset = () => {
    setActiveStep(0);
  };

  const saveLogin = ({
    accessToken,
    refreshToken,
    user,
  }: {
    accessToken: string;
    refreshToken: string;
    user: any;
  }) => {
    // save token in localStorage
    cookies.set(authConfig.storageTokenKeyName, accessToken, { path: "/" });
    cookies.set(authConfig.refreshTokenKeyName, refreshToken, { path: "/" });
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    console.log("user", user);

    // window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken);
    // window.localStorage.setItem(authConfig.refreshTokenKeyName, refreshToken);

    // const returnUrl = router.query.returnUrl;

    // console.log('=========returnUrl===========================')
    // console.log(returnUrl)
    // console.log('====================================')

    setUser(user);
    window.localStorage.setItem("userData", JSON.stringify(user));

    // const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : router.asPath;

    // router.replace(redirectURL as string)
    // router.replace(redirectURL as string);
  };

  const values = {
    user,
    loading,
    activeStep,
    steps,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    profileUpdate: handleProfileUpdate,
    logout: handleLogout,
    register: handleRegister,
    changeCredentials: changePassword,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    handleBack,
    handleNext,
    handleReset,
    status,
    setStatus,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
