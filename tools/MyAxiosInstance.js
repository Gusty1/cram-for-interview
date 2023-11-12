import axios from 'axios'

export const baseGetInstance = axios.create({
  timeout: 1000,
  method: 'get',
})