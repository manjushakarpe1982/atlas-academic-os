'use client';
import { useState } from 'react';
import { ChevronLeft, Clock, MapPin, BookOpen, Target, ArrowRight, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { CalEvent, getTypeBadge, getTypeIcon } from './shared';

interface Props { event: CalEvent; onBack: () => void; onEdit: () => void; }

export default function EventDetail({ event, onBack, onEdit }: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const badge = getTypeBadge(event.type);

  // Delete success
  if (deleted) {
    return (
      <div className="px-4 py-4 pb-24">
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Event Deleted Successfully!</h2>
          <p className="text-sm text-gray-500 text-center">The event has been removed from your calendar and upcoming list.</p>
          <button onClick={onBack}
            className="mt-4 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl text-sm">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <span className="text-sm font-bold text-gray-400">Event Details</span>
        </div>
        <button onClick={onEdit} className="text-sm font-bold text-indigo-600 flex items-center gap-1">
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
      </div>

      {/* Event Header Card */}
      <div className={`${event.color} rounded-2xl p-5 mb-4`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">
            {getTypeIcon(event.type)}
          </div>
          <div>
            <p className="text-lg font-extrabold text-gray-900">{event.title}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>{badge.text}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 mb-4">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Clock className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-xs text-gray-400">Date & Time</p>
            <p className="text-sm font-bold text-gray-900">Tomorrow, May {event.date}, 2025</p>
            <p className="text-xs text-gray-500">{event.time}{event.endTime ? ` – ${event.endTime}` : ''}</p>
          </div>
        </div>
        {event.location && (
          <div className="flex items-center gap-3 px-4 py-3.5">
            <MapPin className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-sm font-bold text-gray-900">{event.location}</p>
            </div>
          </div>
        )}
        {event.className && (
          <div className="flex items-center gap-3 px-4 py-3.5">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-400">Class</p>
              <p className="text-sm font-bold text-gray-900">{event.className}</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <p className="text-xs font-bold text-gray-400 mb-1">Description</p>
          <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
        </div>
      )}

      {/* Grade & Weight */}
      {(event.weight > 0 || event.currentGrade !== null) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {event.weight > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-indigo-600 font-medium">Worth</p>
              <p className="text-2xl font-extrabold text-indigo-700">{event.weight}%</p>
              <p className="text-[10px] text-indigo-400">of your grade</p>
            </div>
          )}
          {event.currentGrade !== null && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-400 font-medium">Current Grade</p>
              <p className={`text-2xl font-extrabold ${
                event.currentGrade >= 80 ? 'text-green-600' : event.currentGrade >= 60 ? 'text-amber-600' : 'text-red-600'
              }`}>{event.currentGrade}%</p>
            </div>
          )}
        </div>
      )}

      {/* Recommended Focus */}
      {event.type !== 'personal' && event.type !== 'class' && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <p className="text-xs font-bold text-green-700">Recommended Focus</p>
          </div>
          <p className="text-sm text-gray-700 font-semibold">{event.className || 'General'}</p>
          <p className="text-xs text-gray-500 mt-0.5">Based on your performance</p>
        </div>
      )}

      {/* Start Studying */}
      {event.type !== 'personal' && event.type !== 'class' && (
        <button className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-2 mb-4">
          Start Studying <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Delete */}
      <button onClick={() => setShowDelete(true)}
        className="w-full text-red-600 font-bold py-3 text-sm flex items-center justify-center gap-2">
        <Trash2 className="w-4 h-4" /> Delete Event
      </button>

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-base font-extrabold text-gray-900">Delete Event</h2>
            <p className="text-sm text-gray-500">Are you sure you want to delete &quot;{event.title}&quot;?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)}
                className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setShowDelete(false); setDeleted(true); }}
                className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
