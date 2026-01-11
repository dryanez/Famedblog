"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

interface Post {
    id: string;
    slug: string;
    title: string;
    scheduled_date: string;
    status: string;
}

export default function CalendarPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/blog/posts');
            const data = await res.json();
            if (data.success) {
                setPosts(data.posts || []);
            }
        } catch (e) {
            console.error('Failed to fetch posts:', e);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];
        const startPadding = firstDay.getDay();

        // Add padding for days before the 1st
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getPostsForDate = (date: Date | null) => {
        if (!date) return [];
        return posts.filter(post => {
            if (!post.scheduled_date) return false;
            const postDate = new Date(post.scheduled_date);
            return postDate.toDateString() === date.toDateString();
        });
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const days = getDaysInMonth(currentMonth);
    const today = new Date();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
                            <p className="text-gray-500">View and manage scheduled posts</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/blog/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        + New Post
                    </Link>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 border-b">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7">
                        {days.map((date, i) => {
                            const dayPosts = getPostsForDate(date);
                            const isToday = date && date.toDateString() === today.toDateString();

                            return (
                                <div
                                    key={i}
                                    className={`min-h-[120px] border-b border-r p-2 ${!date ? 'bg-gray-50' : ''
                                        } ${isToday ? 'bg-blue-50' : ''}`}
                                >
                                    {date && (
                                        <>
                                            <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'
                                                }`}>
                                                {date.getDate()}
                                            </div>
                                            <div className="space-y-1">
                                                {dayPosts.map(post => (
                                                    <Link
                                                        key={post.id}
                                                        href={`/admin/blog/edit/${post.slug}`}
                                                        className={`block text-xs p-1 rounded truncate ${post.status === 'published'
                                                                ? 'bg-green-100 text-green-700'
                                                                : post.status === 'scheduled'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        {post.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
                        <span className="text-gray-600">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                        <span className="text-gray-600">Published</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
                        <span className="text-gray-600">Draft</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
