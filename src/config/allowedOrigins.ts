import { PORT } from "~/constants/common";

const allowedOrigins = [
  "https://www.yoursite.com",
  `http://127.0.0.1:${PORT}`,
  `http://localhost:${PORT}`,
];

export default allowedOrigins;
