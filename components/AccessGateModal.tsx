
import React, { useState } from 'react';
import { Lock, Sun, User, Star, ArrowRight, ShieldCheck, Mail, Phone, Crown } from 'lucide-react';
import { AccessLevel, UserProfile } from '../types';

interface AccessGateModalProps {
  currentLevel: AccessLevel;
  minutesUsed: number;
  onLogin: (profile: UserProfile) => void;
  onUpgrade: () => void;
}

const AccessGateModal: React.FC<AccessGateModalProps> = ({ currentLevel, minutesUsed, onLogin, onUpgrade }) => {
  const [view, setView] = useState<'login' | 'payment'>(currentLevel === 'guest' ? 'login' : 'payment');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newProfile: UserProfile = {
        name: formData.name || 'Seeker',
        email: formData.email,
        phone: formData.phone,
        isPremium: false,
        joinedDate: Date.now()
      };
      onLogin(newProfile);
      setIsSubmitting(false);
    }, 1500);
  };

  const handlePayment = () => {
    setIsSubmitting(true);
    // Simulate Payment Gateway
    setTimeout(() => {
      onUpgrade();
      setIsSubmitting(false);
    }, 2000);
  };

  const isGuestLimit = currentLevel === 'guest';

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-stone-900 border border-saffron-500/30 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-saffron-500/20 blur-3xl pointer-events-none"></div>

        <div className="p-8 relative z-10 text-center">
          
          <div className="w-20 h-20 mx-auto bg-stone-800 rounded-full flex items-center justify-center border-2 border-stone-700 mb-6 shadow-lg">
            {isGuestLimit ? (
              <Lock size={32} className="text-stone-400" />
            ) : (
              <Crown size={32} className="text-saffron-500 animate-pulse" />
            )}
          </div>

          {isGuestLimit ? (
            <>
              <h2 className="font-serif text-2xl text-white font-bold mb-2">The Gate is Closed</h2>
              <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                You have completed your <span className="text-saffron-400 font-bold">30 minutes</span> of daily Sadhana. 
                To walk further on this path today, identify yourself.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif text-2xl text-white font-bold mb-2">The Inner Sanctum</h2>
              <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                You have journeyed far (90 mins). To access the infinite library and speak with the Sages without bounds, offer Dakshina.
              </p>
            </>
          )}

          {/* LOGIN FORM (For Guests) */}
          {isGuestLimit && view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Your Name</label>
                <div className="relative mt-1">
                  <User size={16} className="absolute left-3 top-3.5 text-stone-500" />
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1">Email or Phone</label>
                <div className="relative mt-1">
                  <Mail size={16} className="absolute left-3 top-3.5 text-stone-500" />
                  <input 
                    required
                    type="text" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 outline-none transition-all"
                    placeholder="contact@email.com"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-4 bg-gradient-to-r from-saffron-600 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-saffron-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Opening Gates...</span>
                ) : (
                  <>
                    <span>Extend to 90 Minutes</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-stone-500 text-center mt-4">
                <ShieldCheck size={10} className="inline mr-1" />
                Your journey is sacred and private.
              </p>
            </form>
          )}

          {/* PAYMENT VIEW (For Seekers) */}
          {(!isGuestLimit || view === 'payment') && (
            <div className="space-y-6">
               <div className="bg-stone-800/50 p-4 rounded-xl border border-saffron-500/20 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-saffron-400 font-bold text-lg">Premium Tier</span>
                    <span className="bg-saffron-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">LIFETIME</span>
                  </div>
                  <ul className="space-y-2 text-sm text-stone-300">
                    <li className="flex items-center"><Star size={12} className="text-saffron-500 mr-2" /> Unlimited Access</li>
                    <li className="flex items-center"><Star size={12} className="text-saffron-500 mr-2" /> All 108 Lessons</li>
                    <li className="flex items-center"><Star size={12} className="text-saffron-500 mr-2" /> Unlimited Sage Conversations</li>
                  </ul>
               </div>

               <button 
                onClick={handlePayment}
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-stone-900 font-bold rounded-xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing Offering...</span>
                ) : (
                  <>
                    <span>Unlock Eternity for ₹999</span>
                    <Crown size={18} className="text-saffron-600" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
        
        {/* Footer Info */}
        <div className="bg-stone-950 p-4 text-center border-t border-stone-800">
           <div className="flex items-center justify-center space-x-2 text-stone-500 text-xs">
             <Sun size={14} />
             <span>Resets daily at sunrise (6:00 AM)</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AccessGateModal;
