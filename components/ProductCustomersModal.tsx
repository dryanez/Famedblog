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
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{productName}</h2>
                        <p className="text-gray-600 mt-1">
                            {customers.length} customer{customers.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading customers...</p>
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No customers found for this product.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmails.size === customers.length}
                                                onChange={toggleAll}
                                                className="rounded"
                                            />
                                        </th>
                                        <th className="text-left p-3 font-semibold">Email</th>
                                        <th className="text-left p-3 font-semibold">First Purchase</th>
                                        <th className="text-left p-3 font-semibold">Total Spent</th>
                                        <th className="text-left p-3 font-semibold">Orders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr
                                            key={customer.email}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmails.has(customer.email)}
                                                    onChange={() => toggleEmail(customer.email)}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td className="p-3 font-medium">{customer.email}</td>
                                            <td className="p-3 text-gray-600">
                                                {new Date(customer.first_purchase).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 text-gray-900">
                                                €{(customer.total_spent / 100).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-gray-600">
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
                <div className="border-t p-6 flex justify-between items-center bg-gray-50">
                    <p className="text-sm text-gray-600">
                        {selectedEmails.size} of {customers.length} selected
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
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
