const redis = require('redis');
const client = redis.createClient({
    url: 'redis://localhost:6379' 
});

client.on('error', (err) => {
    console.log('Redis Client Error', err);
});

client.connect();

// create a new driver session
async function createDriverSession(driverId, routeId) {
    const timestamp = Math.floor(Date.now() / 1000);
    await client.hSet(`session:${driverId}`, {
        isLogged: 1,
        lastActive: timestamp,
        currentRoute: routeId
    });
    console.log(`Session created for driver ${driverId}`);
}

//read driver session details
async function readDriverSession(driverId) {
    const session = await client.hGetAll(`session:${driverId}`);
    console.log(`Session details for driver ${driverId}:`, session);
}

//update a driver's current route and last active time
async function updateDriverSession(driverId, newRouteId) {
    const newTimestamp = Math.floor(Date.now() / 1000);
    await client.hSet(`session:${driverId}`, 'lastActive', newTimestamp, 'currentRoute', newRouteId);
    console.log(`Session updated for driver ${driverId}`);
}

// delete a driver session
async function deleteDriverSession(driverId) {
    await client.del(`session:${driverId}`);
    console.log(`Session deleted for driver ${driverId}`);
}

// initialize route tracking
async function trackRoute(routeId, timestamp) {
    await client.zAdd('routeTracking', {
        score: timestamp,
        value: routeId
    });
    console.log(`Route ${routeId} tracking initialized.`);
}

// get all routes by progress
async function getAllRoutes() {
    const routes = await client.zRange('routeTracking', 0, -1, { withScores: true });
    console.log('All routes:', routes);
}

// update route progress
async function updateRouteProgress(routeId, newTimestamp) {
    await client.zAdd('routeTracking', {
        score: newTimestamp,
        value: routeId
    });
    console.log(`Route progress updated for ${routeId}`);
}

// initialize performance metrics
async function initPerformanceMetrics(driverId, date, initialData) {
    await client.hSet(`performance:${driverId}:${date}`, initialData);
    console.log(`Performance metrics initialized for driver ${driverId} on ${date}`);
}

// read performance metrics
async function readPerformanceMetrics(driverId, date) {
    const performance = await client.hGetAll(`performance:${driverId}:${date}`);
    console.log(`Performance metrics for driver ${driverId} on ${date}:`, performance);
}

// update performance metrics
async function updatePerformanceMetrics(driverId, date, updates) {
    await client.hSet(`performance:${driverId}:${date}`, updates);
    console.log(`Performance metrics updated for driver ${driverId} on ${date}`);
}

// delete performance metrics
async function deletePerformanceMetrics(driverId, date) {
    await client.del(`performance:${driverId}:${date}`);
    console.log(`Performance metrics deleted for driver ${driverId} on ${date}`);
}

