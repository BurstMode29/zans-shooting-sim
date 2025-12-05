import * as RNIap from 'react-native-iap';
import FirebaseManager from '../services/FirebaseManager';

export const ZANSPRODUCTS = {
    '100shot': 100,
    '200shot': 200,
    '500shot': 500,
    '1000shot': 1000,
};

export async function initialiseIAP(purchaseUpdateCb) {
    RNIap.initConnection().then(() => {
        // we make sure that "ghost" pending payment are removed
        // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
        RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
            // exception can happen here if:
            // - there are pending purchases that are still pending (we can't consume a pending purchase)
            // in any case, you might not want to do anything special with the error
        }).then(() => {
            purchaseUpdateCb = RNIap.purchaseUpdatedListener((purchase) => {
                console.log('purchaseUpdatedListener', purchase);
                const receipt = purchase.transactionReceipt;
                if (receipt) {  
                    purchaseShots(purchase.productId)
                        .then(async (deliveryResult) => {
                            if (deliveryResult) {
                                // Tell the store that you have delivered what has been paid for.
                                // Failure to do this will result in the purchase being refunded on Android and
                                // the purchase event will reappear on every relaunch of the app until you succeed
                                // in doing the below. It will also be impossible for the user to purchase consumables
                                // again until you do this.
                                if (Platform.OS === 'ios') {
                                    await RNIap.finishTransactionIOS(purchase.transactionId);
                                } else if (Platform.OS === 'android') {
                                    // If consumable (can be purchased again)
                                    await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                                    // If not consumable
                                    await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                                }

                                // From react-native-iap@4.1.0 you can simplify above `method`. Try to wrap the statement with `try` and `catch` to also grab the `error` message.
                                // If consumable (can be purchased again)
                                await RNIap.finishTransaction(purchase, true);
                                // If not consumable
                                await RNIap.finishTransaction(purchase, false);
                            } else {
                                // Retry / conclude the purchase is fraudulent, etc...
                            }
                        });
                }
            });

            RNIap.purchaseErrorListener((error) => {
                console.log('purchaseErrorListener', error);
            });
        })
    })
}

export async function clearIAP() {

}

export async function getIapProducts(skus) {
    return RNIap.getProducts(skus).then((res) => {
        return res;
    }).catch((error) => console.log(error));
}


export async function paymentRequest(sku) {
    return await RNIap.requestPurchase(sku, false);
}

export async function purchaseShots(sku) {
    try {
        var shots = ZANSPRODUCTS[sku];
        var currentShots = await FirebaseManager.readShots();
        FirebaseManager.updateShots(shots + currentShots);
        return true;
    } catch (error) {
        console.log(`Purchase error: ${error}`);
        return false;
    }
}
