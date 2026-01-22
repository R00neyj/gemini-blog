import { supabase } from '../lib/supabaseClient';

const VAPID_PUBLIC_KEY = 'BDFKhIfkJKwRIV1WESS0zucaOCfUHs-6kdRRNfNuhUjzVLqxi3PNGmTM4x_g5FQkgw6i0F481NojW6RXLxAkGg4';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPushNotifications(userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push messaging is not supported');
  }

  const registration = await navigator.serviceWorker.ready;
  
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
  }

  // Save to Supabase
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      subscription: subscription.toJSON()
    }, { onConflict: 'user_id, subscription' });

  if (error) {
    throw error;
  }

  return subscription;
}

export async function unsubscribeFromPushNotifications(userId) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();
    
    // Remove from Supabase
    // Note: Deleting by JSON comparison might be tricky, but let's try or just ignore backend cleanup for now
    // A better way is to store the endpoint as a separate column for easier deletion, but our schema uses JSONB.
    // For MVP, we just unsubscribe locally. The backend will clean up 410s.
  }
}

export async function checkSubscriptionStatus() {
    if (!('serviceWorker' in navigator)) return false;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
}
