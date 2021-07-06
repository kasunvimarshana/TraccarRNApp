export const sleep = (milliseconds = 1000) => {
    return new Promise((resolve, reject) => setTimeout(resolve, milliseconds));
}

export const asyncInterval = async (callback, ms, triesLeft = 5) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            if (await callback()) {
                resolve();
                clearInterval(interval);
            } else if (triesLeft <= 1) {
                reject();
                clearInterval(interval);
            }
            triesLeft--;
        }, ms);
    });
}