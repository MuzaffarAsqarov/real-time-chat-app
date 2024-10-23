const express = require('express')
const cookiesParser = require('cookie-parser') 
const path = require('path')
const { Server } = require('socket.io')
const http = require('http')
const getUserDetailsFormToken = require("../helpers/getUserDetailsFormToken")
const UserModel = require('../models/UserModel')
const { upload } = require('../helpers/filehelper')
const ConversationModel = require('../models/ConversationModel')
const MessageModel = require('../models/MessagesModel')
const { log } = require('console')
const mongoose = require('mongoose')
const getConversation = require('../helpers/getConversation')

const app = express()


// socket connection

const server = http.createServer(app)
const io = new Server(server, {
    cors : {
        origin: process.env.FRONTEND_URL,
        credentials: true
    },
    maxHttpBufferSize: 1e8 // 100 MB
})


const onlineUser = new Set()

io.on('connection', async(socket) => {
    console.log('connect user ', socket.id);
    
    const token = socket.handshake.auth.token
    
    const user = await getUserDetailsFormToken(token)

    socket.join(user?._id?.toString())
    onlineUser.add(user?._id?.toString())
    
    io.emit('onlineUser', Array.from(onlineUser))

    socket.on('message-page', async (userId)=>{
        const userDetails = await UserModel.findById(userId).select('-password')

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }
        socket.emit('messages-user', payload)           
        
        // get previos message
        const getConversationMessage = await ConversationModel.findOne({
            $or : [
                {sender: user?._id, receiver : userId},
                {sender: userId, receiver : user?._id}
            ]
        }).populate('messages').sort({updatedAt : -1})

        socket.emit('message', getConversationMessage) 
        
    })


    // new message
    socket.on('new-message', async (data) => {
        
        let conversation = await ConversationModel.findOne({
            $or : [
                {sender: data?.sender, receiver : data?.receiver},
                {sender: data?.receiver, receiver : data?.sender}
            ]
        })

        if(!conversation){
            const createConversation = new ConversationModel({
                sender : data?.sender,
                receiver : data?.receiver
            })

            conversation = await createConversation.save()
        }

        const message = new MessageModel({
            text : data?.text,
            imageUrl : data?.imageUrl,
            videoUrl : data?.videoUrl,
            msgByUserId : data?.msgByUserId
        })

        const saveMessage = await message.save()

        const updateConversation = await ConversationModel.updateOne({_id : conversation?._id},{
            $push: {messages : saveMessage?._id}
        })

        const getConversationMessage = await ConversationModel.findOne({
            $or : [
                {sender: data?.sender, receiver : data?.receiver},
                {sender: data?.receiver, receiver : data?.sender}
            ]
        }).populate('messages').sort({updatedAt : -1})

        io.to(data?.sender).emit('message', getConversationMessage || [])
        io.to(data?.receiver).emit('message', getConversationMessage || [])

        const conversationSender = await getConversation(data?.sender)          
        const conversationReceiver = await getConversation(data?.receiver)          
        
        io.to(data?.sender).emit('conversation', conversationSender)
        io.to(data?.receiver).emit('conversation', conversationReceiver)
        
    })

    // sidebar
    socket.on('sidebar', async (currentUserId) => {
        const conversation = await getConversation(currentUserId)  
        
        socket.emit('conversation', conversation)
    })

    socket.on('seen', async (msgByUserId) => {
        let conversation = await ConversationModel.findOne({
            $or : [
                {sender: user?._id, receiver : msgByUserId},
                {sender: msgByUserId, receiver : user?._id}
            ]
        })

        const conversationMessageId = conversation?.messages || []

        const updateMessages = await MessageModel.updateMany(
            {_id : {"$in" : conversationMessageId}, msgByUserId : msgByUserId},
            {"$set" : { seen : true}}
        )

        const conversationSender = await getConversation(user?._id?.toString())          
        const conversationReceiver = await getConversation(msgByUserId)          
        
        io.to(user?._id?.toString()).emit('conversation', conversationSender)
        io.to(msgByUserId).emit('conversation', conversationReceiver)

    })

    // disconnect
    socket.on('disconnect', () => {
        console.log('online users', Array.from(onlineUser));
        
        onlineUser.delete(user?._id?.toString())
        console.log('disconnect user' , socket.id);    
    })

    console.log('disconnect online users', Array.from(onlineUser));
    
})

module.exports = {
    app,
    server
}