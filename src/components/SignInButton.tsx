import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    gapi: unknown;
    onSignIn: (googleUser: gapi.auth2.GoogleUser) => void;
  }
}

interface SignInButtonProps {
  onSignInSuccess: (googleUser: gapi.auth2.GoogleUser) => void;
}

const SignInButton: React.FC<SignInButtonProps> = ({ onSignInSuccess }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onSignIn = (googleUser: gapi.auth2.GoogleUser) => {
      // console.log("User signed in successfully!");
      onSignInSuccess(googleUser);
    };

    const loadGoogleSignIn = () => {
      if (window.gapi && window.gapi.signin2) {
        window.gapi.signin2.render(googleButtonRef.current, {
          scope: "profile email",
          width: 240,
          height: 50,
          longtitle: true,
          theme: "dark",
          // onsuccess: "onSignIn",
          // onfailure: (error: any) => {
          //   console.error("Google Sign-In failed:", error);
          // },
        });
      } else {
        setTimeout(loadGoogleSignIn, 100);
      }
    };

    if (document.readyState === "complete") {
      loadGoogleSignIn();
    } else {
      window.addEventListener("load", loadGoogleSignIn);
      return () => {
        window.removeEventListener("load", loadGoogleSignIn);
      };
    }
    // window.onerror = function (message, source, lineno, colno, error) {
      // console.error("Caught a global error:", {
      //   message,
      //   source,
      //   lineno,
      //   colno,
      //   error,
      // });
      // return true;
    // };
  }, [onSignInSuccess]);

  return (
    <div ref={googleButtonRef} id="g-signin2" className="border-solid"></div>
  );
};

export default SignInButton;
