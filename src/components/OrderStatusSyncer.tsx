
'use client';

import { useEffect } from 'react';

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
            if (typeof window === 'undefined') return;

            let localOrders: LocalOrder[];
            let statusUpdates: Record<string, 'completed' | 'rejected'>;

            try {
                const localOrdersData = localStorage.getItem('localOrders');
                const statusUpdatesData = localStorage.getItem('orderStatusUpdates');

                if (!localOrdersData || !statusUpdatesData) return;
                
                localOrders = JSON.parse(localOrdersData);
                statusUpdates = JSON.parse(statusUpdatesData);

            } catch (error) {
                console.error("OrderStatusSyncer: Failed to parse data from localStorage", error);
                return;
            }
            
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
                try {
                    localStorage.setItem('localOrders', JSON.stringify(localOrders));
                    localStorage.setItem('orderStatusUpdates', JSON.stringify(statusUpdates)); // Save the cleaned up updates
                    console.log("OrderStatusSyncer: Local order statuses were synchronized.");
                } catch (error) {
                    console.error("OrderStatusSyncer: Failed to save updated orders to localStorage", error);
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

    