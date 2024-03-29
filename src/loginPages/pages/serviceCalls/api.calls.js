import axios from 'axios';
/* eslint-disable import/no-extraneous-dependencies */
import { message } from 'antd';
import config from '../../../configurations/server.enpoints';

function checkUsernameandPassword(credentails) {
  return axios.post(`${config.api.endpoint}/login/login`, credentails).then((data) => data.data);
}

function createAccount(formDetails) {
  return axios.post(`${config.api.endpoint}/login/createAccount`, formDetails).then((data) => data.data).catch((error) => message.error(error));
}

function createComplain(formData) {
  return axios.post(`${config.api.endpoint}/complains/addComplain`, formData, { headers: { 'content-type': 'multipart/form-data' } }).then((data) => data.data).catch((error) => message.error(error));
}

function getComplain(formData) {
  return axios.post(`${config.api.endpoint}/complains/getComplain`, formData).then((data) => data.data).catch((error) => message.error(error));
}

function editComplain(formData) {
  return axios.post(`${config.api.endpoint}/complains/updateComplain`, formData).then((data) => data.data).catch((error) => message.error(error));
}

function getUserInformation(userData) {
  return axios.post(`${config.api.endpoint}/login/getUserInformation`, userData).then((data) => data.data).catch((error) => message.error(error));
}

function addComplainHistory(complainHistory) {
  return axios.post(`${config.api.endpoint}/complains/addComplainHistory`, complainHistory).then((data) => data.data).catch((error) => message.error(error));
}

function addComplainAssignee(complainHistory) {
  return axios.post(`${config.api.endpoint}/complains/saveComplainAssignee`, complainHistory).then((data) => data.data).catch((error) => message.error(error));
}

function updateAssignee(complainHistory) {
  return axios.post(`${config.api.endpoint}/complains/updateAssignee`, complainHistory).then((data) => data.data).catch((error) => message.error(error));
}

export default {
  checkUsernameandPassword,
  createAccount,
  createComplain,
  getComplain,
  editComplain,
  getUserInformation,
  addComplainHistory,
  addComplainAssignee,
  updateAssignee,
};
