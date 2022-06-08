const User = require("../models/User");

const me = async (req,res) => {
    try{
        let user = await User.findById(req.userId);
        if(!user){
           return res.json({
                success:false,
                message:"User not found"
            })
        }
       return res.json({
            success:true,
            message:"User Found",
            user
        })

    }catch(e){
        console.log(e);
        return res.json({
            success:false,
            message:"Error Fetching User please try again later"
        })
    }
}
module.exports = {
    me
}

