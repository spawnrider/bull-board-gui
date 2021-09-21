#!/usr/bin/env node

/**
 * * cli.JS
 * A dashboard for Bull Queue
 */
const express = require('express')
const Queue = require('bull')
const QueueMQ = require('bullmq')
const { createBullBoard } = require('bull-board')
const { BullAdapter } = require('bull-board/bullAdapter')

const queueName = process.env.BULL_QUEUE || 'messages'
const queueCnxString = process.env.BULL_CONNECTION || 'redis://127.0.0.1:6379'
const messagesQueue = new Queue(queueName, queueCnxString);

const { router, setQueues, replaceQueues } = createBullBoard([
    new BullAdapter(messagesQueue)
])

const app = express()
const port = process.env.BULL_PORT || 3000

app.use('/', router)

app.listen(port, () => {
    console.log(`Bull dashboard available at http://localhost:${port}`)
})