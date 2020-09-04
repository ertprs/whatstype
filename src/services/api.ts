import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://books.zoho.com/api/v3/'
})

export const config = {

  client: {
    id: '1000.CQ7A4R0I7G9Q7JDKRMAL1N2LKF2XKY',
    secret: '06381093ba30f8563267c372895a30f89c0c18c9be'
  },
  auth: {
    tokenHost: 'https://accounts.zoho.com',
    tokenPath: '/oauth/v2/token?'
  },
  options: {
    authorizationMethod: "body",
  }
};

export const tokenParams = {
  scope: 'ZohoBooks.fullaccess.all'
};
 
 