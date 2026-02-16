"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Trash2, Save, X, BookOpen, Loader2, ExternalLink } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: In a real app, use a proper hook or context
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface KnowledgeEntry {
    id: string;
    title: string;
    category: string;
    content: string;
    source_url?: string;
    created_at: string;
}

export default function KnowledgeBasePage() {
    const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // New Entry Form State
    const [newEntry, setNewEntry] = useState({
        title: '',
        category: 'General',
        content: '',
        source_url: ''
    });

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const { data, error } = await supabase
                .from('knowledge_base')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setEntries(data || []);
        } catch (error) {
            console.error('Error fetching knowledge base:', error);
            // Fallback for demo/dev if table doesn't exist yet
            // setEntries([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newEntry.title || !newEntry.content) {
            alert('Title and Content are required');
            return;
        }

        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from('knowledge_base')
                .insert([newEntry])
                .select()
                .single();

            if (error) throw error;

            setEntries([data, ...entries]);
            setIsCreating(false);
            setNewEntry({ title: '', category: 'General', content: '', source_url: '' });
        } catch (error: any) {
            console.error('Error creating entry:', error);
            alert('Failed to save: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this knowledge entry?')) return;

        try {
            const { error } = await supabase
                .from('knowledge_base')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setEntries(entries.filter(e => e.id !== id));
        } catch (error: any) {
            console.error('Error deleting entry:', error);
            alert('Failed to delete: ' + error.message);
        }
    };

    const filteredEntries = entries.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex bg-gray-50 items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50">
            <Link 
                href="/admin/blog" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Blog Admin</span>
            </Link>

            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        Knowledge Base (The Brain)
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                        Manage the core knowledge, facts, and resources that the Blog Automation Agent uses to generate accurate content.
                        Information added here will be used as context to prevent hallucinations.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Knowledge
                </button>
            </header>

            {/* Creation Modal/Overlay */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Add New Knowledge</h2>
                            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., FaMED Exam Format 2026"
                                    value={newEntry.title}
                                    onChange={e => setNewEntry({...newEntry, title: e.target.value})}
                                />
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newEntry.category}
                                        onChange={e => setNewEntry({...newEntry, category: e.target.value})}
                                    >
                                        <option value="General">General</option>
                                        <option value="Exam Facts">Exam Facts</option>
                                        <option value="Study Resource">Study Resource</option>
                                        <option value="Medical Guidelines">Medical Guidelines</option>
                                        <option value="Brand Voice">Brand Voice</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Source URL (Optional)</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="https://..."
                                        value={newEntry.source_url}
                                        onChange={e => setNewEntry({...newEntry, source_url: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content / Facts</label>
                                <textarea 
                                    rows={8}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    placeholder="Paste relevant facts, text excerpts, or guidelines here..."
                                    value={newEntry.content}
                                    onChange={e => setNewEntry({...newEntry, content: e.target.value})}
                                />
                                <p className="text-xs text-gray-500 mt-1">This content will be injected into the AI prompt.</p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button 
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreate}
                                disabled={isSaving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Knowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search knowledge..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Entries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map(entry => (
                    <div key={entry.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                                {entry.category}
                            </span>
                            <button 
                                onClick={() => handleDelete(entry.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{entry.title}</h3>
                        
                        <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                           <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono">{entry.content}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 text-xs text-gray-500">
                             <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                             {entry.source_url && (
                                 <a 
                                    href={entry.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                 >
                                    Source <ExternalLink className="w-3 h-3" />
                                 </a>
                             )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredEntries.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No knowledge found</h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                        Add facts, guidelines, or resource text to help the AI write better content.
                    </p>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        + Add your first entry
                    </button>
                </div>
            )}
        </div>
    );
}
