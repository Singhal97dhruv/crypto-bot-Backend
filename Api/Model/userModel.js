const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please tell us your name"],
    },
    email:{
        type: String,
        required: [true,"Please provide your email"],
        unique: true,
        lowercase: true,
    },
    membershipType:{
        type: String,
        lowercase: true,
        default: "notMember",
    },
    role:{
        type: String,
        enum: ["user","admin"],
        default: "user",
    },
    password:{
        type: String,
        required: [true,"Please provide your password"],
    },
    passwordConfirm:{
        type: String,
        required: [true,"Please provide your password"],
        validate: {
            validator: function(ele){
                return ele==this.password;
            },
            message: "Password not matched"
        }
    }
    
})

userSchema.pre("save",async function(next){
    // oNly run this func if password was actually modified
    if(!this.isModified("password"))return next();

    // Has the password with cost of 12
    this.password=await bcrypt.hash(this.password,12);

    // Delete Password Confirm field
    this.passwordConfirm=undefined;
    next();
})

userSchema.pre("save",function(next){
    if(!this.isModified("password") || this.isNew)return next();

    this.passwordChangeAt=Date.now()-1000;
    next();

})

userSchema.pre(/^find/,function(next){
    // This points to the current query
    this.find({active: {$ne: false}});
    next();
})

userSchema.methods.correctPassword= async function(
    candidatePassword,
    userPassword
){
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.passwordChangeAfter= function(JWTTimestamp){
    if(this.passwordChangeAt){
        const changeTimestamp=parseInt(
            this.passwordChangeAt.getTime()/1000,
            10
        );
        return JWTTimestamp< changeTimestamp;
    }
    //False means not change
    return false;
}

const User= mongoose.model("User",userSchema);

module.exports=User;