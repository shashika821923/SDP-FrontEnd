import axios from 'axios';
import config from '../../../configurations/server.enpoints';

function checkUsernameandPassword() {
  return axios.post(`${config.api.endpoint}/login/login`).then((data) => data.data);
}

export default {
  checkUsernameandPassword,
};
