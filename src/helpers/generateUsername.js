exports.generateUsername = async (User,name) => {
    let username = name.replace(/\s/g, "").toLowerCase();
    let baseUsername = username;
    let count = 0;
    while(await User.findOne({ username })) {
        username = baseUsername + count++;
    }
    return username;
}