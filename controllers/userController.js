const User = require('../models/User');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
    // verify auth token
    const googleUser = await verifyAuthToken(token);
    //console.log('googleUser:', googleUser);
    // check that user exists in db
    const user = await checkIfUserExists(googleUser.email);
    //console.log('user:', user);
    // if user exists, return them, else - create new user
    return user
        ? user // user exists - return
        : createNewUser(googleUser); // create user
}

const verifyAuthToken = async token => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID,
        });
        return ticket.getPayload();
    } catch (err) {
        console.error(`Error verifying auth token: ${err}`);
    }
};

const checkIfUserExists = async email => await User.findOne({email}).exec();

const createNewUser = googleUser => {
    console.log('createNewUser');
    const {name, email, picture} = googleUser;
    const user = {name, email, picture};
    return new User(user).save();
}