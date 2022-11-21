let { makeExecutableSchema }=require('@graphql-tools/schema')
const axios=require('axios') 
const jsonwebtoken=require('jsonwebtoken')

const typeDefs=`
scalar Date

type UserList{
    id: Int
    name: String
    username: String
    email: String
    address:addressDetails
    phone: String
    website: String
    company: CompanyDetails
}

type addressDetails {
    street: String
    suite: String
    city: String
    zipcode:String
    geo: GeoDetails
}

type GeoDetails{
    lat: String
    lng: String
}

type CompanyDetails{
    name:String
    catchPhrase: String
    bs: String
}

type UserStatus{
    token:String
    tokenExpirationTime:Int
    status:Int
    message:String
}

type Query{
    fetchUserList:[UserList]
    loginUsers(EmailAddress:String,Password:String):UserStatus
}
`

const resolvers={
    Query:{
        fetchUserList:async(parent,args,req,info)=>{            
            return new Promise(async(resolve,reject)=>{
                try{  
                    if(!req.checkIsAuth)throw new Error('Authorization header required')
                    const userRes=await axios.get(`${process.env.THIRD_PARTY_URL}users`)
                    if(userRes.data.length!==0)resolve(userRes.data)
                    reject("No users found!!!")
                }
                catch(err){reject( err)}
            })
        } ,
        loginUsers:(root,{EmailAddress,Password})=>{
            return new Promise(async(resolve,reject)=>{
                try{
                   const checkUser=await axios.get(`${process.env.THIRD_PARTY_URL}users`)
                    if(checkUser.data.length===0)reject("User does not exist!!!")
                    const filterPassword=checkUser.data.filter((e)=>e.email===Password && e.username===EmailAddress)
                    if(filterPassword.length===0)reject("Invalid Creds!!")
                    const checkJWT=jsonwebtoken.sign({uid:filterPassword[0].name,EmailAddress:filterPassword[0].website,UserName:filterPassword[0].username},process.env.JWTSECRET,{expiresIn:process.env.EXPIRESIN})                        
                    resolve({token:checkJWT,tokenExpirationTime:parseInt(process.env.EXPIRESIN.replace('m','')),status:200,message:"Successful loggedIn"})                                       
                }
                catch(err){reject(err)}
            })
           
        }
    }
}

let UserGraphqlSchema=makeExecutableSchema({
    typeDefs,
    resolvers
});

module.exports=UserGraphqlSchema

/***
 * 
 * Fetch Users
 * 
 * {fetchUserList{
  username
  id
  email
  phone
  name
  address{
    street
    geo{
      __typename
      lat
      lng
    }
    suite
    zipcode
  }
  website
}}


 * create  User 
 * mutation signInUsers($CreateUserInput:CreateUserInput){
  signInUsers(input:$CreateUserInput){
    address{
      street
    }
    username
    email
  }
}
{"CreateUserInput": {
  "EmailAddress": "user1@gmail.com",
  "Password": "Password@123",
  "isActive": 0,
  "UserName": "User1"
  
}}

User Login 

mutation loginUsers($UserCredsInput:UserCredsInput){
  loginUsers(input:$UserCredsInput){
    token
    message
    status
  }
}

{"UserCredsInput": {
  "EmailAddress": "user8@gmail.com",
  "Password": "Testing@123"
}}


{fetchUserList{
  id
  email
  username
  phone
}}
{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MzcwZTczZWNkMThmMTg4MTJkNzQwOTkiLCJpYXQiOjE2Njg1MzYzNjQsImV4cCI6MTY2ODUzOTk2NH0.mGUHmreX46ebTGjSTnq0tE8BuSrWaz3sxBSozFM1ilI"}


///new login query
query loginUsers($EmailAddress:String,$Password:String){
  loginUsers(EmailAddress:$EmailAddress,Password:$Password){
    token
    status
    tokenExpirationTime
  }
}



{
  "EmailAddress": "Elwyn.Skiles",
  "Password": "Telly.Hoeger@billy.biz"
}
 */