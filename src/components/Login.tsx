import Form from "./Form.js";

export default function Login() {
  return (
    <main>
      <Form
        title="Log in"
        formType="Log in"
        path="signup"
        linkText="No account? Sign up"
      />
    </main>
  );
}
