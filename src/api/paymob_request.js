import { paymobApi as paymob } from "./client";
import config from "./config";
import endpoints from "./endpoints";

const auth_api = () => {
  let body = { api_key: config.API_KEY };
  return paymob.post(endpoints.AUTH_API, body);
};

const Order_Regestiration = (AUTH_TOKEN, EGP, requestItemsBody, courtName) => {
  let body = {
    auth_token: AUTH_TOKEN,
    delivery_needed: "false",
    amount_cents: EGP,
    currency: "EGP",
    items: [
      {
        name: courtName,
        amount_cents: EGP * 100,
        description: JSON.stringify(requestItemsBody),
        quantity: "1"
      }
    ]
  };
  return paymob.post(endpoints.ORDER_REGESTIRATION, body);
};

const Card_Payment_Key = (AUTH_TOKEN, EGP, ID) => {
  let body = {
    auth_token: AUTH_TOKEN,
    amount_cents: EGP * 100,
    expiration: 3600,
    order_id: ID,

    billing_data: {
      apartment: "803",
      email: "claudette09@exa.com",
      floor: "42",
      first_name: "Clifford",
      street: "Ethan Land",
      building: "8028",
      phone_number: "+86(8)9135210487",
      shipping_method: "PKG",
      postal_code: "01898",
      city: "Jaskolskiburgh",
      country: "CR",
      last_name: "Nicolas",
      state: "Utah"
    },
    currency: "EGP",
    integration_id: config.Integration_ID,
    lock_order_when_paid: "false"
  };
  return paymob.post(endpoints.CARD_PAYMENT_KEY, body);
};

const getPaymobIFrameToken = async (EGP, body, courtName) => {
  let AUTH_API_RES = await auth_api();
  let ORDER_REG_RES = await Order_Regestiration(
    AUTH_API_RES.data.token,
    EGP,
    body,
    courtName
  );
  console.log("Order ID", ORDER_REG_RES.data.id);
  let CARD_PAYMENT_KEY_RES = await Card_Payment_Key(
    AUTH_API_RES.data.token,
    ORDER_REG_RES.data.amount_cents,
    ORDER_REG_RES.data.id
  );
  return CARD_PAYMENT_KEY_RES.data.token;
};

export default getPaymobIFrameToken;
