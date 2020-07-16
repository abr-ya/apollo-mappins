const {AutenticationError} = require('apollo-server');

const user =  {
    _id: "1",
    name: "Reed",
    email: "mail@mail.ru",
    picture: "http://abr-just.ru/bmark/123/img/nakarte.me.jpg",
};

const autenticated = next => (root, args, ctx, info) => {
    if(!ctx.currentUser) {
        throw new AutenticationError('You must be logged in');
    }
    return next(root, args, ctx, info);
};

module.exports = {
    Query: {
        me: autenticated((root, args, ctx) => ctx.currentUser)
    }
};
