
'use client';

import { useEffect } from 'react';
import { safeJsonParse, safeGetLocalStorage, safeSetLocalStorage, isLocalStorageAvailable } from '@/lib/security';

interface LocalOrder {
    id: string;
    paymentStatus: 'pending' | 'processing' | 'completed' | 'rejected';
}

interface OrderStatusSyncerProps {
    onStatusUpdate: (orderId: string, newStatus: 'completed' | 'rejected') => void;
}

/**
 * An invisible component that checks for order status updates from a specific
 * key in localStorage, which is set by the admin confirmation pages.
 */
export function OrderStatusSyncer({ onStatusUpdate }: OrderStatusSyncerProps) {

    useEffect(() => {
        const checkLocalStatusUpdates = () => {
            if (typeof window === 'undefined' || !isLocalStorageAvailable()) return;

            const localOrdersData = safeGetLocalStorage('localOrders');
            const statusUpdatesData = safeGetLocalStorage('orderStatusUpdates');

            if (!localOrdersData || !statusUpdatesData) return;
            
            const localOrders = safeJsonParse<LocalOrder[]>(localOrdersData, []);
            const statusUpdates = safeJsonParse<Record<string, 'completed' | 'rejected'>>(statusUpdatesData, {});
            
            let ordersWereUpdated = false;

            for (const orderId in statusUpdates) {
                const newStatus = statusUpdates[orderId];
                const orderIndex = localOrders.findIndex(o => o.id === orderId);

                if (orderIndex !== -1 && localOrders[orderIndex].paymentStatus !== newStatus) {
                    localOrders[orderIndex].paymentStatus = newStatus;
                    ordersWereUpdated = true;
                    
                    // Notify the parent component for immediate UI update
                    onStatusUpdate(orderId, newStatus);
                    
                    // Remove the processed update from the statusUpdates object
                    delete statusUpdates[orderId];
                }
            }

            if (ordersWereUpdated) {
                const success1 = safeSetLocalStorage('localOrders', JSON.stringify(localOrders));
                const success2 = safeSetLocalStorage('orderStatusUpdates', JSON.stringify(statusUpdates));
                if (success1 && success2) {
                    console.log("OrderStatusSyncer: Local order statuses were synchronized.");
                }
            }
        };

        // Run check when the component mounts and when window gets focus
        checkLocalStatusUpdates();
        window.addEventListener('focus', checkLocalStatusUpdates);

        // Optional: Run periodically as a fallback
        const intervalId = setInterval(checkLocalStatusUpdates, 15000);

        return () => {
            window.removeEventListener('focus', checkLocalStatusUpdates);
            clearInterval(intervalId);
        };

    }, [onStatusUpdate]);

    return null; // This component renders nothing
}

    