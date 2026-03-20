
export function getValidLoginData() {
  return {
    username: process.env.JWT_USERNAME,
    password: process.env.JWT_PASSWORD
  };
}

export function getInvalidLoginData() {
  const { username, password } = getValidLoginData();
  return [
    {username, password: "2324234"},
    {username: "aduyyt", password},
    {username: "asdasdas", password: "as1111sd"},
    {username: "", password: ""},
    {username, password: ""},
    {username: "", password},
    {username: "<script>alert(1)</script>", password},
    {username: "admin'--", password: "anything"},
  ];
}