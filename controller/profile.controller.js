const db  = require("../config/db")

const getProfile = async(request,response)=>{
    const userId = request.user.id;
    try{

        const [userProfile] = await  db.query(
            `SELECT id,username,email FROM users WHERE id = ?`,[userId])
            
            if(userProfile.length === 0 ){
                return response.status(404).json({message:`User not found!`})
            }
            response.status(200).json({
                message:`User profile retrived successfully!`,
                profile:userProfile[0]
            })
        }catch(error){
            console.error("Error fetching users profile :", error)
            response.status(500).json({message:`Failed to getting user profile`,error:error.message})
        }
}

const editProfile = async (request,response)=>{
    const userId = request.user.id;
    const {username} = request.body;


    if(!username){
        return response.status(400).json({message:`Username is required to update!`})
    }
    try{
        const query = `
        UPDATE users 
        SET username =?
        WHERE id = ?
        `
        await db.query(query,[username,userId]);
        response.status(200).json({
            message:`Profile Updated Successfully`
        })

    }catch(error){
        console.error("Error updating profile",error)
        response.status(500).json({
            message:`Failed to update the profile`,
            error:error.message
        })
    }
}

module.exports = {
    getProfile,
    editProfile
}