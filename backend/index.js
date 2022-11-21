const  Express =require( 'express')
const bodyParser=require('body-parser')
const cors =require( 'cors')
const { graphqlHTTP }=require('express-graphql')
const path=require('path')
const { mergeSchemas }=require('@graphql-tools/schema')

const Users=require('./Users/UserGraphqlSchema')
const Dashboard=require('./Dashboard/DashboardGraphqlSchema')
const isAuthCheck=require('./Auth/Auth')

const app=Express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.set('port',process.env.GRAPHQL_PORT)
app.use(cors('*'))

//***********for production only***********
const runFE=Express();
runFE.use(Express.static(path.join(__dirname,'../frontend/build')))
runFE.get('/*',function(req,res){
    res.sendFile(path.join(__dirname,'/../frontend/build','index.html'))
})
runFE.listen(process.env.FRONTEND_PORT)
//***********for production only***********

//****authentication middleware */
app.use(isAuthCheck)
//****authentication middleware */

 //******graphql Errors******/
 const customFormatErrorFn=(error)=>({
    message:error.message,
    location:error.location,
    stack:error.stack?error.stack.split('\n'):[],
    path:error.path
})
//******graphql Errors******/

//******Merge schemas******/
const Schema=mergeSchemas({
    schemas:[
        Users,
        Dashboard
    ]
  })
//******Merge schemas******/

//******graphql connect******/
app.use(
    '/graphql',                        
    graphqlHTTP({
            schema:Schema,
            rootValue:global,
            graphiql:{headerEditorEnabled:process.env.IGRAPHQL,shouldPersistHeaders:process.env.IGRAPHQL,headers:process.env.IGRAPHQL},                                                                                               
            customFormatErrorFn:customFormatErrorFn
        })                
)
//******graphql connect******/

// Server listens @ port
app.listen(app.get('port'),()=>console.log("Dev server listening @",app.get('port')))

