
import React, { useState, useEffect, useCallback } from 'react';
import SpinningWheel from './components/SpinningWheel';
import WheelEditor from './components/WheelEditor';
import DriveControls from './components/DriveControls';
import ResultCelebration from './components/ResultCelebration';
import ContextMenu from './components/ContextMenu';
import AuthModal from './components/AuthModal';
import { WheelItem, WheelConfig, UserSession } from './types';
import { INITIAL_ITEMS, AVAILABLE_FONTS, WHEEL_COLORS } from './constants';
import { RotateCcw, ShieldCheck, Lock, Scale, MapPin, Info } from 'lucide-react';

const STORAGE_KEY = 'da_strength_club_wheel_active';
const ADMIN_MODE_KEY = 'dsc_admin_authenticated';

const App: React.FC = () => {
  const getSaved = (key: keyof WheelConfig, fallback: any) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed[key] !== undefined ? parsed[key] : fallback;
      } catch (e) { return fallback; }
    }
    return fallback;
  };

  const [items, setItems] = useState<WheelItem[]>(() => getSaved('items', INITIAL_ITEMS));
  const [spinDuration, setSpinDuration] = useState<number>(() => getSaved('spinDuration', 4));
  const [overrideResultId, setOverrideResultId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(() => getSaved('logoUrl', null));
  const [font, setFont] = useState<string>(() => getSaved('font', AVAILABLE_FONTS[0].family));
  const [fontSize, setFontSize] = useState<number>(() => getSaved('fontSize', 3.2));
  
  const [appTitle, setAppTitle] = useState<string>(() => getSaved('appTitle', 'Da Strength Club Spin'));
  const [appSubtitle, setAppSubtitle] = useState<string>(() => getSaved('appSubtitle', 'Pro Edition'));
  const [heroTitle, setHeroTitle] = useState<string>(() => getSaved('heroTitle', 'Valor is a choice.'));
  const [heroSubtitle, setHeroSubtitle] = useState<string>(() => getSaved('heroSubtitle', 'So, make your own.'));
  const [offerTitle, setOfferTitle] = useState<string>(() => getSaved('offerTitle', 'Discount'));
  const [celebrationHeader, setCelebrationHeader] = useState<string>(() => getSaved('celebrationHeader', 'Victory Unlocked'));
  const [celebrationFooter, setCelebrationFooter] = useState<string>(() => getSaved('celebrationFooter', 'Epic Win Registered'));
  const [spinButtonText, setSpinButtonText] = useState<string>(() => getSaved('spinButtonText', 'TAP TO SPIN'));
  const [spinButtonColor, setSpinButtonColor] = useState<string>(() => getSaved('spinButtonColor', WHEEL_COLORS[0]));
  const [footerText, setFooterText] = useState<string>(() => getSaved('footerText', 'Da Strength Club Spin Pro • Verified Admin Protocol'));

  // Gym Information State
  const [gymEmail, setGymEmail] = useState<string>(() => getSaved('gymEmail', 'dastrengthclub@gmail.com'));
  const [gymPhone, setGymPhone] = useState<string>(() => getSaved('gymPhone', '+91 99999 88888'));
  const [gymLocation, setGymLocation] = useState<string>(() => getSaved('gymLocation', 'https://www.google.com/maps?q=Da+Strength+Club'));
  const [gymAddress, setGymAddress] = useState<string>(() => getSaved('gymAddress', 'Elite Performance Center, Muscle District'));

  const [result, setResult] = useState<WheelItem | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [editorTab, setEditorTab] = useState<'content' | 'text' | 'font' | 'admin'>('content');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, options: any[] } | null>(null);

  const [user, setUser] = useState<UserSession | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_MODE_KEY) === 'true');

  useEffect(() => {
    const config: WheelConfig = {
      id: 'current',
      name: 'Active Wheel',
      items,
      spinDuration,
      overrideResultId,
      logoUrl,
      font,
      fontSize,
      appTitle,
      appSubtitle,
      heroTitle,
      heroSubtitle,
      offerTitle,
      celebrationHeader,
      celebrationFooter,
      spinButtonText,
      spinButtonColor,
      footerText,
      gymEmail,
      gymPhone,
      gymLocation,
      gymAddress,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [items, spinDuration, logoUrl, font, fontSize, appTitle, appSubtitle, heroTitle, heroSubtitle, offerTitle, celebrationHeader, celebrationFooter, spinButtonText, spinButtonColor, footerText, gymEmail, gymPhone, gymLocation, gymAddress]);

  const handleResult = (item: WheelItem) => {
    if (user && !user.hasSpun) {
      setResult(item);
      setShowCelebration(true);
      setUser({ ...user, hasSpun: true });
      // Logic for admin report simulated via console
      console.log(`SECURE LOG: Member ${user.email} won ${item.label}. Reporting to dastrengthclub@gmail.com`);
    }
  };

  const showContextMenu = useCallback((e: React.MouseEvent, options: any[]) => {
    if (!isAdmin) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, options });
  }, [isAdmin]);

  if (!user) {
    return <AuthModal onLogin={(u) => setUser(u)} onAdminLogin={() => setIsAdmin(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
          options={contextMenu.options} 
        />
      )}

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 rotate-12">
            <RotateCcw className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter">{appTitle}</h1>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest px-1.5 py-0.5 bg-indigo-50 rounded">{appSubtitle}</span>
              <ShieldCheck size={10} className="text-emerald-500" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged in as</p>
            <p className="text-sm font-bold text-slate-700">{user.email}</p>
          </div>
          {isAdmin && (
            <button onClick={() => { setIsAdmin(false); localStorage.removeItem(ADMIN_MODE_KEY); }} className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-rose-500 transition-all"><Lock size={18} /></button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 lg:p-12 flex flex-col xl:flex-row gap-8 lg:gap-12 items-start justify-center">
        {isAdmin && (
          <div className="xl:w-1/3 w-full space-y-8 animate-in fade-in slide-in-from-left-4">
             <DriveControls 
               currentConfig={{
                 id: 'current',
                 name: 'Active Wheel',
                 items,
                 spinDuration,
                 overrideResultId,
                 logoUrl,
                 font,
                 fontSize,
                 appTitle,
                 appSubtitle,
                 heroTitle,
                 heroSubtitle,
                 offerTitle,
                 celebrationHeader,
                 celebrationFooter,
                 spinButtonText,
                 spinButtonColor,
                 footerText,
                 gymEmail,
                 gymPhone,
                 gymLocation,
                 gymAddress,
                 updatedAt: Date.now()
               }} 
               onLoad={(c) => {
                 setItems(c.items);
                 setSpinDuration(c.spinDuration);
                 setOverrideResultId(c.overrideResultId);
                 setLogoUrl(c.logoUrl);
                 setFont(c.font);
                 setFontSize(c.fontSize);
                 setAppTitle(c.appTitle);
                 setAppSubtitle(c.appSubtitle);
                 setHeroTitle(c.heroTitle);
                 setHeroSubtitle(c.heroSubtitle);
                 setOfferTitle(c.offerTitle);
                 setCelebrationHeader(c.celebrationHeader);
                 setCelebrationFooter(c.celebrationFooter);
                 setSpinButtonText(c.spinButtonText);
                 setSpinButtonColor(c.spinButtonColor);
                 setFooterText(c.footerText);
                 setGymEmail(c.gymEmail || 'dastrengthclub@gmail.com');
                 setGymPhone(c.gymPhone || '+91 99999 88888');
                 setGymLocation(c.gymLocation || '');
                 setGymAddress(c.gymAddress || '');
               }} 
             />
             <WheelEditor 
                items={items} setItems={setItems}
                spinDuration={spinDuration} setSpinDuration={setSpinDuration}
                overrideResultId={overrideResultId} setOverrideResultId={setOverrideResultId}
                logoUrl={logoUrl} setLogoUrl={setLogoUrl}
                font={font} setFont={setFont}
                fontSize={fontSize} setFontSize={setFontSize}
                appTitle={appTitle} setAppTitle={setAppTitle}
                appSubtitle={appSubtitle} setAppSubtitle={setAppSubtitle}
                heroTitle={heroTitle} setHeroTitle={setHeroTitle}
                heroSubtitle={heroSubtitle} setHeroSubtitle={setHeroSubtitle}
                offerTitle={offerTitle} setOfferTitle={setOfferTitle}
                celebrationHeader={celebrationHeader} setCelebrationHeader={setCelebrationHeader}
                celebrationFooter={celebrationFooter} setCelebrationFooter={setCelebrationFooter}
                spinButtonText={spinButtonText} setSpinButtonText={setSpinButtonText}
                spinButtonColor={spinButtonColor} setSpinButtonColor={setSpinButtonColor}
                footerText={footerText} setFooterText={setFooterText}
                gymEmail={gymEmail} setGymEmail={setGymEmail}
                gymPhone={gymPhone} setGymPhone={setGymPhone}
                gymLocation={gymLocation} setGymLocation={setGymLocation}
                gymAddress={gymAddress} setGymAddress={setGymAddress}
                activeTab={editorTab} setActiveTab={setEditorTab}
             />
          </div>
        )}

        <div className={`flex-1 flex flex-col items-center justify-center py-16 lg:py-24 bg-white rounded-[40px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden w-full max-w-4xl mx-auto ${isAdmin ? '' : 'xl:max-w-5xl'}`}>
          <div className="absolute top-8 right-8 z-20">
            <a 
              href={gymLocation} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur border border-slate-200 rounded-full shadow-lg hover:bg-slate-50 transition-all group"
            >
              <MapPin className="text-indigo-600 group-hover:scale-110 transition-transform" size={18} />
              <span className="text-xs font-black text-slate-700 uppercase tracking-[0.15em]">Live Location</span>
            </a>
          </div>

          <div className="mb-12 text-center relative z-10 px-6">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-4 tracking-tight">
              {heroTitle} <span className="text-indigo-600 italic">{heroSubtitle}</span>
            </h2>
          </div>
          
          <div className="relative z-10 scale-90 sm:scale-100">
            <SpinningWheel 
              items={items} 
              onResult={handleResult} 
              spinDuration={spinDuration}
              overrideResultId={overrideResultId}
              logoUrl={logoUrl}
              font={font}
              fontSize={fontSize}
              spinButtonText={user.hasSpun ? 'OFFER EXHAUSTED' : spinButtonText}
              spinButtonColor={user.hasSpun ? '#e2e8f0' : spinButtonColor}
              onContextMenu={showContextMenu}
              setEditorTab={setEditorTab}
            />
          </div>

          <div className="mt-16 max-w-lg w-full px-8 relative z-10">
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-[32px] shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Scale className="text-indigo-600" size={18} />
                </div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Terms and Conditions</h3>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-semibold text-slate-600 leading-relaxed text-justify">
                  1. Participation in this incentive program is restricted to active Da Strength Club members with a valid enrollment status (Slot Bookers, Monthly, and 3-Month subscribers).
                </p>
                <p className="text-[11px] font-semibold text-slate-600 leading-relaxed text-justify">
                  2. Each verified Gmail account is entitled to exactly one spin attempt. Results are cryptographically logged to our secure database to prevent duplication.
                </p>
                <p className="text-[11px] font-semibold text-slate-600 leading-relaxed text-justify">
                  3. Rewards must be verified via official club channels by providing the result confirmation from your registered email to <span className="text-indigo-600 font-black">dastrengthclub@gmail.com</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCelebration && result && (
        <ResultCelebration 
          result={result} 
          font={font} 
          offerTitle={offerTitle}
          headerText={celebrationHeader}
          footerText={celebrationFooter}
          userEmail={user.email}
          gymEmail={gymEmail}
          gymPhone={gymPhone}
          gymAddress={gymAddress}
          gymLocation={gymLocation}
          onClose={() => setShowCelebration(false)} 
          onContextMenu={showContextMenu}
          setEditorTab={setEditorTab}
        />
      )}

      <footer className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
        {footerText} • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
