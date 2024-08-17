const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;

// Helper function to sleep for a specified time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, retries = 1000, delay = 1) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.get(url);
        } catch (error) {
            if (error.response && error.response.status === 429 && i < retries - 1) {
                await sleep(delay);
                delay *= 2; // Exponential backoff
            } else {
                throw error;
            }
        }
    }
    throw new Error('Failed to fetch after retries');
};

// Endpoint to check Roblox audio ID
app.get('/asset/:id', async (req, res) => {
    const assetId = req.params.id;
    const url = `https://economy.roblox.com/v2/assets/${assetId}/details`;

    try {
        const response = await fetchWithRetry(url);
        const data = response.data;

        if (data && data.AssetTypeId === 3) { // 3 is the AssetTypeId for audio
            const hasIcon = data.IconImageAssetId && data.IconImageAssetId !== 0;
            res.json({
                valid: true,
                playable: hasIcon
            });
        } else {
            res.json({
                valid: false,
                playable: false
            });
        }
    } catch (error) {
        res.json({
            valid: false,
            playable: false,
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
