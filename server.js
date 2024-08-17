const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080; // or any port number you prefer

// Endpoint to check Roblox audio ID
app.get('/asset/:id', async (req, res) => {
    const assetId = req.params.id;
    const url = `https://economy.roblox.com/v2/assets/${assetId}/details`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Check if the asset is of type audio
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
