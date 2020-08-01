const {AutenticationError} = require('apollo-server');
const Pin = require('./models/Pin');

const autenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser) {
        throw new AutenticationError('You must be logged in');
    }
    return next(root, args, ctx, info);
};

module.exports = {
    Query: {
        me: autenticated((root, args, ctx) => ctx.currentUser),
        getPins: async (root, args, ctx) => {
            const pins = await Pin.find({}).populate('author').populate('comments.author');
            return pins;
        },
    },
    Mutation: {
        createPin: autenticated(async (root, args, ctx) => {
            const newPin = await new Pin({
                ...args.input,
                author: ctx.currentUser._id,
            }).save();
            const pinAdded = await Pin.populate(newPin, 'author');
            return pinAdded;
        })
    }
};
