const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const {findOrCreateUser} = require('./controllers/userController');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // добавил после ругани при подключении
    // https://mongoosejs.com/docs/deprecations.html#findandmodify
    useFindAndModify: false,
})
    .then(() => console.log('DB connected!'))
    .catch((err) => console.log('Err DB connected!', err));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
		let authToken = null
		let currentUser = null
        try {
			authToken = req.headers.authorization;
            if (authToken) {
                // find or create user
				currentUser = await findOrCreateUser(authToken);
				console.log('currentUser:',currentUser);
            }
        } catch (err) {
            console.error(`Unable to Authenticate user with token ${authToken}`)
		}
		return {currentUser}
    }
});

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
    console.log(`Server listening on ${url}`)
});
