'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Payment {
    id: string;
    amount: number;
    currency: string;
    date: string;
    quantity: number;
}

interface Customer {
    email: string;
    user_id: string | null;
    first_purchase: string;
    last_purchase: string;
    total_spent: number;
    purchase_count: number;
    payments: Payment[];
}

interface ProductCustomersModalProps {
    productName: string;
    onClose: () => void;
    onSendCampaign: (emails: string[]) => void;
}

export default function ProductCustomersModal({
    productName,
    onClose,
    onSendCampaign
}: ProductCustomersModalProps) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchCustomers();
    }, [productName]);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`/api/analytics/product-customers?product_name=${encodeURIComponent(productName)}`);
            const data = await response.json();
            setCustomers(data.customers || []);
            // Select all by default
            setSelectedEmails(new Set(data.customers?.map((c: Customer) => c.email) || []));
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleEmail = (email: string) => {
        const newSelected = new Set(selectedEmails);
        if (newSelected.has(email)) {
            newSelected.delete(email);
        } else {
            newSelected.add(email);
        }
        setSelectedEmails(newSelected);
    };

    const toggleAll = () => {
        if (selectedEmails.size === customers.length) {
            setSelectedEmails(new Set());
        } else {
            setSelectedEmails(new Set(customers.map(c => c.email)));
        }
    };

    const handleSendCampaign = () => {
        onSendCampaign(Array.from(selectedEmails));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-300 dark:border-gray-600 p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{productName}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {customers.length} customer{customers.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading customers...</p>
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No customers found for this product.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                                        <th className="text-left p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmails.size === customers.length}
                                                onChange={toggleAll}
                                                className="rounded"
                                            />
                                        </th>
                                        <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">Email</th>
                                        <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">First Purchase</th>
                                        <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">Total Spent</th>
                                        <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">Orders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer, index) => (
                                        <tr
                                            key={customer.email}
                                            className={`border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'
                                                }`}
                                        >
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmails.has(customer.email)}
                                                    onChange={() => toggleEmail(customer.email)}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td className="p-3 font-medium text-gray-900 dark:text-gray-100">{customer.email}</td>
                                            <td className="p-3 text-gray-600 dark:text-gray-300">
                                                {new Date(customer.first_purchase).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-gray-900 dark:text-gray-100 font-semibold">
                                                €{(customer.total_spent / 100).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-gray-600 dark:text-gray-300">
                                                {customer.purchase_count}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-300 dark:border-gray-600 p-6 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedEmails.size} of {customers.length} selected
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSendCampaign}
                            disabled={selectedEmails.size === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                            Send Campaign ({selectedEmails.size})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
