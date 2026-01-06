import axios from "axios"

export const http = axios.create({
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "AQI-App/1.0",
  },
})
