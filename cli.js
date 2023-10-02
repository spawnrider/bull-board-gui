#!/usr/bin/env node

/**
 * * cli.JS
 * A dashboard for Bull Queue
 */
const express = require('express')
const Queue = require('bull')
//const Queue = require('bullmq')
const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')
//const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const queueName = process.env.BULL_QUEUE || 'messages'
const queueCnxString = process.env.BULL_CONNECTION || 'redis://127.0.0.1:6379'
const messagesQueue = new Queue(queueName, { connection: {
    queueCnxString
  }});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullAdapter(messagesQueue)],
    serverAdapter: serverAdapter,
  });

const app = express()
const port = process.env.BULL_PORT || 3000

app.use('/admin/queues', serverAdapter.getRouter());

app.listen(port, () => {
    console.log(`Bull dashboard available at http://localhost:${port}`)
})