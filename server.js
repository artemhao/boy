const express = require('express');
const axios = require('axios');
const Bottleneck = require('bottleneck');

const app = express();
const port = 8080;

// Create a Bottleneck limiter to control the request rate
const limiter = new Bottleneck({
    minTime: 1, // Minimum time between requests (1 second)
    maxConcurrent: 1000 // Only one request at a time
});

// Function to fetch data with rate limiting and retry logic
const fetchWithLimiter = async (url, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            // Use the limiter to schedule the request
            return await limiter.schedule(() => axios.get(url));
        } catch (error) {
            if (error.response && error.response.status === 429 && i < retries - 1) {
                const retryAfter = error.response.headers['
