import express from "express";
import Client from "../models/Client.js";

const router = express.Router();

router.post("/buy-corn", async (req, res) => {
    try {
        // step 1: indentify client by ip
        const clientIp = req.headers['x-client-ip'] || req.ip;
        const now = new Date();

        // step 2: search in db
        let client = await Client.findOne({ ip: clientIp });

        // step 3: if not exist then create new client
        if (!client) {
            client = await Client.create({
                ip: clientIp,
                lastPurchaseAt: now,
                cornCount: 1
            });

            return res.status(200).json({
                message: "🌽 Corn purchased successfully",
                totalCorn: client.cornCount
            });
        }

        // step 4: verify limit per minute | 60 seconds
        const secondSinceLastPurchase = (now.getTime() - client.lastPurchaseAt.getTime()) / 1000;
        if (secondSinceLastPurchase < 60) {
            return res.status(429).json({
                message: "🕛 Too many request. Only 1 corn per minute allowed."
            });
        }

        // step 5: buy ok
        client.lastPurchaseAt = now;
        client.cornCount += 1;
        await client.save();
        return res.status(200).json({
            message: "🌽 Corn purchased successfully",
            totalCorn: client.cornCount
        });
    } catch (e) {
        console.error(`Buy corn error: ${e}`);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;