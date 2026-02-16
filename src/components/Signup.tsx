import Form from "./Form";

export default function Signup() {
  return (
    <main>
      <Form
        title="Create account"
        formType="Sign up"
        path="login"
        linkText="Have an account? Log in"
      />
    </main>
  );
}
