const bizSdk = require("facebook-nodejs-business-sdk");
const crypto = require("crypto");

const { EventRequest, UserData, ServerEvent, CustomData } = bizSdk;
const pixelId = "512659814615709";

// Em vez de ler o token no carregamento do módulo, criamos uma função para obtê-lo em runtime.
function getAccessToken() {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Facebook Access Token não definido!");
  }
  return token;
}

// Função para gerar o hash dos dados (SHA256)
function hashData(data, shouldConvertToLowercase = true) {
  const inputData = shouldConvertToLowercase
    ? data.toLowerCase().trim()
    : data.trim();
  return crypto.createHash("sha256").update(inputData).digest("hex");
}

async function sendEventToFacebook(body, ip) {
  try {
    // Obtém o token do Facebook no runtime
    const accessToken = getAccessToken();

    const {
      name,
      userId,
      phone,
      event_name,
      value,
      currency,
      email,
      fbp,
      fbc,
      event_id,
      action_source,
      event_source_url,
      user_agent,
    } = body;

    // Cria o objeto de dados do usuário
    let userData = new UserData()
      .setFbp(fbp)
      .setFbc(fbc)
      .setClientIpAddress(ip)
      .setClientUserAgent(user_agent);

    if (email) {
      userData.setEmail(hashData(email));
    }
    if (userId) {
      userData.setExternalId(hashData(userId, false));
    }
    if (phone) {
      userData.setPhone(hashData(phone));
    }
    if (name) {
      let nameParts = name.trim().split(" ");
      if (nameParts.length > 1) {
        userData.setFirstName(hashData(nameParts[0]));
        userData.setLastName(hashData(nameParts.slice(1).join(" ")));
      } else if (nameParts.length === 1) {
        userData.setFirstName(hashData(name));
      }
    }

    // Se o evento for "InitiateCheckout", configura os dados personalizados
    let customData = null;
    if (event_name === "InitiateCheckout") {
      customData = new CustomData().setValue(value).setCurrency(currency);
    }

    console.log("User Data:", userData);

    // Cria o objeto do evento do servidor
    const serverEvent = new ServerEvent()
      .setEventName(event_name)
      .setEventTime(Math.floor(Date.now() / 1000))
      .setActionSource(action_source)
      .setEventSourceUrl(event_source_url)
      .setUserData(userData)
      .setEventId(event_id);

    if (event_name === "InitiateCheckout" && customData) {
      serverEvent.setCustomData(customData);
    }

    // Cria a requisição do evento e envia para o Facebook
    const eventRequest = new EventRequest(accessToken, pixelId).setEvents([
      serverEvent,
    ]);
    const response = await eventRequest.execute();
    console.log("Response from Facebook:", response);
    return { success: true, message: response };
  } catch (error) {
    console.error("Error sending event to Facebook", error);
    return { success: false, message: error };
  }
}

module.exports = sendEventToFacebook;
