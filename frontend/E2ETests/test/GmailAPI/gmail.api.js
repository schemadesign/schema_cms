import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import credentials from './gmail.api.credentials';
import {
  BASE64,
  UTF8,
  USER_ID,
  UNREAD,
  SCOPES,
  DELETE_EMAIL_ERROR_MSG,
  DELETE_EMAIL_SUCCESS_MSG,
  EMAIL_ID_NOT_FOUND_MSG,
  MARK_EMAIL_ERROR_MSG,
  MARK_EMAIL_SUCCESS_MSG,
  NO_EMAILS_FOUND_MSG,
  TOKEN_PATH,
  TOKEN_AUTHORIZE_PROMPT,
  TOKEN_ENTER_CODE_PROMPT,
  TOKEN_ERROR_MSG,
  TOKEN_SUCCESS_MSG,
  V1,
  OFFLINE,
} from './gmail.api.constants';

const gmail = google.gmail(V1);

const getNewToken = async oAuth2Client => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: OFFLINE,
    scope: SCOPES,
  });

  console.log(TOKEN_AUTHORIZE_PROMPT, authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(TOKEN_ENTER_CODE_PROMPT, code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error(TOKEN_ERROR_MSG, err);
      oAuth2Client.setCredentials(token);
      return fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        return console.log(TOKEN_SUCCESS_MSG, TOKEN_PATH);
      });
    });
  });
};

export const getAuth = async () => {
  const { clientSecret, clientId, redirectUris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUris[0]);
  const token = !fs.existsSync(TOKEN_PATH)
    ? await getNewToken(oAuth2Client)
    : JSON.parse(fs.readFileSync(TOKEN_PATH).toString());

  oAuth2Client.setCredentials(token);
  return oAuth2Client;
};

const markEmailReadPromise = (auth, emailId) =>
  new Promise((resolve, reject) => {
    if (emailId === undefined || emailId === null) {
      return console.log(MARK_EMAIL_ERROR_MSG);
    }
    return gmail.users.messages.modify(
      {
        auth,
        userId: USER_ID,
        id: emailId,
        resource: {
          addLabelIds: [],
          removeLabelIds: [UNREAD],
        },
      },
      err => {
        if (err) {
          return reject(err);
        }
        return resolve(console.log(MARK_EMAIL_SUCCESS_MSG, emailId));
      }
    );
  });

const deleteEmailPromise = (auth, emailId) =>
  new Promise((resolve, reject) => {
    if (emailId === undefined || emailId === null) {
      return console.log(DELETE_EMAIL_ERROR_MSG);
    }
    return gmail.users.messages.delete(
      {
        auth,
        userId: USER_ID,
        id: emailId,
      },
      err => {
        if (err) {
          return reject(err);
        }
        return resolve(console.log(DELETE_EMAIL_SUCCESS_MSG));
      }
    );
  });

const getEmailTextPromise = (auth, emailId) =>
  new Promise((resolve, reject) => {
    gmail.users.messages.get(
      {
        auth,
        userId: USER_ID,
        id: emailId,
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }
        if (!res.data.payload) {
          return reject(new Error(EMAIL_ID_NOT_FOUND_MSG), err);
        }
        if (!res.data.payload.parts) {
          const buff = Buffer.from(res.data.payload.body.data, BASE64);
          const emailText = buff.toString(UTF8);
          return resolve(emailText);
        }
        const buff = Buffer.from(res.data.payload.parts[0].body.data, BASE64);
        const emailText = buff.toString(UTF8);
        return resolve(emailText);
      }
    );
  });

const getEmailIdPromise = (auth, query) =>
  new Promise((resolve, reject) => {
    gmail.users.messages.list(
      {
        auth,
        userId: USER_ID,
        q: query,
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }
        if (!res.data.messages) {
          return reject(new Error(NO_EMAILS_FOUND_MSG), err);
        }
        return resolve(res.data.messages[0].id);
      }
    );
  });

const getEmailsPromise = (auth, query) =>
  new Promise((resolve, reject) => {
    gmail.users.messages.list(
      {
        auth,
        userId: USER_ID,
        q: query,
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }
        if (!res.data.messages) {
          return reject(new Error(NO_EMAILS_FOUND_MSG), err);
        }
        return resolve(res.data.messages.map(message => message.id));
      }
    );
  });

export const getEmailId = async (auth, query) => {
  try {
    return await getEmailIdPromise(auth, query);
  } catch (err) {
    return console.log(err);
  }
};

export const getEmailText = async (auth, emailId) => {
  try {
    return await getEmailTextPromise(auth, emailId);
  } catch (err) {
    return console.log(err);
  }
};

export const getEmails = async (auth, query) => {
  try {
    return await getEmailsPromise(auth, query);
  } catch (err) {
    return console.log(err);
  }
};

export const markEmailRead = async (auth, emailId) => {
  try {
    return await markEmailReadPromise(auth, emailId);
  } catch (err) {
    return console.log(MARK_EMAIL_ERROR_MSG, err);
  }
};

export const deleteEmail = async (auth, emailId) => {
  try {
    return await deleteEmailPromise(auth, emailId);
  } catch (err) {
    return console.log(NO_EMAILS_FOUND_MSG, err);
  }
};

const isEmailExisting = async (auth, query) => {
  const emails = await getEmails(auth, query);
  return emails !== undefined;
};

export const deleteEmails = async (auth, query, emails) => {
  try {
    if (await isEmailExisting(auth, query)) {
      return await Promise.all(
        emails.map(async email => {
          await deleteEmail(auth, email);
        })
      );
    }
    return console.log(NO_EMAILS_FOUND_MSG);
  } catch (err) {
    return console.log(err);
  }
};

export const getLinksFromEmail = async (emailText, regexp) => {
  return emailText.match(regexp);
};

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const waitForEmail = async (auth, query) => {
  let email = false;
  while (!email) {
    email = await isEmailExisting(auth, query);
    await delay(1000);
  }
};
