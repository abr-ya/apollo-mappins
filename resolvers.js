const user =  {
    _id: "1",
    name: "Reed",
    email: "mail@mail.ru",
    picture: "http://abr-just.ru/bmark/123/img/nakarte.me.jpg",
};

module.exports = {
    Query: {
        me: () => user
    }
};
