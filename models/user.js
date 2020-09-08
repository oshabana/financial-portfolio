const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter a valid email");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Please choose a harder password");
            }
        },
    },
    portfolio: {
        type: Object,
        required: true,
    },
    tokens: {
        type: Object,
        required: false,
    },
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

userSchema.methods.generateAuthToken = async function (userAgent) {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.PASS_PHRASE,
        { expiresIn: "7 days" }
    ); //should be in an .env
    let tokens = user.tokens;
    tokens[token] = userAgent; // I dont really care about the value :(
    await user.updateOne({ tokens: tokens });

    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error("No user with that email and password combination");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("No user with that email and password combination");
    }
    return user;
};

userSchema.statics.findById = async (id) => {
    const user = await User.findOne({ _id:id  });
    if (!user) {
        throw new Error("Not Found");
    }
    return user;
};

userSchema.statics.verifyCookie = async (id, potentialToken) => {
    const user = await User.findOne({ _id: id });
    if (!user) {
        return false;
    }
    if (user.tokens[potentialToken] !== undefined) {
        if (jwt.verify(potentialToken, process.env.PASS_PHRASE)) return true; // otherwise your session has expired
    }
    /* old way of doing it with a tokens list (inefficient O(n))
    for(let i = 0; i < user.tokens.length; i++){
        if (potentialToken === user.tokens[i].token){
            return true
        }
    }
    */
    return false;
};
userSchema.statics.santizeTokenDB = async (id) => {
    const user = await User.findOne({ _id: id });
    if (!user) {
        return;
    }
    for (let token in user.tokens) {
        if (!jwt.verify(token, process.env.PASS_PHRASE)) {
            await user.deleteOne({ tokens: token });
        }
    }
};

const User = mongoose.model("User", userSchema);

userSchema.pre("save", async function () {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});

module.exports = User;
