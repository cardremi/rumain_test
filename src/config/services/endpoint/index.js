import WooCommerceAPI from 'react-native-woocommerce-api';

export const connectApi = new WooCommerceAPI({
  url: 'https://urban.devrumaid.com',
  ssl: true,
  consumerKey: 'ck_48c0fbcc31ae75449e426efc02fcc8ced5a8ff2a',
  consumerSecret: 'cs_2241a1f23e2bbb06ad578557243e52ad2db2cc34',
  wpAPI: true,
  version: 'wc/v2',
  queryStringAuth: true,
});
